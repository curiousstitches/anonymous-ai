import { FileCode2, GitBranch, ImageIcon, Lightbulb, Link2 } from 'lucide-react';

import { templateCards } from '@/lib/studio-data';
import { Panel, Pill, SectionHeader } from './StudioPrimitives';

const modeIcons = {
  idea: Lightbulb,
  image: ImageIcon,
  file: FileCode2,
  link: Link2,
  repo: GitBranch,

};

export default function TemplatesStudio() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Template library"
        title="Start from a template, or start from whatever material the user already has."
        description="This section pushes project starts beyond a blank prompt so users can launch from ideas, screenshots, files, links, or repo-centered workflows."
        actions={<Pill>Idea · image · file · link · repo</Pill>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {templateCards.map((template) => {
          const Icon = modeIcons[template.inputMode];
          return (
            <Panel key={template.name} className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border" style={{ borderColor: `${template.accent}40`, background: `${template.accent}15` }}>
                  <Icon className="h-5 w-5" style={{ color: template.accent }} />
                </div>
                <span className="rounded-full border px-3 py-1 text-xs font-medium" style={{ borderColor: `${template.accent}40`, color: template.accent, background: `${template.accent}15` }}>
                  {template.category}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">{template.name}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{template.summary}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Outputs</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-400">
                  {template.outputs.map((output) => (
                    <li key={output}>• {output}</li>
                  ))}
                </ul>
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
