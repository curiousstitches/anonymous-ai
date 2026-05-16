import Link from 'next/link';
import { Panel, Pill, SectionHeader } from '@/components/studio/StudioPrimitives';

const adminEvents = [
  { title: 'Landing page remake', status: 'Complete', detail: 'The public first-touch experience now positions CodePilot as a coding AI studio with clearer product direction.' },
  { title: 'Workspace shell rebuild', status: 'Complete', detail: 'Navigation, provider surfacing, tutorial access, pricing visibility, and theme controls now sit inside a unified app shell.' },
  { title: 'Theme system expansion', status: 'Complete', detail: 'The dashboard now surfaces 60 presets across the requested categories with narration, motion, density, and depth controls.' },
  { title: 'Advanced collaboration and billing', status: 'Next phase', detail: 'Real multi-user live collaboration, provider billing, and production-grade GitHub auth flows require a dedicated backend phase.' },
];

export default function AdminEventLog() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Admin operations"
        title="A cleaner operations log for tracking what changed and what still belongs in a second implementation phase."
        description="This gives you a fast owner view of the current remake status while keeping an easy path back to your standard builder profile."
        actions={
          <>
            <Pill tone="warning">Phased delivery</Pill>
            <Link href="/profile-account" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:border-white/20 hover:bg-white/10">Return to profile</Link>
          </>
        }
      />

      <div className="space-y-4">
        {adminEvents.map((event) => (
          <Panel key={event.title} className="space-y-3 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xl font-medium text-white">{event.title}</h3>
              <span className={`rounded-full border px-3 py-1 text-xs font-medium ${event.status === 'Complete' ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300' : 'border-amber-400/20 bg-amber-500/10 text-amber-200'}`}>
                {event.status}
              </span>
            </div>
            <p className="text-sm leading-7 text-slate-300">{event.detail}</p>
          </Panel>
        ))}
      </div>
    </div>
  );
}
