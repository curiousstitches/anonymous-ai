import Link from 'next/link';
import { adminHighlights, freeProviders, premiumProviders } from '@/lib/studio-data';
import { Panel, Pill, SectionHeader } from '@/components/studio/StudioPrimitives';

export default function AdminApiUsage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Admin control room"
        title="Owner overview for provider posture, premium lanes, and user-facing product direction."
        description="This admin home is designed for you to jump between operational oversight and the normal profile quickly while keeping the free-first strategy and premium upsell clear."
        actions={
          <>
            <Pill tone="premium">Owner-only view</Pill>
            <Link href="/profile-account" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:border-white/20 hover:bg-white/10">Back to profile</Link>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Panel className="p-6">
          <div className="text-4xl font-semibold text-white">{freeProviders.length}</div>
          <p className="mt-3 text-lg font-medium text-white">Free provider surfaces</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">Includes the live Puter lane plus free-ready provider positioning and repo-centric workflows.</p>
        </Panel>
        <Panel className="p-6">
          <div className="text-4xl font-semibold text-white">{premiumProviders.length}</div>
          <p className="mt-3 text-lg font-medium text-white">Premium API lanes</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">Premium providers are marketed separately so users upgrade intentionally rather than being forced onto paid paths.</p>
        </Panel>
        <Panel className="p-6">
          <div className="text-4xl font-semibold text-white">Owner</div>
          <p className="mt-3 text-lg font-medium text-white">Admin login posture</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">The existing owner login route remains available and the admin navigation stays visible once authenticated.</p>
        </Panel>
      </div>

      <Panel className="space-y-4 p-6">
        <p className="text-lg font-medium text-white">Operational highlights</p>
        <div className="grid gap-3 md:grid-cols-3">
          {adminHighlights.map((item) => (
            <div key={item} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
              {item}
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel className="space-y-4 p-6">
          <p className="text-lg font-medium text-white">Free lane oversight</p>
          {freeProviders.map((provider) => (
            <div key={provider.name} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-base font-medium text-white">{provider.name}</p>
                <span className="rounded-full border px-3 py-1 text-xs font-medium" style={{ borderColor: `${provider.accent}40`, color: provider.accent, background: `${provider.accent}15` }}>
                  {provider.access}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-400">{provider.summary}</p>
            </div>
          ))}
        </Panel>

        <Panel className="space-y-4 p-6">
          <p className="text-lg font-medium text-white">Premium lane oversight</p>
          {premiumProviders.map((provider) => (
            <div key={provider.name} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-base font-medium text-white">{provider.name}</p>
                <span className="rounded-full border px-3 py-1 text-xs font-medium" style={{ borderColor: `${provider.accent}40`, color: provider.accent, background: `${provider.accent}15` }}>
                  Premium
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-400">{provider.summary}</p>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}
