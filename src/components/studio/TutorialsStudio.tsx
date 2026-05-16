import { tutorialSteps } from '@/lib/studio-data';
import { MetricCard, Panel, Pill, SectionHeader } from './StudioPrimitives';

export default function TutorialsStudio() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="New user tutorial"
        title="A guided first-run path so new users know exactly how to build with the app."
        description="This tutorial page explains how to start, how the free and premium engines differ, why the chat stays organized with dropdown code boxes, and where personalization fits in."
        actions={<Pill tone="success">Beginner ready</Pill>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard value="1" label="Pick a starting mode" detail="Users can open a fresh idea prompt or bring in an image, file, link, or repo context right away." />
        <MetricCard value="2" label="Stay free or upgrade" detail="Puter is the default path, while premium providers get their own dedicated section for upgrades." />
        <MetricCard value="3" label="Review clear outputs" detail="Builder responses keep code, changes, and explanations organized so the session stays readable." />
      </div>

      <div className="space-y-4">
        {tutorialSteps.map((step) => (
          <Panel key={step.title} className="space-y-4 p-6">
            <div>
              <h3 className="text-2xl font-medium text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-300">{step.summary}</p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {step.checkpoints.map((checkpoint) => (
                <div key={checkpoint} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                  {checkpoint}
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
