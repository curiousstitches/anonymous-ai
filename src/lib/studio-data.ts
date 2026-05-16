export type ProviderStatus = 'active' | 'ready' | 'premium';

export interface ProviderCard {
  name: string;
  category: 'free' | 'premium';
  status: ProviderStatus;
  summary: string;
  strengths: string[];
  models: string[];
  access: string;
  accent: string;
}

export interface TemplateCard {
  name: string;
  category: string;
  inputMode: 'idea' | 'image' | 'file' | 'link' | 'repo';
  summary: string;
  outputs: string[];
  accent: string;
}

export interface TutorialStep {
  title: string;
  summary: string;
  checkpoints: string[];
}

export interface FeatureHighlight {
  title: string;
  summary: string;
}

export const landingStats = [
  { label: 'Theme presets', value: '60', detail: 'Across simple, Zelda-inspired, vibrant, 3D pop, neon, and premium adult themes.' },
  { label: 'Starter templates', value: '18', detail: 'From SaaS dashboards and mobile apps to GitHub repo refreshes and agent tools.' },
  { label: 'Core input modes', value: '5', detail: 'Start from an idea, image, file, link, or repository workflow.' },
  { label: 'Default free engine', value: 'Puter', detail: 'The built-in no-key path stays front and center for instant coding sessions.' },
];

export const landingHighlights: FeatureHighlight[] = [
  {
    title: 'AI coding studio first',
    summary: 'The remake centers the product around building, editing, and explaining code with a detailed live workspace instead of a generic chat app.',
  },
  {
    title: 'GitHub-aware workflow',
    summary: 'Repository sync, issue-to-feature planning, commit-ready summaries, and repo-focused prompts are surfaced as first-class tools.',
  },
  {
    title: 'Template-rich onboarding',
    summary: 'New users can start from curated templates or feed the builder an idea, screenshot, uploaded file, or link to kick off generation.',
  },
  {
    title: 'Deep personalization',
    summary: 'Animated backgrounds, neon accents, 3D-style panels, theme presets, motion tuning, density controls, and narration preferences are built in.',
  },
];

export const freeProviders: ProviderCard[] = [
  {
    name: 'Puter AI',
    category: 'free',
    status: 'active',
    summary: 'Built-in no-key coding engine for instant code edits, scaffold generation, and explanation-heavy sessions.',
    strengths: ['No API key required', 'Good for instant builder sessions', 'Available in the current chat flow'],
    models: ['GPT-4o route', 'Claude route', 'Streaming responses'],
    access: 'Live now',
    accent: '#22d3ee',
  },
  {
    name: 'GitHub-native repo workflows',
    category: 'free',
    status: 'ready',
    summary: 'Repo-centered prompts, commit summaries, issue breakdowns, and template entry points designed around GitHub usage.',
    strengths: ['Repo planning', 'PR-ready summaries', 'Issue-to-build flow'],
    models: ['Repository prompts', 'Diff reviews', 'Scaffold planning'],
    access: 'Product surface ready',
    accent: '#a78bfa',
  },
  {
    name: 'Bring-your-own free providers',
    category: 'free',
    status: 'ready',
    summary: 'The provider catalog is organized so additional free-tier engines can be slotted in without changing the core workspace model.',
    strengths: ['Catalog-ready UI', 'Clear free vs paid separation', 'Easy expansion path'],
    models: ['Open-weight or hosted free models', 'Experimental tools', 'Fallback engines'],
    access: 'Ready for configuration',
    accent: '#10b981',
  },
];

export const premiumProviders: ProviderCard[] = [
  {
    name: 'OpenAI',
    category: 'premium',
    status: 'premium',
    summary: 'Top paid option for strong reasoning, code generation, and polished refactors when users want premium output.',
    strengths: ['High-quality code edits', 'Reliable structured output', 'Broad model ecosystem'],
    models: ['GPT-4o', 'GPT-4.1', 'Reasoning models'],
    access: 'User-paid provider',
    accent: '#38bdf8',
  },
  {
    name: 'Anthropic',
    category: 'premium',
    status: 'premium',
    summary: 'Excellent for careful long-form reasoning, architecture discussions, and large codebase planning.',
    strengths: ['Long-form explanations', 'Strong code reviews', 'Large context workflows'],
    models: ['Claude Sonnet', 'Claude Opus'],
    access: 'User-paid provider',
    accent: '#c084fc',
  },
  {
    name: 'Google Gemini',
    category: 'premium',
    status: 'premium',
    summary: 'Useful for multimodal prompting and large-context product work when users want a premium alternate engine.',
    strengths: ['Large context', 'Multimodal inputs', 'Strong planning support'],
    models: ['Gemini 1.5 Pro', 'Gemini 2.x family'],
    access: 'User-paid provider',
    accent: '#f59e0b',
  },
  {
    name: 'Specialist premium stack',
    category: 'premium',
    status: 'premium',
    summary: 'A dedicated paid catalog page advertises premium engines so users can choose the best model for their job and pay for that lane only.',
    strengths: ['Clear upsell path', 'Task-based provider choice', 'Premium-only marketing section'],
    models: ['Reasoning', 'Vision', 'Code completion'],
    access: 'User-paid provider',
    accent: '#fb7185',
  },
];

export const templateCards: TemplateCard[] = [
  {
    name: 'SaaS command center',
    category: 'Web app',
    inputMode: 'idea',
    summary: 'Start from a plain-English concept and generate the landing page, auth, dashboard, billing copy, and settings shell.',
    outputs: ['Landing page', 'Dashboard shell', 'Admin views'],
    accent: '#22d3ee',
  },
  {
    name: 'Mobile launcher',
    category: 'Mobile app',
    inputMode: 'idea',
    summary: 'Kick off a cross-platform mobile-style workflow with feature cards, onboarding, and app-store-ready product structure.',
    outputs: ['Onboarding', 'Feature map', 'Mobile UI sections'],
    accent: '#a78bfa',
  },
  {
    name: 'Screenshot-to-build',
    category: 'Visual clone',
    inputMode: 'image',
    summary: 'Use an uploaded image or screenshot as the build brief and translate it into a layout, components, and theme direction.',
    outputs: ['Layout map', 'Component plan', 'Theme direction'],
    accent: '#fb7185',
  },
  {
    name: 'File upgrade assistant',
    category: 'Refactor',
    inputMode: 'file',
    summary: 'Drop in code or documents and have the builder reorganize, modernize, and explain what changed.',
    outputs: ['Refactor plan', 'Updated code', 'Change summary'],
    accent: '#10b981',
  },
  {
    name: 'Link-to-product brief',
    category: 'Research',
    inputMode: 'link',
    summary: 'Turn a URL into a feature brief, product positioning outline, and implementation checklist for a new app.',
    outputs: ['Brief', 'Requirements', 'Prompt starter'],
    accent: '#f59e0b',
  },
  {
    name: 'Repo refresh',
    category: 'GitHub',
    inputMode: 'repo',
    summary: 'Use repository context to plan a redesign, issue queue, migration roadmap, and commit-friendly change batches.',
    outputs: ['Repo audit', 'Issue plan', 'Release notes'],
    accent: '#60a5fa',
  },
  {
    name: 'Template marketplace pack',
    category: 'Starter kit',
    inputMode: 'idea',
    summary: 'Choose from curated app starters so the first session feels guided instead of blank.',
    outputs: ['Starter prompts', 'Project sections', 'Branding ideas'],
    accent: '#34d399',
  },
  {
    name: 'Commerce starter',
    category: 'Web app',
    inputMode: 'idea',
    summary: 'Spin up storefront, admin, catalog, promotional sections, and operational panels tailored to digital builders.',
    outputs: ['Storefront', 'Admin panels', 'Product cards'],
    accent: '#f97316',
  },
];

export const tutorialSteps: TutorialStep[] = [
  {
    title: '1. Pick how you want to start',
    summary: 'Choose idea, image, file, link, or repo-based entry so the builder already knows your starting context.',
    checkpoints: ['Idea prompt starter', 'Screenshot flow', 'File and link intake'],
  },
  {
    title: '2. Select a free or paid engine lane',
    summary: 'Free-first users stay on Puter by default, while advanced users can browse premium engines in a dedicated provider catalog.',
    checkpoints: ['Puter default', 'Provider catalog', 'Task-based engine hints'],
  },
  {
    title: '3. Generate with builder mode',
    summary: 'Switch into project builder mode when you want full-file outputs, scaffold-style responses, and detailed end-of-operation explanations.',
    checkpoints: ['Project panel', 'Scaffold prompts', 'Detailed explanation flow'],
  },
  {
    title: '4. Review collapsible code and change boxes',
    summary: 'The chat surface keeps large answers readable by tucking code, info, and change summaries into expandable sections.',
    checkpoints: ['Code dropdowns', 'Change boxes', 'Less cluttered chat history'],
  },
  {
    title: '5. Personalize your studio',
    summary: 'Choose from 60 themes, adjust motion and density, and enable narration so the workspace feels like your own.',
    checkpoints: ['Theme presets', 'Narration toggle', 'Motion controls'],
  },
  {
    title: '6. Graduate into admin and scaling flows',
    summary: 'Owner-only controls and profile/admin navigation keep operational work separate from normal building sessions.',
    checkpoints: ['Owner login', 'Admin jump links', 'Operational overview'],
  },
];

export const githubWorkflows = [
  'Turn issues into feature briefs and build prompts.',
  'Generate commit summaries and release notes from completed work.',
  'Use repo-focused templates when refreshing an existing product.',
  'Keep GitHub as the main organizational surface around the AI builder.',
];

export const workspacePrompts = [
  'Rebuild this SaaS app into a neon mobile-first dashboard with admin tools.',
  'Use this screenshot to generate a responsive landing page and authenticated shell.',
  'Turn my GitHub repo structure into a release roadmap with commit-ready change batches.',
  'Start from a Zelda-inspired theme and generate a polished onboarding flow.',
  'Review this uploaded file and rewrite it with a detailed final explanation.',
];

export const pricingHighlights = [
  {
    tier: 'Free Builder Lane',
    price: '$0',
    description: 'Use the default free workflow centered on Puter, templates, tutorials, and the personalized workspace shell.',
  },
  {
    tier: 'Premium Adult Theme Pack',
    price: '$10',
    description: 'Unlock the mature premium theme category while keeping the rest of the theme system available to all users.',
  },
  {
    tier: 'Bring Your Own Premium Model',
    price: 'Provider fee',
    description: 'Users choose the premium engine they want and only pay for that provider path instead of being forced onto one stack.',
  },
];

export const adminHighlights = [
  'Owner login path already supports a dedicated admin identity.',
  'Admin pages now focus on provider posture, operational visibility, and quick jumps back to the normal profile.',
  'The normal user experience and admin experience stay clearly separated in navigation.',
];
