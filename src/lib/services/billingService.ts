'use client';

import { createClient } from '@/lib/supabase/client';
import { isSchemaError, readLocal, subscribeToLocalStore, writeLocal } from './store-utils';

export interface BillingProfile {
  id: string;
  userId: string;
  planName: string;
  monthlyBudget: number;
  premiumAdultThemesUnlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PremiumUnlock {
  id: string;
  userId: string;
  providerName: string;
  monthlyPrice: number;
  status: 'active' | 'trial' | 'canceled';
  createdAt: string;
}

export interface BillingEvent {
  id: string;
  userId: string;
  title: string;
  amount: number;
  status: 'simulated-paid' | 'active' | 'canceled';
  createdAt: string;
}

const profileKey = (userId: string) => `codepilot:billing:profile:${userId}`;
const unlockKey = (userId: string) => `codepilot:billing:unlocks:${userId}`;
const eventKey = (userId: string) => `codepilot:billing:events:${userId}`;

function mapProfile(row: any): BillingProfile {
  return {
    id: row.id,
    userId: row.user_id,
    planName: row.plan_name,
    monthlyBudget: row.monthly_budget,
    premiumAdultThemesUnlocked: row.premium_adult_themes_unlocked,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapUnlock(row: any): PremiumUnlock {
  return {
    id: row.id,
    userId: row.user_id,
    providerName: row.provider_name,
    monthlyPrice: row.monthly_price,
    status: row.status,
    createdAt: row.created_at,
  };
}

function mapEvent(row: any): BillingEvent {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    amount: row.amount,
    status: row.status,
    createdAt: row.created_at,
  };
}

export const billingService = {
  subscribe(userId: string, onChange: () => void) {
    const unsubscribeProfile = subscribeToLocalStore(profileKey(userId), onChange);
    const unsubscribeUnlocks = subscribeToLocalStore(unlockKey(userId), onChange);
    const unsubscribeEvents = subscribeToLocalStore(eventKey(userId), onChange);
    return () => {
      unsubscribeProfile();
      unsubscribeUnlocks();
      unsubscribeEvents();
    };
  },

  async getDashboard() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { profile: null, unlocks: [], events: [] };

    try {
      const [profileResult, unlockResult, eventResult] = await Promise.all([
        supabase.from('billing_profiles').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('premium_unlocks').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('billing_events').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ]);

      if (profileResult.error || unlockResult.error || eventResult.error) {
        const error = profileResult.error || unlockResult.error || eventResult.error;
        if (isSchemaError(error)) throw error;
      }

      return {
        profile: profileResult.data ? mapProfile(profileResult.data) : null,
        unlocks: (unlockResult.data || []).map(mapUnlock),
        events: (eventResult.data || []).map(mapEvent),
      };
    } catch (error: any) {
      if (!isSchemaError(error)) return { profile: null, unlocks: [], events: [] };
      return {
        profile: readLocal<BillingProfile | null>(profileKey(user.id), null),
        unlocks: readLocal<PremiumUnlock[]>(unlockKey(user.id), []),
        events: readLocal<BillingEvent[]>(eventKey(user.id), []),
      };
    }
  },

  async ensureProfile() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    try {
      const { data: existing } = await supabase.from('billing_profiles').select('*').eq('user_id', user.id).maybeSingle();
      if (existing) return mapProfile(existing);

      const { data, error } = await supabase
        .from('billing_profiles')
        .insert({ user_id: user.id, plan_name: 'Free Builder Lane', monthly_budget: 0, premium_adult_themes_unlocked: false })
        .select('*')
        .single();

      if (error) {
        if (isSchemaError(error)) throw error;
        return null;
      }
      return mapProfile(data);
    } catch (error: any) {
      if (!isSchemaError(error)) return null;
      const existing = readLocal<BillingProfile | null>(profileKey(user.id), null);
      if (existing) return existing;
      const profile: BillingProfile = {
        id: crypto.randomUUID(),
        userId: user.id,
        planName: 'Free Builder Lane',
        monthlyBudget: 0,
        premiumAdultThemesUnlocked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      writeLocal(profileKey(user.id), profile);
      return profile;
    }
  },

  async activatePremium(input: { providerName: string; monthlyPrice: number; unlockAdultThemes?: boolean; }) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    await this.ensureProfile();

    try {
      const { data: unlockRow, error: unlockError } = await supabase
        .from('premium_unlocks')
        .insert({ user_id: user.id, provider_name: input.providerName, monthly_price: input.monthlyPrice, status: 'active' })
        .select('*')
        .single();

      if (unlockError) {
        if (isSchemaError(unlockError)) throw unlockError;
        return null;
      }

      await supabase.from('billing_events').insert({
        user_id: user.id,
        title: `Activated ${input.providerName}`,
        amount: input.monthlyPrice,
        status: 'simulated-paid',
      });

      if (input.unlockAdultThemes) {
        await supabase.from('billing_profiles').update({ premium_adult_themes_unlocked: true, plan_name: 'Premium Builder Lane', monthly_budget: input.monthlyPrice }).eq('user_id', user.id);
      }

      return mapUnlock(unlockRow);
    } catch (error: any) {
      if (!isSchemaError(error)) return null;
      const unlock: PremiumUnlock = {
        id: crypto.randomUUID(),
        userId: user.id,
        providerName: input.providerName,
        monthlyPrice: input.monthlyPrice,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      const profile = await this.ensureProfile();
      if (profile) {
        writeLocal(profileKey(user.id), {
          ...profile,
          planName: 'Premium Builder Lane',
          monthlyBudget: Math.max(profile.monthlyBudget, input.monthlyPrice),
          premiumAdultThemesUnlocked: profile.premiumAdultThemesUnlocked || Boolean(input.unlockAdultThemes),
          updatedAt: new Date().toISOString(),
        });
      }
      writeLocal(unlockKey(user.id), [unlock, ...readLocal<PremiumUnlock[]>(unlockKey(user.id), [])]);
      writeLocal(eventKey(user.id), [
        {
          id: crypto.randomUUID(),
          userId: user.id,
          title: `Activated ${input.providerName}`,
          amount: input.monthlyPrice,
          status: 'simulated-paid',
          createdAt: new Date().toISOString(),
        },
        ...readLocal<BillingEvent[]>(eventKey(user.id), []),
      ]);
      return unlock;
    }
  },
};
