'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Zap, Code2, Shield, ArrowRight, ShieldCheck,  } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';

import { useAuth } from '@/contexts/AuthContext';

// Admin email — only this account sees the admin toggle
const ADMIN_EMAIL = 'happy-dadz@codepilot.dev';

type LoginForm = { email: string; password: string; remember: boolean };
type SignupForm = { name: string; email: string; password: string; confirm: string; terms: boolean };

const codeLines = [
  '> codepilot init --model ollama',
  '✓ Connecting to local LLaMA 3.1 70B...',
  '✓ Context loaded: 3 files (12.4k tokens)',
  '',
  'def binary_search(arr, target):',
  '    left, right = 0, len(arr) - 1',
  '    while left <= right:',
  '        mid = (left + right) // 2',
  '        if arr[mid] == target:',
  '            return mid',
  '        elif arr[mid] < target:',
  '            left = mid + 1',
  '        else:',
  '            right = mid - 1',
  '    return -1',
  '',
  '# CodePilot: Time O(log n), Space O(1)',
  '# Suggested optimization: early exit',
];

function TerminalDecoration() {
  return (
    <div
      className="rounded-xl border overflow-hidden card-glow"
      style={{ background: '#0a0c10', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center gap-2 px-4 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ef4444' }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#f59e0b' }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#10b981' }} />
        <span className="text-xs font-mono ml-2" style={{ color: 'var(--muted-foreground)' }}>
          codepilot — bash
        </span>
      </div>
      <div className="p-4">
        {codeLines.map((line, i) => (
          <p
            key={`code-line-${i}`}
            className="text-xs font-mono leading-relaxed"
            style={{
              color: line.startsWith('>')
                ? '#10b981' : line.startsWith('✓')
                ? '#06b6d4' : line.startsWith('#')
                ? '#64748b' : line.startsWith('def') || line.startsWith('    if') || line.startsWith('    elif') || line.startsWith('    else') || line.startsWith('    while')
                ? '#a78bfa'
                : line === '' ? 'transparent' : 'var(--foreground)',
            }}
          >
            {line || '\u00A0'}
          </p>
        ))}
      </div>
    </div>
  );
}

function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function ChromeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C8.21 0 4.831 1.757 2.632 4.501l3.953 6.848A5.454 5.454 0 0 1 12 6.545h10.691A12 12 0 0 0 12 0zM1.931 5.47A11.943 11.943 0 0 0 0 12c0 6.012 4.42 10.991 10.189 11.864l3.953-6.847a5.45 5.45 0 0 1-6.865-2.29zm13.342 2.166a5.446 5.446 0 0 1 1.45 7.09l.002.001h-.002l-5.344 9.257c.206.01.413.016.621.016 6.627 0 12-5.373 12-12 0-1.54-.29-3.011-.818-4.364zM12 10.545a1.455 1.455 0 1 0 0 2.91 1.455 1.455 0 0 0 0-2.91z" />
    </svg>
  );
}

export default function AuthScreen() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);

  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const loginForm = useForm<LoginForm>({ defaultValues: { remember: false } });
  const signupForm = useForm<SignupForm>({ defaultValues: { terms: false } });

  // Watch email field to detect admin account
  const watchedEmail = loginForm.watch('email', '');
  const isAdminEmail = watchedEmail.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const handleLogin = async (data: LoginForm) => {
    setIsLoading(true);
    setAuthError('');
    try {
      await signIn(data.email, data.password);
      await new Promise((resolve) => setTimeout(resolve, 100));
      router.replace('/workspace');
      router.refresh();
    } catch (error: any) {
      setAuthError(error?.message || 'Invalid credentials. Please check your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (data: SignupForm) => {
    setIsLoading(true);
    setAuthError('');
    setSuccessMessage('');
    try {
      await signUp(data.email, data.password, { fullName: data.name });
      router.replace('/workspace');
      router.refresh();
    } catch (error: any) {
      setAuthError(error?.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'var(--background)' }}
    >
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden bg-grid-pattern"
        style={{ background: 'var(--card)', borderRight: '1px solid var(--border)' }}
      >
        {/* Gradient blobs */}
        <div
          className="absolute top-20 left-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: 'var(--primary)' }}
        />
        <div
          className="absolute bottom-40 right-10 w-48 h-48 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ background: 'var(--accent)' }}
        />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <AppLogo size={36} />
          <span className="font-bold text-xl gradient-text">CodePilot</span>
        </div>

        {/* Hero text */}
        <div className="space-y-6 relative z-10">
          <div>
            <h2 className="text-3xl font-bold leading-tight" style={{ color: 'var(--foreground)' }}>
              Your AI coding<br />
              <span className="gradient-text">co-pilot, unlimited.</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)', maxWidth: '360px' }}>
              Self-hosted on your domain. Powered by Ollama, OpenAI, Anthropic, or Gemini. No usage caps. No per-token billing.
            </p>
          </div>

          <TerminalDecoration />

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { icon: Code2, label: '20+ Languages', color: '#10b981' },
              { icon: Zap, label: 'Self-hosted LLM', color: '#7c3aed' },
              { icon: Shield, label: 'No Data Sharing', color: '#06b6d4' },
            ].map((feat) => {
              const FeatIcon = feat.icon;
              return (
                <div
                  key={`feat-${feat.label}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    background: `${feat.color}12`,
                    border: `1px solid ${feat.color}25`,
                    color: feat.color,
                  }}
                >
                  <FeatIcon size={12} />
                  {feat.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs relative z-10" style={{ color: 'var(--muted-foreground)' }}>
          © 2026 CodePilot · Open to registered users · Self-hosted
        </p>
      </div>

      {/* Right panel — auth form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <AppLogo size={28} />
            <span className="font-bold gradient-text">CodePilot</span>
          </div>

          {/* Tabs */}
          <div
            className="flex rounded-xl p-1 mb-6"
            style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
          >
            {(['login', 'signup'] as const).map((t) => (
              <button
                key={`tab-${t}`}
                onClick={() => { setTab(t); setAuthError(''); setSuccessMessage(''); }}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95"
                style={
                  tab === t
                    ? { background: 'var(--card)', color: 'var(--foreground)', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }
                    : { color: 'var(--muted-foreground)' }
                }
              >
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Error banner */}
          {authError && (
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg mb-4 text-sm"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444' }}
            >
              <span>{authError}</span>
            </div>
          )}

          {/* Success banner */}
          {successMessage && (
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg mb-4 text-sm"
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981' }}
            >
              <span>{successMessage}</span>
            </div>
          )}

          {/* Login Form */}
          {tab === 'login' && (
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4 fade-in">
              {/* Social auth */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 active:scale-95"
                  style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                >
                  <GithubIcon size={16} />
                  GitHub
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 active:scale-95"
                  style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                >
                  <ChromeIcon size={16} />
                  Google
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>or continue with email</span>
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>
                  Email address
                </label>
                <input
                  type="email"
                  className="input-base"
                  placeholder="you@yourcompany.dev"
                  {...loginForm.register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                  })}
                />
                {loginForm.formState.errors.email && (
                  <p className="mt-1 text-xs" style={{ color: 'var(--red)' }}>
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                    Password
                  </label>
                  <button type="button" className="text-xs" style={{ color: 'var(--accent)' }}>
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input-base pr-10"
                    placeholder="••••••••"
                    {...loginForm.register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--muted-foreground)' }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="mt-1 text-xs" style={{ color: 'var(--red)' }}>
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded"
                  style={{ accentColor: 'var(--primary)' }}
                  {...loginForm.register('remember')}
                />
                <label htmlFor="remember" className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Remember me for 30 days
                </label>
              </div>

              {/* Admin toggle — only visible when admin email is typed */}
              {isAdminEmail && (
                <div
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
                  style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.25)' }}
                >
                  <ShieldCheck size={14} style={{ color: '#a78bfa' }} />
                  <span className="text-xs font-medium" style={{ color: '#a78bfa' }}>Admin account detected — enter your password to sign in</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-2.5 justify-center"
                style={isLoading ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
              >
                {isLoading ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <>
                    {isAdminEmail && isAdminMode ? (
                      <><ShieldCheck size={15} /> Sign In as Admin</>
                    ) : (
                      <>Sign In <ArrowRight size={15} /></>
                    )}
                  </>
                )}
              </button>
            </form>
          )}

          {/* Signup Form */}
          {tab === 'signup' && (
            <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4 fade-in">
              {/* Social */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 active:scale-95"
                  style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                >
                  <GithubIcon size={16} />
                  GitHub
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 active:scale-95"
                  style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                >
                  <ChromeIcon size={16} />
                  Google
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>or register with email</span>
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>
                  Display name
                </label>
                <input
                  type="text"
                  className="input-base"
                  placeholder="Alex Chen"
                  {...signupForm.register('name', { required: 'Name is required', minLength: { value: 2, message: 'Minimum 2 characters' } })}
                />
                {signupForm.formState.errors.name && (
                  <p className="mt-1 text-xs" style={{ color: 'var(--red)' }}>
                    {signupForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>
                  Email address
                </label>
                <input
                  type="email"
                  className="input-base"
                  placeholder="you@yourcompany.dev"
                  {...signupForm.register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                  })}
                />
                {signupForm.formState.errors.email && (
                  <p className="mt-1 text-xs" style={{ color: 'var(--red)' }}>
                    {signupForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>
                  Password
                </label>
                <p className="text-xs mb-1.5" style={{ color: 'var(--muted-foreground)' }}>
                  Minimum 8 characters, at least one uppercase and one number
                </p>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input-base pr-10"
                    placeholder="Create a strong password"
                    {...signupForm.register('password', {
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Minimum 8 characters' },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--muted-foreground)' }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {signupForm.formState.errors.password && (
                  <p className="mt-1 text-xs" style={{ color: 'var(--red)' }}>
                    {signupForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    className="input-base pr-10"
                    placeholder="Re-enter your password"
                    {...signupForm.register('confirm', {
                      required: 'Please confirm your password',
                      validate: (val) =>
                        val === signupForm.watch('password') || 'Passwords do not match',
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--muted-foreground)' }}
                    aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {signupForm.formState.errors.confirm && (
                  <p className="mt-1 text-xs" style={{ color: 'var(--red)' }}>
                    {signupForm.formState.errors.confirm.message}
                  </p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 rounded mt-0.5"
                  style={{ accentColor: 'var(--primary)' }}
                  {...signupForm.register('terms', { required: 'You must accept the terms' })}
                />
                <label htmlFor="terms" className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  I agree to the{' '}
                  <span className="underline cursor-pointer" style={{ color: 'var(--accent)' }}>Terms of Service</span>
                  {' '}and{' '}
                  <span className="underline cursor-pointer" style={{ color: 'var(--accent)' }}>Privacy Policy</span>
                </label>
              </div>
              {signupForm.formState.errors.terms && (
                <p className="text-xs" style={{ color: 'var(--red)' }}>
                  {signupForm.formState.errors.terms.message}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-2.5 justify-center"
                style={isLoading ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
              >
                {isLoading ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <>Create Account <ArrowRight size={15} /></>
                )}
              </button>
            </form>
          )}

          <p className="text-center text-sm mt-6" style={{ color: 'var(--muted-foreground)' }}>
            {tab === 'login' ? (
              <>
                New to CodePilot?{' '}
                <button onClick={() => setTab('signup')} className="font-medium" style={{ color: 'var(--accent)' }}>
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button onClick={() => setTab('login')} className="font-medium" style={{ color: 'var(--accent)' }}>
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}