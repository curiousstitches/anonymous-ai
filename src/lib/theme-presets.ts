export type ThemeCategory =
  | 'simple'
  | 'zelda-inspired'
  | 'vibrant'
  | '3d-pop'
  | 'neon'
  | 'adult-premium';

export type BackgroundEffect = 'sparkle' | 'fire' | 'fluid' | 'gradient' | 'grid' | 'pulse';

export interface ThemePreset {
  id: string;
  name: string;
  category: ThemeCategory;
  description: string;
  primary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
  glow: string;
  effect: BackgroundEffect;
  premium?: boolean;
  priceLabel?: string;
}

const simpleThemes: ThemePreset[] = [
  {
    id: 'simple-midnight',
    name: 'Midnight Slate',
    category: 'simple',
    description: 'Dark and balanced for long coding sessions.',
    primary: '#7c3aed',
    accent: '#22d3ee',
    background: '#09090f',
    surface: '#141422',
    text: '#f5f7ff',
    muted: '#94a3b8',
    border: '#26263a',
    glow: 'rgba(124,58,237,0.35)',
    effect: 'sparkle',
  },
  {
    id: 'simple-frost',
    name: 'Frost Light',
    category: 'simple',
    description: 'Bright, clean, and contrast friendly.',
    primary: '#2563eb',
    accent: '#0ea5e9',
    background: '#f7fbff',
    surface: '#ffffff',
    text: '#0f172a',
    muted: '#475569',
    border: '#dbeafe',
    glow: 'rgba(37,99,235,0.18)',
    effect: 'gradient',
  },
  {
    id: 'simple-carbon',
    name: 'Carbon Graphite',
    category: 'simple',
    description: 'Neutral grayscale with a focused editor feel.',
    primary: '#94a3b8',
    accent: '#f8fafc',
    background: '#0f1117',
    surface: '#171923',
    text: '#f8fafc',
    muted: '#94a3b8',
    border: '#303446',
    glow: 'rgba(148,163,184,0.22)',
    effect: 'grid',
  },
  {
    id: 'simple-sage',
    name: 'Sage Terminal',
    category: 'simple',
    description: 'Soft green calm for minimal builders.',
    primary: '#22c55e',
    accent: '#86efac',
    background: '#08120c',
    surface: '#0d1a12',
    text: '#ecfdf5',
    muted: '#9ca3af',
    border: '#1f3a2b',
    glow: 'rgba(34,197,94,0.26)',
    effect: 'pulse',
  },
  {
    id: 'simple-ember',
    name: 'Ember Desk',
    category: 'simple',
    description: 'Warm contrast with subtle orange guidance.',
    primary: '#f97316',
    accent: '#fb923c',
    background: '#140c08',
    surface: '#221510',
    text: '#fff7ed',
    muted: '#cbd5e1',
    border: '#3b2418',
    glow: 'rgba(249,115,22,0.28)',
    effect: 'fire',
  },
  {
    id: 'simple-iris',
    name: 'Iris Notes',
    category: 'simple',
    description: 'Gentle purple workspace for mixed writing and coding.',
    primary: '#8b5cf6',
    accent: '#c084fc',
    background: '#11101b',
    surface: '#1c1830',
    text: '#f5f3ff',
    muted: '#c4b5fd',
    border: '#2d2750',
    glow: 'rgba(192,132,252,0.24)',
    effect: 'fluid',
  },
  {
    id: 'simple-ocean',
    name: 'Ocean Draft',
    category: 'simple',
    description: 'Cool cyan with a fluid dashboard presence.',
    primary: '#06b6d4',
    accent: '#67e8f9',
    background: '#07151a',
    surface: '#0d232b',
    text: '#ecfeff',
    muted: '#a5f3fc',
    border: '#143a45',
    glow: 'rgba(6,182,212,0.24)',
    effect: 'fluid',
  },
  {
    id: 'simple-rose',
    name: 'Rose Signal',
    category: 'simple',
    description: 'Soft pink highlights without losing readability.',
    primary: '#ec4899',
    accent: '#f9a8d4',
    background: '#160912',
    surface: '#25111f',
    text: '#fdf2f8',
    muted: '#fbcfe8',
    border: '#4a1f3a',
    glow: 'rgba(236,72,153,0.24)',
    effect: 'sparkle',
  },
  {
    id: 'simple-forest',
    name: 'Forest Ops',
    category: 'simple',
    description: 'Grounded green theme with subtle motion.',
    primary: '#16a34a',
    accent: '#4ade80',
    background: '#08100a',
    surface: '#101b13',
    text: '#f0fdf4',
    muted: '#bbf7d0',
    border: '#1f3b27',
    glow: 'rgba(74,222,128,0.22)',
    effect: 'gradient',
  },
  {
    id: 'simple-paper',
    name: 'Paper Studio',
    category: 'simple',
    description: 'Light mode with soft card separation and blue accents.',
    primary: '#2563eb',
    accent: '#7c3aed',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#111827',
    muted: '#64748b',
    border: '#e2e8f0',
    glow: 'rgba(37,99,235,0.16)',
    effect: 'pulse',
  },
];

function buildTheme(
  id: string,
  name: string,
  category: ThemeCategory,
  description: string,
  colors: {
    primary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
    border: string;
    glow: string;
  },
  effect: BackgroundEffect,
  premium = false,
): ThemePreset {
  return {
    id,
    name,
    category,
    description,
    effect,
    premium,
    priceLabel: premium ? '$10 Premium' : undefined,
    ...colors,
  };
}

const zeldaInspiredThemes: ThemePreset[] = [
  buildTheme('zelda-kokiri', 'Kokiri Glow', 'zelda-inspired', 'Forest energy with emerald magic accents.', { primary: '#22c55e', accent: '#38bdf8', background: '#07130d', surface: '#102217', text: '#f0fdf4', muted: '#bbf7d0', border: '#1e3a2b', glow: 'rgba(34,197,94,0.28)' }, 'sparkle'),
  buildTheme('zelda-temple', 'Temple of Time', 'zelda-inspired', 'Ancient stone blues with sacred light.', { primary: '#60a5fa', accent: '#c084fc', background: '#0a1020', surface: '#141d34', text: '#eff6ff', muted: '#bfdbfe', border: '#29314a', glow: 'rgba(96,165,250,0.28)' }, 'gradient'),
  buildTheme('zelda-gerudo', 'Gerudo Dusk', 'zelda-inspired', 'Sunset sand palette with royal edge.', { primary: '#f97316', accent: '#facc15', background: '#1b0d08', surface: '#2e1911', text: '#fff7ed', muted: '#fdba74', border: '#4a2b1f', glow: 'rgba(249,115,22,0.3)' }, 'fire'),
  buildTheme('zelda-zora', 'Zora Tides', 'zelda-inspired', 'Crystal water tones for aquatic builds.', { primary: '#06b6d4', accent: '#7dd3fc', background: '#07131b', surface: '#102331', text: '#ecfeff', muted: '#a5f3fc', border: '#1f3e52', glow: 'rgba(34,211,238,0.24)' }, 'fluid'),
  buildTheme('zelda-goron', 'Goron Forge', 'zelda-inspired', 'Volcanic reds and magma gold sparks.', { primary: '#ef4444', accent: '#f59e0b', background: '#160706', surface: '#2a1210', text: '#fef2f2', muted: '#fecaca', border: '#4b1f1c', glow: 'rgba(239,68,68,0.28)' }, 'fire'),
  buildTheme('zelda-lonlon', 'Lon Lon Dawn', 'zelda-inspired', 'Warm ranch morning with airy highlights.', { primary: '#f59e0b', accent: '#38bdf8', background: '#1a1207', surface: '#2c2110', text: '#fffbeb', muted: '#fde68a', border: '#4b3920', glow: 'rgba(245,158,11,0.24)' }, 'pulse'),
  buildTheme('zelda-shadow', 'Shadow Temple', 'zelda-inspired', 'Moody violet depths with spectral cyan.', { primary: '#7c3aed', accent: '#22d3ee', background: '#09080f', surface: '#161322', text: '#f5f3ff', muted: '#c4b5fd', border: '#2f2942', glow: 'rgba(124,58,237,0.3)' }, 'sparkle'),
  buildTheme('zelda-sky', 'Sky Loft', 'zelda-inspired', 'Bright cloudlike blues with gold trim.', { primary: '#38bdf8', accent: '#facc15', background: '#08141d', surface: '#102534', text: '#f0f9ff', muted: '#bae6fd', border: '#234256', glow: 'rgba(56,189,248,0.22)' }, 'gradient'),
  buildTheme('zelda-master', 'Master Blade', 'zelda-inspired', 'Heroic indigo and silver command center.', { primary: '#6366f1', accent: '#f8fafc', background: '#090d18', surface: '#151b2b', text: '#eef2ff', muted: '#c7d2fe', border: '#28314a', glow: 'rgba(99,102,241,0.28)' }, 'grid'),
  buildTheme('zelda-fairy', 'Fairy Fountain', 'zelda-inspired', 'Luminous teal with magical sparkle bloom.', { primary: '#2dd4bf', accent: '#a78bfa', background: '#071312', surface: '#0f2422', text: '#f0fdfa', muted: '#99f6e4', border: '#1f4641', glow: 'rgba(45,212,191,0.26)' }, 'sparkle'),
];

const vibrantThemes: ThemePreset[] = [
  buildTheme('vibrant-citrus', 'Citrus Velocity', 'vibrant', 'High-energy lime and orange blend.', { primary: '#f59e0b', accent: '#84cc16', background: '#140f05', surface: '#261d0b', text: '#fff7ed', muted: '#fde68a', border: '#48391c', glow: 'rgba(132,204,22,0.28)' }, 'pulse'),
  buildTheme('vibrant-lagoon', 'Lagoon Pop', 'vibrant', 'Tropical cyan with bold pink highlights.', { primary: '#06b6d4', accent: '#ec4899', background: '#06131a', surface: '#11242d', text: '#ecfeff', muted: '#a5f3fc', border: '#21404d', glow: 'rgba(236,72,153,0.24)' }, 'fluid'),
  buildTheme('vibrant-candy', 'Candy Reactor', 'vibrant', 'Sweet color bursts tuned for creators.', { primary: '#f43f5e', accent: '#8b5cf6', background: '#160711', surface: '#281228', text: '#fff1f2', muted: '#fecdd3', border: '#4a2341', glow: 'rgba(244,63,94,0.28)' }, 'sparkle'),
  buildTheme('vibrant-aurora', 'Aurora Burst', 'vibrant', 'Color-shifting greens and violets.', { primary: '#22c55e', accent: '#8b5cf6', background: '#07130d', surface: '#12211a', text: '#f0fdf4', muted: '#bbf7d0', border: '#234231', glow: 'rgba(139,92,246,0.26)' }, 'gradient'),
  buildTheme('vibrant-sunrise', 'Sunrise Wave', 'vibrant', 'Warm pink-to-gold motion-heavy studio.', { primary: '#fb7185', accent: '#f59e0b', background: '#17090d', surface: '#2b121a', text: '#fff1f2', muted: '#fecdd3', border: '#4e2330', glow: 'rgba(251,113,133,0.28)' }, 'gradient'),
  buildTheme('vibrant-electric', 'Electric Berry', 'vibrant', 'Purple and fuchsia for bold product demos.', { primary: '#a855f7', accent: '#f472b6', background: '#12081b', surface: '#22122c', text: '#faf5ff', muted: '#e9d5ff', border: '#402356', glow: 'rgba(168,85,247,0.28)' }, 'pulse'),
  buildTheme('vibrant-cobalt', 'Cobalt Punch', 'vibrant', 'Sharp blue with citrus counterpoint.', { primary: '#2563eb', accent: '#facc15', background: '#071021', surface: '#111f37', text: '#eff6ff', muted: '#bfdbfe', border: '#243a5c', glow: 'rgba(37,99,235,0.28)' }, 'grid'),
  buildTheme('vibrant-melon', 'Melon Mix', 'vibrant', 'Juicy coral with mint softness.', { primary: '#fb7185', accent: '#34d399', background: '#180c0d', surface: '#2b1517', text: '#fff1f2', muted: '#fecdd3', border: '#4b2428', glow: 'rgba(52,211,153,0.24)' }, 'sparkle'),
  buildTheme('vibrant-plasma', 'Plasma Flash', 'vibrant', 'Bright cyan and violet for modern dashboards.', { primary: '#22d3ee', accent: '#8b5cf6', background: '#071018', surface: '#112031', text: '#ecfeff', muted: '#a5f3fc', border: '#213d56', glow: 'rgba(34,211,238,0.26)' }, 'fluid'),
  buildTheme('vibrant-carnival', 'Carnival Stack', 'vibrant', 'Festival palette with balanced dark cards.', { primary: '#ef4444', accent: '#22c55e', background: '#150809', surface: '#261214', text: '#fef2f2', muted: '#fecaca', border: '#4d2026', glow: 'rgba(239,68,68,0.28)' }, 'fire'),
];

const pop3dThemes: ThemePreset[] = [
  buildTheme('pop-arcade', 'Arcade Toybox', '3d-pop', 'Chunky cyan and gum colors with playful lift.', { primary: '#38bdf8', accent: '#fb7185', background: '#0b1020', surface: '#1a2240', text: '#f8fafc', muted: '#cbd5e1', border: '#32406b', glow: 'rgba(56,189,248,0.28)' }, 'pulse'),
  buildTheme('pop-bubble', 'Bubble Sculpt', '3d-pop', 'Rounded magenta blocks with glossy energy.', { primary: '#f472b6', accent: '#60a5fa', background: '#170d1f', surface: '#2a1736', text: '#fdf2f8', muted: '#fbcfe8', border: '#4e2b63', glow: 'rgba(244,114,182,0.28)' }, 'fluid'),
  buildTheme('pop-jelly', 'Jelly Engine', '3d-pop', 'Soft mint and lilac with smooth gradients.', { primary: '#34d399', accent: '#a78bfa', background: '#091411', surface: '#14251d', text: '#ecfdf5', muted: '#bbf7d0', border: '#274436', glow: 'rgba(52,211,153,0.26)' }, 'fluid'),
  buildTheme('pop-block', 'Block Party', '3d-pop', 'Color-blocked orange and blue dashboard.', { primary: '#f97316', accent: '#3b82f6', background: '#1a0d06', surface: '#2f180d', text: '#fff7ed', muted: '#fdba74', border: '#55301a', glow: 'rgba(59,130,246,0.24)' }, 'gradient'),
  buildTheme('pop-luxe', 'Luxe Plastic', '3d-pop', 'Glossy purple shells with soft cyan edges.', { primary: '#8b5cf6', accent: '#22d3ee', background: '#0d0a1b', surface: '#1b1532', text: '#f5f3ff', muted: '#ddd6fe', border: '#36295d', glow: 'rgba(139,92,246,0.28)' }, 'sparkle'),
  buildTheme('pop-pixel', 'Pixel Balloon', '3d-pop', 'Retro candy layers with big playful depth.', { primary: '#f43f5e', accent: '#facc15', background: '#17070d', surface: '#2a121b', text: '#fff1f2', muted: '#fecdd3', border: '#4c2230', glow: 'rgba(250,204,21,0.24)' }, 'pulse'),
  buildTheme('pop-cloud', 'Cloud Build', '3d-pop', 'Airy blue cards with 3D hover feel.', { primary: '#60a5fa', accent: '#93c5fd', background: '#08111d', surface: '#102234', text: '#eff6ff', muted: '#bfdbfe', border: '#22415d', glow: 'rgba(147,197,253,0.24)' }, 'gradient'),
  buildTheme('pop-orbit', 'Orbit Gum', '3d-pop', 'Space pop mix with aqua and pink edges.', { primary: '#2dd4bf', accent: '#f472b6', background: '#071214', surface: '#112227', text: '#f0fdfa', muted: '#99f6e4', border: '#22434c', glow: 'rgba(45,212,191,0.26)' }, 'sparkle'),
  buildTheme('pop-marble', 'Marble Candy', '3d-pop', 'Creamy surfaces with colorful feature blocks.', { primary: '#f59e0b', accent: '#a855f7', background: '#171109', surface: '#292013', text: '#fffbeb', muted: '#fde68a', border: '#4a3920', glow: 'rgba(168,85,247,0.24)' }, 'grid'),
  buildTheme('pop-toffee', 'Toffee Studio', '3d-pop', 'Warm brown pop with teal interface ink.', { primary: '#fb923c', accent: '#2dd4bf', background: '#170e09', surface: '#2d1d15', text: '#fff7ed', muted: '#fed7aa', border: '#503726', glow: 'rgba(45,212,191,0.22)' }, 'pulse'),
];

const neonThemes: ThemePreset[] = [
  buildTheme('neon-night', 'Night Circuit', 'neon', 'Classic neon violet with cyber cyan rails.', { primary: '#a855f7', accent: '#22d3ee', background: '#050510', surface: '#0e1122', text: '#f5f3ff', muted: '#c4b5fd', border: '#262d4a', glow: 'rgba(168,85,247,0.4)' }, 'grid'),
  buildTheme('neon-toxic', 'Toxic Pulse', 'neon', 'Acid green UI with blacklight contrast.', { primary: '#84cc16', accent: '#22c55e', background: '#070d04', surface: '#121b0c', text: '#f7fee7', muted: '#d9f99d', border: '#2d441c', glow: 'rgba(132,204,22,0.36)' }, 'pulse'),
  buildTheme('neon-laser', 'Laser Pink', 'neon', 'Fuchsia beams over dark navy shells.', { primary: '#ec4899', accent: '#f472b6', background: '#0d0611', surface: '#1c1024', text: '#fdf2f8', muted: '#fbcfe8', border: '#3b2150', glow: 'rgba(236,72,153,0.38)' }, 'sparkle'),
  buildTheme('neon-cyan', 'Cyan Reactor', 'neon', 'Bright turquoise glow with deep-space cards.', { primary: '#22d3ee', accent: '#67e8f9', background: '#041015', surface: '#0b1d27', text: '#ecfeff', muted: '#a5f3fc', border: '#164352', glow: 'rgba(34,211,238,0.38)' }, 'fluid'),
  buildTheme('neon-orange', 'Orange Voltage', 'neon', 'Amber plasma with heavy contrast.', { primary: '#f97316', accent: '#fb7185', background: '#120905', surface: '#24130d', text: '#fff7ed', muted: '#fdba74', border: '#4b281c', glow: 'rgba(249,115,22,0.34)' }, 'fire'),
  buildTheme('neon-rift', 'Rift Core', 'neon', 'Blue-violet stack with sci-fi pulse.', { primary: '#6366f1', accent: '#22d3ee', background: '#050817', surface: '#0d1530', text: '#eef2ff', muted: '#c7d2fe', border: '#23335e', glow: 'rgba(99,102,241,0.36)' }, 'grid'),
  buildTheme('neon-afterglow', 'Afterglow', 'neon', 'Purple and coral for creator dashboards.', { primary: '#c026d3', accent: '#fb7185', background: '#110512', surface: '#221025', text: '#fdf4ff', muted: '#f5d0fe', border: '#4a1f4c', glow: 'rgba(192,38,211,0.38)' }, 'sparkle'),
  buildTheme('neon-gaming', 'Gaming Lane', 'neon', 'Green, cyan, and ultraviolet tournament vibe.', { primary: '#10b981', accent: '#8b5cf6', background: '#050d0c', surface: '#0d1d1d', text: '#ecfdf5', muted: '#a7f3d0', border: '#1c4440', glow: 'rgba(16,185,129,0.34)' }, 'pulse'),
  buildTheme('neon-holo', 'Holo Deck', 'neon', 'Holographic blue surfaces with subtle chrome.', { primary: '#38bdf8', accent: '#c084fc', background: '#06101a', surface: '#112030', text: '#f0f9ff', muted: '#bae6fd', border: '#224456', glow: 'rgba(192,132,252,0.32)' }, 'fluid'),
  buildTheme('neon-ember', 'Ember Wire', 'neon', 'Red-orange signal lines for intense sessions.', { primary: '#ef4444', accent: '#f97316', background: '#110504', surface: '#220c0b', text: '#fef2f2', muted: '#fecaca', border: '#451b1a', glow: 'rgba(239,68,68,0.36)' }, 'fire'),
];

const adultPremiumThemes: ThemePreset[] = [
  buildTheme('adult-velvet', 'Velvet Lounge', 'adult-premium', 'Deep wine palette for a late-night premium studio.', { primary: '#be123c', accent: '#fb7185', background: '#120609', surface: '#210c12', text: '#fff1f2', muted: '#fecdd3', border: '#451726', glow: 'rgba(190,18,60,0.34)' }, 'sparkle', true),
  buildTheme('adult-obsidian', 'Obsidian Gold', 'adult-premium', 'Black, bronze, and gold executive glow.', { primary: '#f59e0b', accent: '#fcd34d', background: '#0b0907', surface: '#171410', text: '#fffbeb', muted: '#fde68a', border: '#352d20', glow: 'rgba(245,158,11,0.32)' }, 'gradient', true),
  buildTheme('adult-noir', 'Noir Cherry', 'adult-premium', 'Sharp noir cards with red satin accents.', { primary: '#dc2626', accent: '#fb7185', background: '#0c0506', surface: '#180b0d', text: '#fef2f2', muted: '#fecaca', border: '#34171b', glow: 'rgba(220,38,38,0.34)' }, 'fire', true),
  buildTheme('adult-smoke', 'Smoke Glass', 'adult-premium', 'Smoked glass surfaces with silver highlights.', { primary: '#94a3b8', accent: '#e2e8f0', background: '#090b10', surface: '#12161f', text: '#f8fafc', muted: '#cbd5e1', border: '#273043', glow: 'rgba(148,163,184,0.28)' }, 'fluid', true),
  buildTheme('adult-bourbon', 'Bourbon Barrel', 'adult-premium', 'Brown leather warmth and amber glow.', { primary: '#c2410c', accent: '#fb923c', background: '#100905', surface: '#1d130d', text: '#fff7ed', muted: '#fed7aa', border: '#3a2418', glow: 'rgba(194,65,12,0.32)' }, 'fire', true),
  buildTheme('adult-royale', 'Royal Suite', 'adult-premium', 'Purple velvet theme with gold finishing.', { primary: '#7c3aed', accent: '#facc15', background: '#0d0714', surface: '#191126', text: '#faf5ff', muted: '#e9d5ff', border: '#32224a', glow: 'rgba(124,58,237,0.34)' }, 'sparkle', true),
  buildTheme('adult-emerald', 'Emerald Room', 'adult-premium', 'Sophisticated dark green with luxe accents.', { primary: '#059669', accent: '#34d399', background: '#050c09', surface: '#0d1712', text: '#ecfdf5', muted: '#a7f3d0', border: '#204232', glow: 'rgba(5,150,105,0.32)' }, 'gradient', true),
  buildTheme('adult-midnight', 'Midnight Hotel', 'adult-premium', 'Navy-black cards with cyan concierge glow.', { primary: '#0ea5e9', accent: '#67e8f9', background: '#040912', surface: '#0d1525', text: '#f0f9ff', muted: '#bae6fd', border: '#213b59', glow: 'rgba(14,165,233,0.32)' }, 'grid', true),
  buildTheme('adult-crimson', 'Crimson Silk', 'adult-premium', 'Deep red premium pack with soft bloom.', { primary: '#e11d48', accent: '#fb7185', background: '#100509', surface: '#1d0d12', text: '#fff1f2', muted: '#fecdd3', border: '#421924', glow: 'rgba(225,29,72,0.34)' }, 'sparkle', true),
  buildTheme('adult-luxe', 'Luxe After Hours', 'adult-premium', 'Mature premium mix of violet, gold, and shadow.', { primary: '#a855f7', accent: '#f59e0b', background: '#0b0814', surface: '#161126', text: '#f5f3ff', muted: '#ddd6fe', border: '#2d2247', glow: 'rgba(168,85,247,0.34)' }, 'pulse', true),
];

export const allThemes: ThemePreset[] = [
  ...simpleThemes,
  ...zeldaInspiredThemes,
  ...vibrantThemes,
  ...pop3dThemes,
  ...neonThemes,
  ...adultPremiumThemes,
];

export const themeGroups = {
  simple: simpleThemes,
  'zelda-inspired': zeldaInspiredThemes,
  vibrant: vibrantThemes,
  '3d-pop': pop3dThemes,
  neon: neonThemes,
  'adult-premium': adultPremiumThemes,
};
