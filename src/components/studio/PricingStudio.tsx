import { premiumProviders, pricingHighlights } from '@/lib/studio-data';
import { Panel, Pill, SectionHeader } from './StudioPrimitives';

export default function PricingStudio() {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Premium API section"
        title="Advertise the best paid engines without forcing everybody onto a paid workflow."
        description="This section positions paid APIs as optional upgrades: users stay on the free builder lane until they want a specific premium model, then they choose the provider that fits their task."
        actions={<Pill tone="premium">Premium catalog</Pill>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        {pricingHighlights.map((item) => (
          <Panel key={item.tier} className="space-y-4 p-6">
            <p className="text-sm font-medium text-slate-300">{item.tier}</p>
            <div className="text-4xl font-semibold text-white">{item.price}</div>
            <p className="text-sm leading-7 text-slate-400">{item.description}</p>
          </Panel>
        ))}
      </div>

      <Panel className="space-y-5 p-6">
        <div>
          <p className="text-lg font-medium text-white">Top premium APIs to advertise</p>
          <p className="mt-2 text-sm text-slate-400">These cards are built to market the premium lane clearly inside the app.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {premiumProviders.map((provider) => (
            <div key={provider.name} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-medium text-white">{provider.name}</h3>
                <span className="rounded-full border px-3 py-1 text-xs font-medium" style={{ borderColor: `${provider.accent}40`, color: provider.accent, background: `${provider.accent}15` }}>
                  Premium
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{provider.summary}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-400">
                {provider.strengths.map((strength) => (
                  <li key={strength}>• {strength}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
