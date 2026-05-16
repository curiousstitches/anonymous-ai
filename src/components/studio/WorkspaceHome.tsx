'use client';

import Link from 'next/link';
import { AudioLines, Bot, CreditCard, GitBranch, Mic2, Sparkles, Users, Wand2 } from 'lucide-react';

import ChatInterface from '@/app/components/ChatInterface';

import { useTheme } from '@/contexts/ThemeContext';
import { githubWorkflows, workspacePrompts } from '@/lib/studio-data';
import { MetricCard, Panel, Pill, SectionHeader } from './StudioPrimitives';

export default function WorkspaceHome() {
  const { personalization, updatePersonalization } = useTheme();

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Builder workspace"
        title="Generate, refine, and explain code in one guided studio."
        description="The main workspace keeps the free Puter workflow front and center, exposes repo-aware build planning, and lets users personalize how intense the interface feels while they build."
        actions={
          <>
            <Pill tone="success">Puter free lane active</Pill>
            <Pill>Builder + chat mode</Pill>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <MetricCard value="Live" label="Primary coding engine" detail="Puter remains the default free lane for instant sessions, detailed edits, and scaffold generation." />
        <MetricCard value="5" label="Project entry modes" detail="Idea, image, file, link, and GitHub-oriented repo flows are now emphasized in the UI." />
        <MetricCard value="60" label="Themes + narration settings" detail="Users can tune motion, density, depth, and AI voice readout without leaving the app shell." />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel className="space-y-5 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
              <Wand2 className="h-5 w-5 text-cyan-300" />
            </div>
            <div>
              <p className="text-lg font-medium text-white">Recommended build starters</p>
              <p className="text-sm text-slate-400">Prompt chips that fit the rebuilt product direction.</p>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {workspacePrompts.map((prompt) => (
              <div key={prompt} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
                {prompt}
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="space-y-5 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/10">
              <GitBranch className="h-5 w-5 text-fuchsia-200" />

            </div>
            <div>
              <p className="text-lg font-medium text-white">GitHub-first workflow</p>
              <p className="text-sm text-slate-400">Keep repository work visible, not buried.</p>
            </div>
          </div>
          <ul className="space-y-3 text-sm leading-6 text-slate-300">
            {githubWorkflows.map((item) => (
              <li key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            href: '/github',
            title: 'GitHub workflow center',
            text: 'Manage repositories, issue cards, branches, and release batches.',
            icon: GitBranch,
            tone: 'text-cyan-300',
          },
          {
            href: '/team-workspace',
            title: 'Team workspace',
            text: 'Invite collaborators, send team chat updates, and track shared changes.',
            icon: Users,
            tone: 'text-fuchsia-200',
          },
          {
            href: '/billing-center',
            title: 'Billing center',
            text: 'Activate premium lanes, unlock adult themes, and review billing events.',
            icon: CreditCard,
            tone: 'text-amber-200',
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Panel className="h-full p-5 transition hover:border-white/20 hover:bg-white/10">
                <div className="mb-4 flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${item.tone}`} />
                  <p className="text-sm font-medium text-white">{item.title}</p>
                </div>
                <p className="text-sm leading-6 text-slate-400">{item.text}</p>
              </Panel>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <Panel className="p-5">
          <div className="mb-3 flex items-center gap-3">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            <p className="text-sm font-medium text-white">Motion intensity</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(['low', 'medium', 'high'] as const).map((value) => (
              <button
                key={value}
                onClick={() => updatePersonalization({ motion: value })}
                className={`rounded-full border px-3 py-2 text-xs transition ${
                  personalization.motion === value ? 'border-cyan-300/40 bg-cyan-400/10 text-cyan-200' : 'border-white/10 bg-white/5 text-slate-300'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </Panel>

        <Panel className="p-5">
          <div className="mb-3 flex items-center gap-3">
            <Bot className="h-4 w-4 text-emerald-300" />
            <p className="text-sm font-medium text-white">Layout density</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['compact', 'balanced', 'spacious'] as const).map((value) => (
              <button
                key={value}
                onClick={() => updatePersonalization({ density: value })}
                className={`rounded-full border px-3 py-2 text-xs transition ${
                  personalization.density === value ? 'border-emerald-300/40 bg-emerald-400/10 text-emerald-200' : 'border-white/10 bg-white/5 text-slate-300'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </Panel>

        <Panel className="p-5">
          <div className="mb-3 flex items-center gap-3">
            <Mic2 className="h-4 w-4 text-fuchsia-200" />
            <p className="text-sm font-medium text-white">AI read aloud</p>
          </div>
          <button
            onClick={() => updatePersonalization({ narrationEnabled: !personalization.narrationEnabled })}
            className={`inline-flex rounded-full border px-4 py-2 text-sm transition ${
              personalization.narrationEnabled ? 'border-fuchsia-300/40 bg-fuchsia-500/10 text-fuchsia-200' : 'border-white/10 bg-white/5 text-slate-300'
            }`}
          >
            {personalization.narrationEnabled ? 'Narration enabled' : 'Enable narration'}
          </button>
          <p className="mt-3 text-sm leading-6 text-slate-400">Assistant responses can now be read aloud from chat actions, and narration preference lives in theme personalization.</p>
        </Panel>

        <Panel className="p-5">
          <div className="mb-3 flex items-center gap-3">
            <AudioLines className="h-4 w-4 text-amber-200" />
            <p className="text-sm font-medium text-white">Detailed finishes</p>
          </div>
          <p className="text-sm leading-6 text-slate-400">
            Builder prompts are tuned so the assistant ends each operation with a clearer explanation after showing the code and changes in dropdown sections.
          </p>
        </Panel>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/60 shadow-[0_0_60px_rgba(124,58,237,0.14)]">
        <div className="border-b border-white/10 px-6 py-4">
          <p className="text-sm font-medium text-white">Live builder surface</p>
          <p className="text-sm text-slate-400">Chat responses already organize explanations, changes, and code into collapsible sections so long sessions stay readable.</p>
        </div>
        <div className="h-[900px]">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
