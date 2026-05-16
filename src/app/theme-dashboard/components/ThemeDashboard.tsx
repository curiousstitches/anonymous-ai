'use client';

import { RefreshCcw, Volume2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Panel, Pill, SectionHeader } from '@/components/studio/StudioPrimitives';

const categoryLabels = {
  simple: 'Simple themes',
  'zelda-inspired': 'Zelda-inspired',
  vibrant: 'Vibrant',
  '3d-pop': '3D pop',
  neon: 'Neon',
  'adult-premium': 'Adult premium',
};

export default function ThemeDashboard() {
  const { activeTheme, themeGroups, personalization, setActiveTheme, updatePersonalization, resetTheme } = useTheme();

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Theme studio"
        title="60 visual presets with animated effects, premium adult themes, and personalization controls."
        description="The remake keeps the requested theme categories together: 10 simple themes, 10 Zelda-inspired themes, 10 vibrant themes, 10 3D pop themes, 10 neon themes, and 10 premium adult themes at $10."
        actions={
          <>
            <Pill>Current: {activeTheme.name}</Pill>
            <button onClick={resetTheme} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/10">
              <RefreshCcw className="h-4 w-4" />
              Reset theme
            </button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-4">
        <Panel className="p-5">
          <p className="text-sm font-medium text-white">Density</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(['compact', 'balanced', 'spacious'] as const).map((value) => (
              <button
                key={value}
                onClick={() => updatePersonalization({ density: value })}
                className={`rounded-full border px-3 py-2 text-xs transition ${
                  personalization.density === value ? 'border-cyan-300/40 bg-cyan-400/10 text-cyan-200' : 'border-white/10 bg-white/5 text-slate-300'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </Panel>
        <Panel className="p-5">
          <p className="text-sm font-medium text-white">Motion</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(['low', 'medium', 'high'] as const).map((value) => (
              <button
                key={value}
                onClick={() => updatePersonalization({ motion: value })}
                className={`rounded-full border px-3 py-2 text-xs transition ${
                  personalization.motion === value ? 'border-fuchsia-300/40 bg-fuchsia-500/10 text-fuchsia-200' : 'border-white/10 bg-white/5 text-slate-300'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </Panel>
        <Panel className="p-5">
          <p className="text-sm font-medium text-white">Depth</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(['soft', 'medium', 'dramatic'] as const).map((value) => (
              <button
                key={value}
                onClick={() => updatePersonalization({ depth: value })}
                className={`rounded-full border px-3 py-2 text-xs transition ${
                  personalization.depth === value ? 'border-emerald-300/40 bg-emerald-500/10 text-emerald-200' : 'border-white/10 bg-white/5 text-slate-300'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </Panel>
        <Panel className="p-5">
          <div className="flex items-center gap-2 text-white">
            <Volume2 className="h-4 w-4 text-amber-200" />
            <p className="text-sm font-medium">Narration</p>
          </div>
          <button
            onClick={() => updatePersonalization({ narrationEnabled: !personalization.narrationEnabled })}
            className={`mt-4 rounded-full border px-4 py-2 text-sm transition ${
              personalization.narrationEnabled ? 'border-amber-300/40 bg-amber-500/10 text-amber-100' : 'border-white/10 bg-white/5 text-slate-300'
            }`}
          >
            {personalization.narrationEnabled ? 'Read AI changes aloud' : 'Enable read aloud'}
          </button>
          <p className="mt-3 text-sm leading-6 text-slate-400">This preference works with the new speak action on assistant responses.</p>
        </Panel>
      </div>

      <div className="space-y-6">
        {Object.entries(themeGroups).map(([category, themes]) => (
          <div key={category} className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">{categoryLabels[category as keyof typeof categoryLabels]}</h2>
                <p className="text-sm text-slate-400">{themes.length} presets in this category.</p>
              </div>
              {category === 'adult-premium' ? <Pill tone="premium">$10 premium pack</Pill> : null}
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {themes.map((theme) => {
                const active = theme.id === activeTheme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setActiveTheme(theme.id)}
                    className={`text-left transition ${active ? 'scale-[1.01]' : ''}`}
                  >
                    <Panel className={`h-full p-4 ${active ? 'ring-2 ring-cyan-300/40' : ''}`}>
                      <div className="mb-4 flex gap-2">
                        {[theme.background, theme.surface, theme.primary, theme.accent].map((color) => (
                          <span key={color} className="h-9 flex-1 rounded-xl border border-white/10" style={{ background: color }} />
                        ))}
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-base font-medium text-white">{theme.name}</p>
                          <p className="mt-1 text-sm text-slate-400">{theme.description}</p>
                        </div>
                        {theme.premium ? <span className="rounded-full border border-pink-400/20 bg-pink-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-pink-200">Premium</span> : null}
                      </div>
                    </Panel>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
