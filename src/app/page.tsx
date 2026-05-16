import Link from 'next/link';
import { ArrowRight, Bot, GitBranch, Layers3, Palette, ShieldCheck, Sparkles, Wand2 } from 'lucide-react';

import AnimatedBackground from '@/components/AnimatedBackground';
import { landingHighlights, landingStats, pricingHighlights, templateCards } from '@/lib/studio-data';

export const dynamic = 'force-dynamic';

const quickStarts = [
  'Start from an idea',
  'Build from a screenshot',
  'Use a file upload',
  'Generate from a link',
  'Plan around a GitHub repo',
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <AnimatedBackground />
      <div className="relative z-10">
        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 shadow-[0_0_32px_rgba(34,211,238,0.18)]">
              <Bot className="h-5 w-5 text-cyan-300" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white">CodePilot</p>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">AI build studio</p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a href="#features">Features</a>
            <a href="#templates">Templates</a>
            <a href="#pricing">Paid APIs</a>
            <a href="#themes">Themes</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/sign-up-login-screen" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-300/40 hover:text-white">
              Sign in
            </Link>
            <Link href="/workspace" className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-200">
              Launch studio
            </Link>
          </div>
        </header>

        <section className="mx-auto grid w-full max-w-7xl gap-10 px-6 pb-12 pt-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:pb-20 lg:pt-16">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
              <Sparkles className="h-4 w-4" />
              Free-first AI coding studio with premium provider lanes
            </div>

            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white md:text-6xl lg:text-7xl">
                Build web and mobile apps with an AI studio designed for code, live changes, and GitHub-first workflows.
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-slate-300">
                This remake turns the project into a polished coding AI product: informative landing experience, free-first provider strategy, template-rich project starts, animated theme-driven visuals, tutorials for new users, and a clearer split between builder, profile, and admin operations.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/workspace" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-300 to-fuchsia-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]">
                Open workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/tutorials" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm text-slate-200 transition hover:border-white/25 hover:text-white">
                View new user tutorial
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {landingStats.map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">

                  <div className="text-3xl font-semibold text-white">{stat.value}</div>
                  <p className="mt-2 text-sm font-medium text-slate-200">{stat.label}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{stat.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5 rounded-[2rem] border border-white/10 bg-slate-950/65 p-6 shadow-[0_0_70px_rgba(124,58,237,0.18)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-200">Launch modes</p>
                <p className="text-sm text-slate-400">Idea, image, file, link, or repo.</p>
              </div>
              <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">Puter active</div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {quickStarts.map((item, index) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Mode {String(index + 1).padStart(2, '0')}</p>
                  <p className="mt-3 text-sm font-medium text-white">{item}</p>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-fuchsia-400/20 bg-gradient-to-br from-fuchsia-500/10 via-cyan-500/10 to-transparent p-5">
              <div className="flex items-center gap-3">
                <GitBranch className="h-5 w-5 text-white" />

                <div>
                  <p className="text-sm font-medium text-white">GitHub as a core tool</p>
                  <p className="text-sm text-slate-300">Repository refreshes, issue-based build prompts, commit summaries, and repo-oriented templates stay visible from day one.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
          <div className="mb-8 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/80">Why this remake</p>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">A clearer product built around coding outcomes, not just chatting.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {landingHighlights.map((item, index) => (
              <div key={item.title} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white">
                  {index === 0 ? <Wand2 className="h-5 w-5" /> : index === 1 ? <GitBranch className="h-5 w-5" /> : index === 2 ? <Layers3 className="h-5 w-5" /> : <Palette className="h-5 w-5" />}

                </div>
                <h3 className="text-xl font-medium text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.summary}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="templates" className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/80">Templates and entry points</p>
              <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Users can start from a template or from almost any source material.</h2>
            </div>
            <Link href="/templates" className="text-sm text-cyan-300 transition hover:text-cyan-200">Browse template library →</Link>
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {templateCards.slice(0, 4).map((template) => (
              <div key={template.name} className="rounded-[2rem] border border-white/10 bg-slate-950/55 p-5 backdrop-blur-xl">
                <div className="mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-medium" style={{ borderColor: `${template.accent}40`, color: template.accent, background: `${template.accent}15` }}>
                  {template.inputMode}
                </div>
                <h3 className="text-lg font-medium text-white">{template.name}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{template.summary}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-400">
                  {template.outputs.map((output) => (
                    <li key={output}>• {output}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
          <div className="mb-8 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/80">Paid API section</p>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">A dedicated premium lane advertises top paid providers without abandoning the free-first builder path.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {pricingHighlights.map((item) => (
              <div key={item.tier} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

                <p className="text-sm font-medium text-slate-300">{item.tier}</p>
                <div className="mt-3 text-4xl font-semibold text-white">{item.price}</div>
                <p className="mt-4 text-sm leading-7 text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="themes" className="mx-auto w-full max-w-7xl px-6 pb-20 pt-12 lg:px-10">
          <div className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-cyan-500/10 via-fuchsia-500/10 to-transparent p-8 backdrop-blur-xl lg:p-10">
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/80">Theme system</p>
                <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Animated backgrounds, neon accents, 3D-style panels, and a 60-theme catalog are already wired into the remake foundation.</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                  The theme system includes 10 simple themes, 10 Zelda-inspired themes, 10 vibrant themes, 10 3D pop themes, 10 neon themes, and 10 premium adult themes at $10. Users can also tune density, motion, depth, and AI narration.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/theme-dashboard" className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-cyan-200">Open theme studio</Link>
                  <Link href="/pricing" className="rounded-full border border-white/15 px-5 py-3 text-sm text-slate-100 transition hover:border-white/25">See premium section</Link>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Palette, title: 'Personalizable elements', text: 'Panels, density, motion, depth, and narration can all be tuned.' },
                  { icon: Sparkles, title: 'Animated backgrounds', text: 'Sparkle, pulse, gradient, fluid, grid, and fire effects are all supported.' },
                  { icon: ShieldCheck, title: 'Admin + profile split', text: 'Owner controls and user-level personalization stay easy to navigate.' },
                  { icon: GitBranch, title: 'GitHub-centered starts', text: 'Repo-oriented templates help users move from repositories to guided builds.' },

                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded-[1.75rem] border border-white/10 bg-slate-950/55 p-5">
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <p className="text-lg font-medium text-white">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
