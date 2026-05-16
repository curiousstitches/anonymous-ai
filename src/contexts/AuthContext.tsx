'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type AuthUser = {
  id: string;
  email?: string;
  role?: string;
  user_metadata?: {
    full_name?: string;
  };
};

type AuthContextValue = {
  user: AuthUser | null;
  session: { user: AuthUser } | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: { fullName?: string }) => Promise<unknown>;
  signIn: (email: string, password: string) => Promise<unknown>;
  signOut: () => Promise<void>;
  getCurrentUser: () => Promise<AuthUser | null>;
  isEmailVerified: () => boolean;
  isAdmin: () => boolean;
  getUserProfile: () => Promise<{ id: string; full_name: string; email?: string } | null>;
};

const DEFAULT_ADMIN_EMAIL = 'happy-dadz@codepilot.dev';
const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

async function fetchAdminSession() {
  const response = await fetch('/api/admin-session', { cache: 'no-store' });
  if (!response.ok) return null;
  const data = await response.json();
  return data.user as AuthUser;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<{ user: AuthUser } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const initialize = async () => {
      const adminUser = await fetchAdminSession();
      if (!active) return;
      if (adminUser) {
        setUser(adminUser);
        setSession({ user: adminUser });
        setLoading(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setSession((data.session?.user ? { user: data.session.user as AuthUser } : null));
      setUser((data.session?.user as AuthUser) ?? null);
      setLoading(false);
    };

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      const adminUser = await fetchAdminSession();
      if (!active) return;
      if (adminUser) {
        setUser(adminUser);
        setSession({ user: adminUser });
        setLoading(false);
        return;
      }
      setSession(nextSession?.user ? { user: nextSession.user as AuthUser } : null);
      setUser((nextSession?.user as AuthUser) ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signUp = async (email: string, password: string, metadata: { fullName?: string } = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: metadata.fullName || '' },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return data;
  };

  const signIn = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail === DEFAULT_ADMIN_EMAIL) {
      const adminResponse = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });

      if (adminResponse.ok) {
        const data = await adminResponse.json();
        setUser(data.user);
        setSession({ user: data.user });
        return data;
      }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    if (user?.role === 'admin') {
      await fetch('/api/admin-logout', { method: 'POST' });
      setUser(null);
      setSession(null);
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
  };

  const getCurrentUser = async () => {
    const adminUser = await fetchAdminSession();
    if (adminUser) return adminUser;
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return (data.user as AuthUser) ?? null;
  };

  const isEmailVerified = () => Boolean(user?.email);
  const isAdmin = () => user?.role === 'admin' || user?.email?.toLowerCase() === DEFAULT_ADMIN_EMAIL;

  const getUserProfile = async () => {
    if (!user) return null;
    if (isAdmin()) {
      return {
        id: user.id,
        full_name: user.user_metadata?.full_name || 'Owner Admin',
        email: user.email,
      };
    }

    const { data, error } = await supabase.from('user_profiles').select('*').eq('id', user.id).single();
    if (error) throw error;
    return data;
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      getCurrentUser,
      isEmailVerified,
      isAdmin,
      getUserProfile,
    }),
    [user, session, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
