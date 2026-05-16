'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';
import Sidebar from './Sidebar';
import { useAuth } from '@/contexts/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

const PAGE_TITLES: Record<string, string> = {
  '/workspace': 'AI Builder Workspace',
  '/github': 'GitHub Workflow Center',
  '/team-workspace': 'Team Workspace',
  '/billing-center': 'Billing Center',
  '/templates': 'Template Library',
  '/providers': 'Free & Paid Providers',
  '/tutorials': 'New User Tutorial',
  '/pricing': 'Premium API Catalog',
  '/theme-dashboard': 'Theme Studio',
  '/profile-account': 'Profile & Preferences',
  '/project-context-manager': 'Template Library',
  '/settings-api-configuration': 'Free & Paid Providers',
  '/usage-dashboard': 'New User Tutorial',
  '/admin/api-usage': 'Admin Control Room',
  '/admin/event-log': 'Admin Operations Log',
};

function getPageTitle(pathname: string) {
  return PAGE_TITLES[pathname] ?? 'CodePilot';
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[var(--background)]">
      <AnimatedBackground />

      {mobileSidebarOpen ? <button aria-label="Close navigation overlay" className="fixed inset-0 z-30 bg-slate-950/70 lg:hidden" onClick={() => setMobileSidebarOpen(false)} /> : null}

      <Sidebar mobileOpen={mobileSidebarOpen} onMobileClose={() => setMobileSidebarOpen(false)} />

      <div className="relative z-10 flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
          <div className="flex items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={18} />
            </button>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/80">CodePilot Studio</p>
              <h1 className="truncate text-lg font-semibold text-white sm:text-2xl">{getPageTitle(pathname)}</h1>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">Puter free lane active</div>
              {user ? (
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                  {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Builder'}
                </div>
              ) : null}
              {user && isAdmin() ? <div className="rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-3 py-1 text-xs font-medium text-fuchsia-200">Owner admin</div> : null}
            </div>
          </div>
        </header>

        <main className="relative z-10 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
