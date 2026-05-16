'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bot,
  BookOpen,
  GitBranch,

  Layers3,
  LogOut,
  Palette,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wand2,
  WalletCards,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { href: '/workspace', label: 'Workspace', icon: Wand2 },
  { href: '/templates', label: 'Templates', icon: Layers3 },
  { href: '/providers', label: 'Providers', icon: Bot },
  { href: '/tutorials', label: 'Tutorials', icon: BookOpen },
  { href: '/pricing', label: 'Paid APIs', icon: WalletCards },
  { href: '/theme-dashboard', label: 'Themes', icon: Palette },
  { href: '/profile-account', label: 'Profile', icon: UserRound },
];

const adminNavigation = [
  { href: '/admin/api-usage', label: 'Admin home', icon: ShieldCheck },
  { href: '/admin/event-log', label: 'Operations', icon: Sparkles },
];

export default function Sidebar({ mobileOpen, onMobileClose }: { mobileOpen: boolean; onMobileClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, isAdmin } = useAuth();

  const handleLogout = async () => {
    if (!user) {
      onMobileClose();
      router.replace('/sign-up-login-screen');
      return;
    }

    await signOut();
    onMobileClose();
    router.replace('/sign-up-login-screen');
    router.refresh();
  };

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
      active
        ? 'border border-cyan-300/20 bg-cyan-400/10 text-white shadow-[0_0_30px_rgba(34,211,238,0.08)]'
        : 'border border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-[296px] border-r border-white/10 bg-slate-950/90 px-4 py-4 backdrop-blur-2xl transition-transform lg:static lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex h-full flex-col gap-4">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-400/20 to-fuchsia-400/20 text-white">
              <GitBranch className="h-5 w-5" />

            </div>
            <div>
              <p className="text-lg font-semibold text-white">CodePilot</p>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Coding AI program</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            Free-first coding studio for web and mobile app generation, repo-driven rebuilds, guided onboarding, and premium provider upgrades.
          </p>
        </div>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={linkClass(active)} onClick={onMobileClose}>
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="rounded-[1.75rem] border border-emerald-400/20 bg-emerald-500/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300/90">Free lane</p>
          <p className="mt-3 text-lg font-medium text-white">Puter is the default starter path.</p>
          <p className="mt-2 text-sm leading-6 text-emerald-100/80">
            Open the workspace to start with the built-in free coding engine, then browse premium providers only when needed.
          </p>
        </div>

        {user && isAdmin() ? (
          <div className="rounded-[1.75rem] border border-fuchsia-400/20 bg-fuchsia-500/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-fuchsia-200">Owner tools</p>
            <div className="mt-4 space-y-1">
              {adminNavigation.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} className={linkClass(active)} onClick={onMobileClose}>
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="mt-auto rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
          <div className="mb-4">
            <p className="text-sm font-medium text-white">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Guest builder'}</p>
            <p className="text-sm text-slate-400">{user?.email || 'Sign in to save conversations and admin tools.'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            {user ? 'Sign out' : 'Sign in'}
          </button>

        </div>
      </div>
    </aside>
  );
}
