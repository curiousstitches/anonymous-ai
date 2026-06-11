import { Hammer, FolderOpen, Download, Shield } from 'lucide-react';

const features = [
  {
    icon: Hammer,
    title: 'Builder Mode',
    description: 'Describe your app and CodePilot generates every file — complete, runnable, and production-ready. No snippets, no placeholders.',
  },
  {
    icon: FolderOpen,
    title: 'Full Project Scaffolds',
    description: 'Get a complete file tree with package.json, configs, and all source files. One prompt, entire project.',
  },
  {
    icon: Download,
    title: 'Save Any File Instantly',
    description: 'Every code block has a Save button. Download individual files directly from the chat with one click.',
  },
  {
    icon: Shield,
    title: 'Free via Puter AI',
    description: 'Powered by Puter.js — access GPT-4o and Claude 3.5 Sonnet for free, no API key required, no credit card.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Build Anything, Instantly
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            CodePilot doesn’t just tell you how to code — it builds the code for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition group"
              >
                <div className="mb-4 inline-block p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 group-hover:shadow-lg group-hover:shadow-blue-500/30 transition">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
