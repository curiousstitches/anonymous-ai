'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { logEvent } from '@/lib/eventLog';

const AuthContext = createContext<any>({});

// Admin credentials — local bypass (no Supabase account required)
const ADMIN_EMAIL = 'happy-dadz@codepilot.dev';
const ADMIN_PASSWORD = '1234Admin';

// Synthetic admin user object (mirrors Supabase user shape)
const ADMIN_USER = {
  id: 'admin-local-001',
  email: ADMIN_EMAIL,
  email_confirmed_at: new Date().toISOString(),
  role: 'admin',
  app_metadata: {},
  user_metadata: { full_name: 'Happy-Dadz' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
};

const ADMIN_SESSION_KEY = 'codepilot_admin_session';
const ADMIN_COOKIE_NAME = 'codepilot_admin_auth';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Check for persisted admin session first
    try {
      const stored = sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (stored === 'true') {
        setUser(ADMIN_USER);
        setSession({ user: ADMIN_USER });
        setLoading(false);
        return;
      }
    } catch (_) {}

    // Get initial Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Don't override admin session
      try {
        if (sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true') return;
      } catch (_) {}
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Email/Password Sign Up
  const signUp = async (email: string, password: string, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: (metadata as any)?.fullName || '',
          avatar_url: (metadata as any)?.avatarUrl || ''
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) {
      logEvent('auth', 'error', 'Sign-up failed', { user: email, detail: error.message });
      throw error;
    }
    logEvent('auth', 'success', 'New user registered', { user: email });
    return data;
  };

  // Email/Password Sign In — with local admin bypass
  const signIn = async (email: string, password: string) => {
    // Admin local bypass — no Supabase call needed
    if (
      email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
      password === ADMIN_PASSWORD
    ) {
      try { sessionStorage.setItem(ADMIN_SESSION_KEY, 'true'); } catch (_) {}
      // Set a cookie so the middleware can detect the admin session
      try {
        document.cookie = `${ADMIN_COOKIE_NAME}=true; path=/; SameSite=Lax`;
      } catch (_) {}
      setUser(ADMIN_USER);
      setSession({ user: ADMIN_USER });
      logEvent('auth', 'info', 'Admin signed in', { user: email });
      return { user: ADMIN_USER, session: { user: ADMIN_USER } };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      logEvent('auth', 'warning', 'Sign-in failed', { user: email, detail: error.message });
      throw error;
    }
    logEvent('auth', 'success', 'User signed in', { user: email });
    return data;
  };

  // Sign Out
  const signOut = async () => {
    // Clear admin session if active
    try {
      if (sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true') {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        // Clear admin cookie
        document.cookie = `${ADMIN_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        logEvent('auth', 'info', 'Admin signed out', { user: ADMIN_EMAIL });
        setUser(null);
        setSession(null);
        return;
      }
    } catch (_) {}

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    logEvent('auth', 'info', 'User signed out');
  };

  // Get Current User
  const getCurrentUser = async () => {
    // Return admin user directly if admin session is active
    try {
      if (sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true') return ADMIN_USER;
    } catch (_) {}
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  };

  // Check if Email is Verified
  const isEmailVerified = () => {
    return user?.email_confirmed_at !== null;
  };

  // Check if current user is admin
  const isAdmin = () => {
    return user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  };

  // Get User Profile from Database
  const getUserProfile = async () => {
    if (!user) return null;
    // Admin has no DB profile
    if (user.id === ADMIN_USER.id) return { id: ADMIN_USER.id, full_name: 'Happy-Dadz', email: ADMIN_EMAIL };
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (error) throw error;
    return data;
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    getCurrentUser,
    isEmailVerified,
    isAdmin,
    getUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
