import { Bot, Crown, GitBranch, ShieldCheck } from 'lucide-react';

import { freeProviders, premiumProviders } from '@/lib/studio-data';
import { Panel, Pill, SectionHeader } from './StudioPrimitives';

export default function ProvidersStudio() {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Provider catalog"
        title="Free-first engine selection with a dedicated premium upgrade lane."
        description="The rebuilt provider surface makes it obvious which options are free, which are already active in the app, and which premium engines users can pay to unlock for higher-end work."
        actions={
          <>
            <Pill tone="success">Built-in free path</Pill>
            <Pill tone="premium">Premium API upsell</Pill>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Panel className="space-y-5 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/10">
              <Bot className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <p className="text-lg font-medium text-white">Free provider lane</p>
              <p className="text-sm text-slate-400">Designed for instant usage and clear expansion.</p>
            </div>
          </div>
          <div className="space-y-4">
            {freeProviders.map((provider) => (
              <div key={provider.name} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-medium text-white">{provider.name}</h3>
                  <span className="rounded-full border px-3 py-1 text-xs font-medium" style={{ borderColor: `${provider.accent}40`, color: provider.accent, background: `${provider.accent}15` }}>
                    {provider.access}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{provider.summary}</p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Strengths</p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-400">
                      {provider.strengths.map((strength) => (
                        <li key={strength}>• {strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Modes</p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-400">
                      {provider.models.map((model) => (
                        <li key={model}>• {model}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="space-y-5 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/10">
              <Crown className="h-5 w-5 text-fuchsia-200" />
            </div>
            <div>
              <p className="text-lg font-medium text-white">Premium provider lane</p>
              <p className="text-sm text-slate-400">Advertise the best paid APIs and let users pick their own premium path.</p>
            </div>
          </div>
          <div className="space-y-4">
            {premiumProviders.map((provider) => (
              <div key={provider.name} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-medium text-white">{provider.name}</h3>
                  <span className="rounded-full border px-3 py-1 text-xs font-medium" style={{ borderColor: `${provider.accent}40`, color: provider.accent, background: `${provider.accent}15` }}>
                    {provider.access}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{provider.summary}</p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Best for</p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-400">
                      {provider.strengths.map((strength) => (
                        <li key={strength}>• {strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Model lanes</p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-400">
                      {provider.models.map((model) => (
                        <li key={model}>• {model}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Panel className="p-5">
          <div className="mb-3 flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 text-cyan-300" />
            <p className="text-sm font-medium text-white">Clear free vs paid separation</p>
          </div>
          <p className="text-sm leading-6 text-slate-400">Users can stay on the built-in free lane or intentionally switch into premium billing decisions.</p>
        </Panel>
        <Panel className="p-5">
          <div className="mb-3 flex items-center gap-3">
            <GitBranch className="h-4 w-4 text-fuchsia-200" />

            <p className="text-sm font-medium text-white">Repo-aware prompts</p>
          </div>
          <p className="text-sm leading-6 text-slate-400">The provider story still keeps GitHub-driven planning visible for repo refresh and change management.</p>
        </Panel>
        <Panel className="p-5">
          <div className="mb-3 flex items-center gap-3">
            <Bot className="h-4 w-4 text-emerald-300" />
            <p className="text-sm font-medium text-white">No-key default</p>
          </div>
          <p className="text-sm leading-6 text-slate-400">Puter stays the zero-friction default so the app works immediately before any premium upgrade path is chosen.</p>
        </Panel>
      </div>
    </div>
  );
}
