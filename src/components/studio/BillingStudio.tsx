'use client';

import { useEffect, useState } from 'react';
import { Crown, Receipt, WalletCards } from 'lucide-react';
import { toast } from 'sonner';
import { billingService, type BillingEvent, type BillingProfile, type PremiumUnlock } from '@/lib/services/billingService';
import { premiumProviders } from '@/lib/studio-data';
import { useAuth } from '@/contexts/AuthContext';
import { Panel, Pill, SectionHeader } from './StudioPrimitives';

const premiumPlans = [
  { title: 'Adult premium theme pack', price: 10, description: 'Unlock the premium adult theme category for $10.', unlockAdultThemes: true },
  { title: 'OpenAI premium lane', price: 29, description: 'Activate a premium provider lane for higher-end coding sessions.' },
  { title: 'Anthropic premium lane', price: 29, description: 'Enable long-form premium reasoning and code review workflows.' },
  { title: 'Gemini premium lane', price: 25, description: 'Enable multimodal premium prompts and larger-context workflows.' },
];

export default function BillingStudio() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<BillingProfile | null>(null);
  const [unlocks, setUnlocks] = useState<PremiumUnlock[]>([]);
  const [events, setEvents] = useState<BillingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);
    await billingService.ensureProfile();
    const dashboard = await billingService.getDashboard();
    setProfile(dashboard.profile);
    setUnlocks(dashboard.unlocks);
    setEvents(dashboard.events);
    setLoading(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = billingService.subscribe(user.id, loadDashboard);
    return unsubscribe;
  }, [user]);

  const activatePlan = async (providerName: string, monthlyPrice: number, unlockAdultThemes = false) => {
    const result = await billingService.activatePremium({ providerName, monthlyPrice, unlockAdultThemes });
    if (!result) {
      toast.error('Could not activate this premium lane.');
      return;
    }
    toast.success(`${providerName} activated`);
    loadDashboard();
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Billing center"
        title="Premium provider unlocks, billing posture, and the paid API catalog in one place."
        description="This adds a functional billing center so users can activate premium lanes, track billing events, and unlock premium theme packs without losing the free-first product model."
        actions={
          <>
            <Pill tone="premium">Premium activation</Pill>
            {profile?.premiumAdultThemesUnlocked ? <Pill tone="success">Adult pack unlocked</Pill> : null}
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel className="p-6">
          <div className="text-4xl font-semibold text-white">{profile?.monthlyBudget ?? 0}</div>
          <p className="mt-3 text-lg font-medium text-white">Monthly premium budget</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">Current plan: {profile?.planName || 'Free Builder Lane'}</p>
        </Panel>
        <Panel className="p-6">
          <div className="text-4xl font-semibold text-white">{unlocks.length}</div>
          <p className="mt-3 text-lg font-medium text-white">Active premium lanes</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">Separate premium providers keep the upgrade path user-directed.</p>
        </Panel>
        <Panel className="p-6">
          <div className="text-4xl font-semibold text-white">{events.length}</div>
          <p className="mt-3 text-lg font-medium text-white">Billing events</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">A running ledger shows what was activated and when.</p>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel className="space-y-5 p-6">
          <div className="flex items-center gap-3">
            <WalletCards className="h-5 w-5 text-cyan-300" />
            <div>
              <p className="text-lg font-medium text-white">Activate premium lanes</p>
              <p className="text-sm text-slate-400">This checkout-ready flow records the upgrade and unlocks the premium feature lane in-app immediately.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {premiumPlans.map((plan) => (
              <div key={plan.title} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                <p className="text-lg font-medium text-white">{plan.title}</p>
                <div className="mt-3 text-3xl font-semibold text-white">${plan.price}</div>
                <p className="mt-3 text-sm leading-6 text-slate-400">{plan.description}</p>
                <button className="mt-5 rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-4 py-2 text-sm text-fuchsia-100 transition hover:border-fuchsia-300/30" onClick={() => activatePlan(plan.title, plan.price, plan.unlockAdultThemes)}>
                  Activate now
                </button>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="space-y-5 p-6">
          <div className="flex items-center gap-3">
            <Crown className="h-5 w-5 text-fuchsia-200" />
            <div>
              <p className="text-lg font-medium text-white">Top premium APIs</p>
              <p className="text-sm text-slate-400">The paid section stays visible as an upsell catalog.</p>
            </div>
          </div>
          <div className="space-y-3">
            {premiumProviders.map((provider) => (
              <div key={provider.name} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-base font-medium text-white">{provider.name}</p>
                  <span className="rounded-full border px-3 py-1 text-xs font-medium" style={{ borderColor: `${provider.accent}40`, color: provider.accent, background: `${provider.accent}15` }}>
                    Premium
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{provider.summary}</p>
                <button className="mt-4 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-100" onClick={() => activatePlan(provider.name, provider.name.includes('Google') ? 25 : 29)}>
                  Unlock provider
                </button>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel className="space-y-4 p-6">
          <div className="flex items-center gap-3">
            <Receipt className="h-5 w-5 text-amber-200" />
            <p className="text-lg font-medium text-white">Billing ledger</p>
          </div>
          {loading ? <p className="text-sm text-slate-400">Loading…</p> : events.length === 0 ? <p className="text-sm text-slate-400">No billing events yet.</p> : events.map((event) => (
            <div key={event.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-white">{event.title}</p>
                <span className="text-sm text-slate-200">${event.amount}</span>
              </div>
              <p className="mt-2 text-xs uppercase tracking-[0.22em] text-slate-500">{event.status}</p>
            </div>
          ))}
        </Panel>

        <Panel className="space-y-4 p-6">
          <p className="text-lg font-medium text-white">Unlocked providers</p>
          {loading ? <p className="text-sm text-slate-400">Loading…</p> : unlocks.length === 0 ? <p className="text-sm text-slate-400">No premium providers unlocked yet.</p> : unlocks.map((unlock) => (
            <div key={unlock.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-base font-medium text-white">{unlock.providerName}</p>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">{unlock.status}</span>
              </div>
              <p className="mt-2 text-sm text-slate-400">${unlock.monthlyPrice} / month</p>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}
