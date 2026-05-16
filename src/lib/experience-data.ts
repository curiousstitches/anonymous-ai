import { Bot, Boxes, FileCode2, GitBranch, ImageIcon, Layers3, Link2, Mic2, Sparkles, Wand2 } from 'lucide-react';

export const freeEngineCards = [
  {
    name: 'Puter AI',
    badge: 'Primary fallback',
    description: 'Best free-first default for no-key coding sessions and rapid file generation.',
    status: 'Recommended default',
  },
  {
    name: 'OpenRouter Free Models',
    badge: 'Expandable',
    description: 'Lets you route to free community models when you want provider variety.',
    status: 'Free-first stack',
  },
  {
    name: 'Groq Fast Inference',
    badge: 'Speed lane',
    description: 'Useful for ultra-fast drafting, edits, and suggestion passes.',
    status: 'Optional acceleration',
  },
  {
    name: 'GitHub Models / repos',
    badge: 'GitHub first',
    description: 'Repository-aware workflows, issue context, and repo handoff belong here.',
    status: 'Core GitHub workflow',
  },
];

export const premiumApiCards = [
  {
    name: 'OpenAI GPT-4o',
    tier: 'Paid API lane',
    summary: 'Strong general coding, UI generation, and tool workflows.',
    priceNote: 'User-funded usage option',
  },
  {
    name: 'Anthropic Claude',
    tier: 'Paid API lane',
    summary: 'Great for long-form reasoning, cleanup, and code explanations.',
    priceNote: 'User-funded usage option',
  },
  {
    name: 'Google Gemini',
    tier: 'Paid API lane',
    summary: 'Useful for multimodal inputs and broad ecosystem coverage.',
    priceNote: 'User-funded usage option',
  },
  {
    name: 'Specialist code models',
    tier: 'Paid API lane',
    summary: 'For advanced edit quality, repo analysis, and premium power users.',
    priceNote: 'Marketplace-ready section',
  },
];

export const templateCards = [
  {
    name: 'SaaS Starter',
    description: 'Auth, billing-ready layout, dashboard, docs, settings.',
    tag: 'Popular',
    category: 'Business',
  },
  {
    name: 'AI Chat Workspace',
    description: 'Prompt panel, context uploads, model selector, operation history.',
    tag: 'Core',
    category: 'AI',
  },
  {
    name: 'Mobile App Shell',
    description: 'Mobile-first screens, account flow, cards, tabs, and gestures.',
    tag: 'Future mobile',
    category: 'Mobile',
  },
  {
    name: 'Marketplace Platform',
    description: 'Listings, filters, vendor pages, admin approval surfaces.',
    tag: 'Monetization',
    category: 'Commerce',
  },
  {
    name: 'Team Workspace',
    description: 'Rooms, threads, activity feeds, member roles, live boards.',
    tag: 'Collab',
    category: 'Team',
  },
  {
    name: 'Portfolio Generator',
    description: 'One-click personal sites from a prompt, image, or repo.',
    tag: 'Fast launch',
    category: 'Creator',
  },
  {
    name: 'Landing Page Builder',
    description: 'Hero, pricing, testimonials, FAQs, and CTA sections.',
    tag: 'Marketing',
    category: 'Growth',
  },
  {
    name: 'Internal Tools Kit',
    description: 'Admin panel, tables, analytics, permissions, and audit logs.',
    tag: 'Ops',
    category: 'Admin',
  },
  {
    name: 'E-commerce Builder',
    description: 'Catalog, cart, checkout UI, and order dashboards.',
    tag: 'Storefront',
    category: 'Commerce',
  },
  {
    name: 'Education Platform',
    description: 'Courses, modules, progress tracking, onboarding, and quiz flows.',
    tag: 'Learning',
    category: 'Education',
  },
  {
    name: 'Social Feed App',
    description: 'Profiles, posts, reactions, media, and creator dashboards.',
    tag: 'Community',
    category: 'Social',
  },
  {
    name: 'Blank from Idea',
    description: 'Start from a prompt and let the AI generate the structure live.',
    tag: 'Flexible',
    category: 'Custom',
  },
];

export const startModes = [
  { title: 'Start from an idea', detail: 'Describe what you want and generate the app skeleton.', icon: Wand2 },
  { title: 'Start from an image', detail: 'Turn screenshots, mockups, or sketches into code.', icon: ImageIcon },
  { title: 'Start from a file', detail: 'Upload requirements, specs, docs, or code snippets.', icon: FileCode2 },
  { title: 'Start from a link', detail: 'Use a website or doc link as context for a remake.', icon: Link2 },
  { title: 'Start from a GitHub repo', detail: 'Analyze a repo, suggest changes, and plan edits.', icon: GitBranch },
  { title: 'Start from a template', detail: 'Choose a fast-launch blueprint and customize it.', icon: Layers3 },
];

export const onboardingSteps = [
  {
    title: 'Choose your launch mode',
    description: 'Pick idea, template, file, image, link, or GitHub repo so the AI starts with real context.',
  },
  {
    title: 'Select the engine lane',
    description: 'Use the free-first stack by default, then upgrade to a paid provider only when you need it.',
  },
  {
    title: 'Review code changes in dropdown cards',
    description: 'Each operation should summarize files, diffs, and reasons without cluttering the chat.',
  },
  {
    title: 'Listen to change narration',
    description: 'Enable voice playback so the AI can read the latest change summary aloud.',
  },
  {
    title: 'Publish or sync with GitHub',
    description: 'Push repo updates, inspect issues, and keep your generated app organized around GitHub workflows.',
  },
];

export const operationFeed = [
  {
    title: 'Landing page remake deployed',
    summary: 'Reworked the homepage into a public marketing landing page with clearer product positioning and stronger CTAs.',
    files: ['src/app/page.tsx', 'src/components/marketing/PublicSiteShell.tsx'],
    explanation: 'This keeps the first impression informative for new users while separating the workspace behind authentication.',
  },
  {
    title: 'Provider strategy organized',
    summary: 'Grouped free-first engines, premium API upsells, and GitHub-heavy workflows into a clearer product model.',
    files: ['src/lib/experience-data.ts', 'src/app/pricing/page.tsx'],
    explanation: 'The new structure explains how free usage works, where paid APIs fit, and why GitHub is a first-class tool.',
  },
  {
    title: 'Theme system upgraded',
    summary: 'Added categorized presets, premium adult pack positioning, and background effects like sparkle, fire, and fluid motion.',
    files: ['src/lib/theme-presets.ts', 'src/contexts/ThemeContext.tsx', 'src/app/theme-dashboard/components/ThemeDashboard.tsx'],
    explanation: 'This gives users real personalization options without forcing a giant unmaintainable theme editor.',
  },
];

export const recommendedPrompts = [
  'Build me a GitHub-connected SaaS starter with admin analytics',
  'Turn this screenshot into a responsive web app with mobile-ready cards',
  'Use this repo and create a safer authentication flow',
  'Generate a neon 3D landing page with premium upsell sections',
];

export const teamActivity = [
  {
    member: 'Riley',
    role: 'Product lead',
    status: 'Reviewing landing copy',
    presence: 'online',
  },
  {
    member: 'Jordan',
    role: 'Frontend builder',
    status: 'Applying theme presets',
    presence: 'editing',
  },
  {
    member: 'Casey',
    role: 'GitHub workflow owner',
    status: 'Preparing repo handoff',
    presence: 'syncing',
  },
];

export const workspaceStats = [
  { label: 'Template launch points', value: '12+' },
  { label: 'Theme presets', value: '60' },
  { label: 'Free-first engine lanes', value: '4' },
  { label: 'Premium provider promos', value: '4' },
];

export const landingHighlights = [
  {
    title: 'Built for coding edits, not just chat',
    description: 'The product is framed around proper code generation, structured change summaries, and better operational explanations.',
    icon: Bot,
  },
  {
    title: 'GitHub-first repo workflows',
    description: 'Repo analysis, issue-aware tasks, branch thinking, and handoff language are treated as a core feature.',
    icon: GitBranch,
  },
  {
    title: 'Start from anything',
    description: 'Ideas, screenshots, files, links, or templates can all become the launch point for the build.',
    icon: Boxes,
  },

  {
    title: 'Themes with personality',
    description: 'Neon, 3D pop, Zelda-inspired, simple, and premium adult-night themes are all part of the experience.',
    icon: Sparkles,
  },
  {
    title: 'Voice summaries and guided onboarding',
    description: 'New users get tutorials and optional read-aloud summaries after each major operation.',
    icon: Mic2,
  },
];
