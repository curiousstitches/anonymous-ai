'use client';

import Link from 'next/link';
import { Bell, Palette, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Panel, Pill, SectionHeader } from '@/components/studio/StudioPrimitives';

export default function ProfileAccount() {
  const { user, isAdmin } = useAuth();
  const { activeTheme, personalization } = useTheme();

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Profile"
        title="Account, personalization, and operational shortcuts in one place."
        description="The profile page now focuses on the builder identity, theme choices, notification posture, and quick links into the owner admin area when available."
        actions={
          <>
            <Pill>{activeTheme.name}</Pill>
            {user && isAdmin() ? <Link href="/admin/api-usage" className="rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-4 py-2 text-sm text-fuchsia-100 transition hover:border-fuchsia-300/30">Open admin</Link> : null}
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="p-6 lg:col-span-1">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/10 text-white">
              <UserRound className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xl font-medium text-white">{user?.user_metadata?.full_name || 'Builder profile'}</p>
              <p className="text-sm text-slate-400">{user?.email || 'Guest session'}</p>
            </div>
          </div>
          <div className="mt-5 space-y-3 text-sm text-slate-300">
            <p>Primary role: {isAdmin() ? 'Owner admin + builder' : 'Builder'}</p>
            <p>Current theme: {activeTheme.name}</p>
            <p>Narration: {personalization.narrationEnabled ? 'Enabled' : 'Disabled'}</p>
          </div>
        </Panel>

        <Panel className="p-6 lg:col-span-2">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <Palette className="h-5 w-5 text-cyan-300" />
              <p className="mt-4 text-lg font-medium text-white">Theme personalization</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">Density: {personalization.density} · Motion: {personalization.motion} · Depth: {personalization.depth}</p>
              <Link href="/theme-dashboard" className="mt-4 inline-flex text-sm text-cyan-300 transition hover:text-cyan-200">Open theme studio →</Link>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <Bell className="h-5 w-5 text-amber-200" />
              <p className="mt-4 text-lg font-medium text-white">Notifications</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">Product updates, release drops, tutorial nudges, and premium provider announcements can live here.</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <Sparkles className="h-5 w-5 text-fuchsia-200" />
              <p className="mt-4 text-lg font-medium text-white">Session style</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">Use the remade workspace for live coding sessions with dropdown code responses and detailed wrap-up explanations.</p>
            </div>
          </div>
        </Panel>
      </div>

      {user && isAdmin() ? (
        <Panel className="p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-fuchsia-200" />
            <div>
              <p className="text-lg font-medium text-white">Owner shortcuts</p>
              <p className="text-sm text-slate-400">Quick navigation between your normal profile and admin operations.</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/admin/api-usage" className="rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-4 py-2 text-sm text-fuchsia-100 transition hover:border-fuchsia-300/30">Go to admin home</Link>
            <Link href="/admin/event-log" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/10">Open operations log</Link>
          </div>
        </Panel>
      ) : null}
    </div>
  );
}
