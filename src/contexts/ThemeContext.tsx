'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface ThemeCustomization {
  // Colors
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  cardColor: string;
  foregroundColor: string;
  mutedColor: string;
  borderColor: string;
  secondaryColor: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
  infoColor: string;
  gradientStart: string;
  gradientMid: string;
  gradientEnd: string;
  gradientAngle: number;
  // Typography
  fontFamily: string;
  fontSizeBase: number;
  fontWeightNormal: number;
  fontWeightBold: number;
  lineHeight: number;
  letterSpacing: number;
  headingFont: string;
  monoFont: string;
  // Layout
  borderRadius: number;
  cardPadding: number;
  sidebarWidth: number;
  contentMaxWidth: number;
  spacing: number;
  // Effects
  glowIntensity: number;
  shadowDepth: number;
  blur: number;
  saturation: number;
  brightness: number;
  contrast: number;
  hueRotate: number;
  // 3D Effects
  perspective: number;
  rotateX: number;
  rotateY: number;
  translateZ: number;
  cardDepth: number;
  // Animations
  animationSpeed: number;
  transitionEasing: string;
  hoverScale: number;
  clickScale: number;
  // Background
  bgAnimationType: string;
  bgParticleCount: number;
  bgParticleSize: number;
  bgParticleSpeed: number;
  bgParticleColor: string;
  bgFireworkFrequency: number;
  bgSparkleIntensity: number;
  bgSparkColor: string;
  bgGlowColor: string;
  bgOpacity: number;
  bgBlur: number;
  // Borders
  borderWidth: number;
  borderStyle: string;
  borderGlow: boolean;
  borderGlowColor: string;
  borderGlowIntensity: number;
  // Buttons
  buttonStyle: string;
  buttonGlow: boolean;
  buttonGlowColor: string;
  button3D: boolean;
  buttonBorderRadius: number;
  buttonPaddingX: number;
  buttonPaddingY: number;
  // Cards
  cardStyle: string;
  cardGlow: boolean;
  cardGlowColor: string;
  card3D: boolean;
  cardHoverLift: number;
  cardBorderRadius: number;
  // Sidebar
  sidebarStyle: string;
  sidebarGlow: boolean;
  sidebarBlur: number;
  sidebarOpacity: number;
  // Text effects
  textGlow: boolean;
  textGlowColor: string;
  textGlowIntensity: number;
  gradientText: boolean;
  textShadow: boolean;
  // Scrollbar
  scrollbarWidth: number;
  scrollbarColor: string;
  scrollbarTrackColor: string;
  // Misc
  cursorStyle: string;
  selectionColor: string;
  focusRingColor: string;
  focusRingWidth: number;
  inputStyle: string;
  badgeStyle: string;
  iconStyle: string;
  avatarStyle: string;
  tooltipStyle: string;
  popoverStyle: string;
  modalStyle: string;
  notificationStyle: string;
  codeBlockStyle: string;
  tableStyle: string;
  listStyle: string;
  dividerStyle: string;
  tagStyle: string;
  progressStyle: string;
  sliderStyle: string;
  checkboxStyle: string;
  radioStyle: string;
  toggleStyle: string;
  dropdownStyle: string;
  tabStyle: string;
  breadcrumbStyle: string;
  paginationStyle: string;
  alertStyle: string;
  bannerStyle: string;
  chipStyle: string;
  avatarBorderColor: string;
  navActiveStyle: string;
  navHoverStyle: string;
  linkColor: string;
  linkHoverColor: string;
  linkDecoration: string;
  headingGradient: boolean;
  subheadingColor: string;
  captionColor: string;
  labelColor: string;
  placeholderColor: string;
  disabledOpacity: number;
  overlayColor: string;
  overlayOpacity: number;
  backdropBlur: number;
  glassmorphism: boolean;
  glassmorphismOpacity: number;
  neumorphism: boolean;
  neonGlow: boolean;
  neonColor: string;
  retroStyle: boolean;
  cyberpunkStyle: boolean;
  minimalistStyle: boolean;
  maximalistStyle: boolean;
  darkMode: boolean;
  highContrast: boolean;
  colorBlindMode: string;
  reducedMotion: boolean;
  compactMode: boolean;
  comfortableMode: boolean;
  spaciousMode: boolean;
  roundedEverything: boolean;
  sharpEverything: boolean;
  outlineStyle: boolean;
  filledStyle: boolean;
  ghostStyle: boolean;
  softStyle: boolean;
  boldStyle: boolean;
  lightStyle: boolean;
  monochromeMode: boolean;
  rainbowMode: boolean;
  pastelMode: boolean;
  vibrantMode: boolean;
  earthToneMode: boolean;
  oceanMode: boolean;
  forestMode: boolean;
  sunsetMode: boolean;
  midnightMode: boolean;
  neonMode: boolean;
  candyMode: boolean;
  metalMode: boolean;
  woodMode: boolean;
  stoneMode: boolean;
  glassMode: boolean;
  holographicMode: boolean;
  pixelMode: boolean;
  skeuomorphicMode: boolean;
  flatMode: boolean;
  materialMode: boolean;
  fluentMode: boolean;
  cupertino: boolean;
  androidStyle: boolean;
  windowsStyle: boolean;
  linuxStyle: boolean;
  terminalStyle: boolean;
  retroTerminalStyle: boolean;
  vaporwaveStyle: boolean;
  lofiStyle: boolean;
  synthwaveStyle: boolean;
  cottagecore: boolean;
  darkAcademia: boolean;
  lightAcademia: boolean;
  y2kStyle: boolean;
  memphisStyle: boolean;
  bauhaus: boolean;
  artDeco: boolean;
  brutalism: boolean;
  swissStyle: boolean;
  japaneseStyle: boolean;
  chineseStyle: boolean;
  arabicStyle: boolean;
  africanStyle: boolean;
  latinStyle: boolean;
  scifiStyle: boolean;
  fantasyStyle: boolean;
  horrorStyle: boolean;
  romanticStyle: boolean;
  industrialStyle: boolean;
  organicStyle: boolean;
  geometricStyle: boolean;
  abstractStyle: boolean;
  photoRealistic: boolean;
  illustrationStyle: boolean;
  comicStyle: boolean;
  animeStyle: boolean;
  pixarStyle: boolean;
  disneyStyle: boolean;
  marvelStyle: boolean;
  dcStyle: boolean;
  starWarsStyle: boolean;
  cyberpunk2077: boolean;
  witcher: boolean;
  minecraft: boolean;
  fortnite: boolean;
  overwatch: boolean;
  leagueStyle: boolean;
  dota2Style: boolean;
  valorantStyle: boolean;
  apexStyle: boolean;
  codStyle: boolean;
  haloStyle: boolean;
  destinyStyle: boolean;
  elderScrolls: boolean;
  falloutStyle: boolean;
  massEffect: boolean;
  dragonAge: boolean;
  diablo: boolean;
  warcraftStyle: boolean;
  finalFantasy: boolean;
  pokemonStyle: boolean;
  zeldaStyle: boolean;
  marioStyle: boolean;
  sonicStyle: boolean;
  megamanStyle: boolean;
  castlevania: boolean;
  metroidStyle: boolean;
  kirbyStyle: boolean;
  splatoonStyle: boolean;
  animalCrossing: boolean;
  stardewStyle: boolean;
  terraria: boolean;
  hollowKnight: boolean;
  celeste: boolean;
  undertale: boolean;
  cuphead: boolean;
  hades: boolean;
  deathStranding: boolean;
  ghostOfTsushima: boolean;
  horizonStyle: boolean;
  godOfWar: boolean;
  spidermanStyle: boolean;
  batmanStyle: boolean;
  ironmanStyle: boolean;
  tronStyle: boolean;
  matrixStyle: boolean;
  bladeRunnerStyle: boolean;
  dune: boolean;
  interstellar: boolean;
  avengersStyle: boolean;
  guardians: boolean;
  blackPanther: boolean;
  wakanda: boolean;
  asgard: boolean;
  midgard: boolean;
  olympus: boolean;
  atlantis: boolean;
  narnia: boolean;
  middleEarth: boolean;
  hogwarts: boolean;
  pandora: boolean;
  westeros: boolean;
  essos: boolean;
  dragonstone: boolean;
  winterfell: boolean;
  kingslanding: boolean;
  braavos: boolean;
  meereen: boolean;
  dothraki: boolean;
  lannister: boolean;
  stark: boolean;
  targaryen: boolean;
  baratheon: boolean;
  tyrell: boolean;
  martell: boolean;
  greyjoy: boolean;
  tully: boolean;
  arryn: boolean;
  freefolk: boolean;
  nightsWatch: boolean;
  kingsguard: boolean;
  smallfolk: boolean;
  maesters: boolean;
  faceless: boolean;
  unsullied: boolean;
  dothraki2: boolean;
  warlocks: boolean;
  shadowbinders: boolean;
  alchemists: boolean;
  sparrows: boolean;
  brotherhood: boolean;
  stonemen: boolean;
  corsairs: boolean;
  sellswords: boolean;
  goldCloaks: boolean;
  cityWatch: boolean;
  redCloaks: boolean;
  queensguard: boolean;
  dragonguard: boolean;
  ironborn: boolean;
  crannogmen: boolean;
  mountain: boolean;
  vale: boolean;
  riverlands: boolean;
  stormlands: boolean;
  reach: boolean;
  westerlands: boolean;
  north: boolean;
  dorne: boolean;
  crownlands: boolean;
  ironIslands: boolean;
  beyond: boolean;
  essosFree: boolean;
  slaver: boolean;
  summer: boolean;
  jade: boolean;
  ulthos: boolean;
  sothoryos: boolean;
  naath: boolean;
  basilisk: boolean;
  stepstones: boolean;
  disputed: boolean;
  pentos: boolean;
  braavos2: boolean;
  lorath: boolean;
  norvos: boolean;
  qohor: boolean;
  volantis: boolean;
  lys: boolean;
  tyrosh: boolean;
  myr: boolean;
  astapor: boolean;
  yunkai: boolean;
  tolos: boolean;
  elyria: boolean;
  mantarys: boolean;
  vaes: boolean;
  valyria: boolean;
  asshai: boolean;
  ibben: boolean;
  qarth: boolean;
  ghiscar: boolean;
  old: boolean;
  new: boolean;
  free: boolean;
  slave: boolean;
  dragon: boolean;
  fire: boolean;
  ice: boolean;
  blood: boolean;
  gold: boolean;
  silver: boolean;
  bronze: boolean;
  iron: boolean;
  steel: boolean;
  obsidian: boolean;
  dragonglass: boolean;
  valyrian: boolean;
  weirwood: boolean;
  heart: boolean;
  godswood: boolean;
  sept: boolean;
  septon: boolean;
  septa: boolean;
  high: boolean;
  sparrow: boolean;
  faith: boolean;
  seven: boolean;
  old2: boolean;
  new2: boolean;
  drowned: boolean;
  lord: boolean;
  red: boolean;
  black: boolean;
  white: boolean;
  grey: boolean;
  blue: boolean;
  green: boolean;
  yellow: boolean;
  orange: boolean;
  purple: boolean;
  pink: boolean;
  brown: boolean;
  beige: boolean;
  cream: boolean;
  ivory: boolean;
  pearl: boolean;
  champagne: boolean;
  rose: boolean;
  coral: boolean;
  salmon: boolean;
  peach: boolean;
  apricot: boolean;
  amber: boolean;
  honey: boolean;
  mustard: boolean;
  olive: boolean;
  lime: boolean;
  mint: boolean;
  teal: boolean;
  turquoise: boolean;
  aqua: boolean;
  sky: boolean;
  navy: boolean;
  indigo: boolean;
  violet: boolean;
  magenta: boolean;
  fuchsia: boolean;
  crimson: boolean;
  scarlet: boolean;
  ruby: boolean;
  garnet: boolean;
  burgundy: boolean;
  maroon: boolean;
  wine: boolean;
  plum: boolean;
  eggplant: boolean;
  lavender: boolean;
  lilac: boolean;
  mauve: boolean;
  periwinkle: boolean;
  slate: boolean;
  charcoal: boolean;
  graphite: boolean;
  ash: boolean;
  smoke: boolean;
  fog: boolean;
  mist: boolean;
  cloud: boolean;
  snow: boolean;
  ice2: boolean;
  frost: boolean;
  glacier: boolean;
  arctic: boolean;
  tundra: boolean;
  taiga: boolean;
  boreal: boolean;
  temperate: boolean;
  tropical: boolean;
  subtropical: boolean;
  mediterranean: boolean;
  desert: boolean;
  savanna: boolean;
  grassland: boolean;
  wetland: boolean;
  coastal: boolean;
  marine: boolean;
  freshwater: boolean;
  alpine: boolean;
  subalpine: boolean;
  montane: boolean;
  highland: boolean;
  lowland: boolean;
  plateau: boolean;
  valley: boolean;
  canyon: boolean;
  gorge: boolean;
  ravine: boolean;
  cliff: boolean;
  mesa: boolean;
  butte: boolean;
  dune2: boolean;
  oasis: boolean;
  island: boolean;
  peninsula: boolean;
  cape: boolean;
  bay: boolean;
  gulf: boolean;
  strait: boolean;
  channel: boolean;
  fjord: boolean;
  delta: boolean;
  estuary: boolean;
  lagoon: boolean;
  atoll: boolean;
  reef: boolean;
  shoal: boolean;
  bank: boolean;
  trench: boolean;
  ridge: boolean;
  seamount: boolean;
  guyot: boolean;
  abyssal: boolean;
  hadal: boolean;
  pelagic: boolean;
  benthic: boolean;
  littoral: boolean;
  intertidal: boolean;
  subtidal: boolean;
  supratidal: boolean;
  splash: boolean;
  spray: boolean;
  wave: boolean;
  tide: boolean;
  current: boolean;
  eddy: boolean;
  gyre: boolean;
  upwelling: boolean;
  downwelling: boolean;
  thermocline: boolean;
  halocline: boolean;
  pycnocline: boolean;
  oxycline: boolean;
  nutricline: boolean;
  chlorophyll: boolean;
  bioluminescence: boolean;
  phosphorescence: boolean;
  fluorescence: boolean;
  iridescence: boolean;
  opalescence: boolean;
  nacreous: boolean;
  chatoyancy: boolean;
  asterism: boolean;
  adularescence: boolean;
  labradorescence: boolean;
  schiller: boolean;
  aventurescence: boolean;
  diaphanous: boolean;
  translucent: boolean;
  transparent: boolean;
  opaque: boolean;
  matte: boolean;
  satin: boolean;
  glossy: boolean;
  metallic: boolean;
  pearlescent: boolean;
  holographic: boolean;
  prismatic: boolean;
  dichroic: boolean;
  trichroic: boolean;
  pleochroic: boolean;
  birefringent: boolean;
  anisotropic: boolean;
  isotropic: boolean;
  amorphous: boolean;
  crystalline: boolean;
  polycrystalline: boolean;
  monocrystalline: boolean;
  epitaxial: boolean;
  heteroepitaxial: boolean;
  homoepitaxial: boolean;
  pseudomorphic: boolean;
  metamorphic: boolean;
  igneous: boolean;
  sedimentary: boolean;
  volcanic: boolean;
  plutonic: boolean;
  hypabyssal: boolean;
  intrusive: boolean;
  extrusive: boolean;
  effusive: boolean;
  explosive: boolean;
  pyroclastic: boolean;
  tephra: boolean;
  lapilli: boolean;
  pumice: boolean;
  obsidian2: boolean;
  basalt: boolean;
  granite: boolean;
  rhyolite: boolean;
  andesite: boolean;
  dacite: boolean;
  trachyte: boolean;
  phonolite: boolean;
  syenite: boolean;
  diorite: boolean;
  gabbro: boolean;
  peridotite: boolean;
  dunite: boolean;
  harzburgite: boolean;
  lherzolite: boolean;
  wehrlite: boolean;
  websterite: boolean;
  pyroxenite: boolean;
  hornblendite: boolean;
  anorthosite: boolean;
  troctolite: boolean;
  norite: boolean;
  monzonite: boolean;
  tonalite: boolean;
  granodiorite: boolean;
  quartz: boolean;
  feldspar: boolean;
  mica: boolean;
  amphibole: boolean;
  pyroxene: boolean;
  olivine: boolean;
  garnet2: boolean;
  spinel: boolean;
  corundum: boolean;
  diamond: boolean;
  graphite2: boolean;
  calcite: boolean;
  dolomite: boolean;
  aragonite: boolean;
  gypsum: boolean;
  halite: boolean;
  fluorite: boolean;
  apatite: boolean;
  magnetite: boolean;
  hematite: boolean;
  pyrite: boolean;
  chalcopyrite: boolean;
  galena: boolean;
  sphalerite: boolean;
  cinnabar: boolean;
  realgar: boolean;
  orpiment: boolean;
  stibnite: boolean;
  arsenopyrite: boolean;
  molybdenite: boolean;
  wolframite: boolean;
  cassiterite: boolean;
  columbite: boolean;
  tantalite: boolean;
  uraninite: boolean;
  thorianite: boolean;
  monazite: boolean;
  xenotime: boolean;
  zircon: boolean;
  titanite: boolean;
  rutile: boolean;
  ilmenite: boolean;
  chromite: boolean;
  spessartine: boolean;
  almandine: boolean;
  pyrope: boolean;
  grossular: boolean;
  andradite: boolean;
  uvarovite: boolean;
  rhodolite: boolean;
  tsavorite: boolean;
  demantoid: boolean;
  hessonite: boolean;
  topaz: boolean;
  tourmaline: boolean;
  beryl: boolean;
  emerald: boolean;
  aquamarine: boolean;
  morganite: boolean;
  heliodor: boolean;
  goshenite: boolean;
  bixbite: boolean;
  maxixe: boolean;
  chrysoberyl: boolean;
  alexandrite: boolean;
  cymophane: boolean;
  tanzanite: boolean;
  iolite: boolean;
  kyanite: boolean;
  sillimanite: boolean;
  andalusite: boolean;
  staurolite: boolean;
  chloritoid: boolean;
  epidote: boolean;
  zoisite: boolean;
  clinozoisite: boolean;
  piemontite: boolean;
  allanite: boolean;
  vesuvianite: boolean;
  diopside: boolean;
  enstatite: boolean;
  hypersthene: boolean;
  augite: boolean;
  aegirine: boolean;
  jadeite: boolean;
  spodumene: boolean;
  wollastonite: boolean;
  rhodonite: boolean;
  pectolite: boolean;
  tremolite: boolean;
  actinolite: boolean;
  hornblende: boolean;
  glaucophane: boolean;
  riebeckite: boolean;
  arfvedsonite: boolean;
  katophorite: boolean;
  taramite: boolean;
  pargasite: boolean;
  tschermakite: boolean;
  edenite: boolean;
  hastingsite: boolean;
  sadanagaite: boolean;
  magnesiohastingsite: boolean;
  ferropargasite: boolean;
  ferrotschermakite: boolean;
  ferroedenite: boolean;
  ferroactinolite: boolean;
  ferrotremolite: boolean;
  cummingtonite: boolean;
  grunerite: boolean;
  anthophyllite: boolean;
  gedrite: boolean;
  holmquistite: boolean;
  clinoholmquistite: boolean;
  sodic: boolean;
  calcic: boolean;
  magnesian: boolean;
  ferrous: boolean;
  ferric: boolean;
  aluminous: boolean;
  titaniferous: boolean;
  chromiferous: boolean;
  manganiferous: boolean;
  nickeliferous: boolean;
  cobaltiferous: boolean;
  zinciferous: boolean;
  cupriferous: boolean;
  argentiferous: boolean;
  auriferous: boolean;
  platiniferous: boolean;
  palladiferous: boolean;
  rhodiferous: boolean;
  iridiferous: boolean;
  osmiferous: boolean;
  rutheniferous: boolean;
  rheniferous: boolean;
  molybdiferous: boolean;
  tungsteniferous: boolean;
  vanadiferous: boolean;
  niobiferous: boolean;
  tantaliferous: boolean;
  uraniferous: boolean;
  thoriferous: boolean;
  ceriferous: boolean;
  lanthaniferous: boolean;
  yttriferous: boolean;
  scandiferous: boolean;
  lithiferous: boolean;
  berylliferous: boolean;
  boriferous: boolean;
  siliciferous: boolean;
  phosphiferous: boolean;
  sulfiferous: boolean;
  chloriferous: boolean;
  fluoriferous: boolean;
  iodiferous: boolean;
  bromiferous: boolean;
  arseniferous: boolean;
  antimoniferous: boolean;
  bismuthiferous: boolean;
  telluriferous: boolean;
  seleniferous: boolean;
  mercuriferous: boolean;
  thallous: boolean;
  plumbiferous: boolean;
  stanniferous: boolean;
  indiferous: boolean;
  gallous: boolean;
  germaniferous: boolean;
  hafniferous: boolean;
  zirconiferous: boolean;
  ytterbiferous: boolean;
  erbiferous: boolean;
  holmiferous: boolean;
  dysprosiferous: boolean;
  terbiferous: boolean;
  gadoliniferous: boolean;
  europiferous: boolean;
  samariferous: boolean;
  neodymiferous: boolean;
  praseodymiferous: boolean;
  lanthiferous: boolean;
  barium: boolean;
  strontium: boolean;
  calcium: boolean;
  magnesium: boolean;
  sodium: boolean;
  potassium: boolean;
  rubidium: boolean;
  cesium: boolean;
  francium: boolean;
  radium: boolean;
  actinium: boolean;
  thorium: boolean;
  protactinium: boolean;
  uranium: boolean;
  neptunium: boolean;
  plutonium: boolean;
  americium: boolean;
  curium: boolean;
  berkelium: boolean;
  californium: boolean;
  einsteinium: boolean;
  fermium: boolean;
  mendelevium: boolean;
  nobelium: boolean;
  lawrencium: boolean;
  rutherfordium: boolean;
  dubnium: boolean;
  seaborgium: boolean;
  bohrium: boolean;
  hassium: boolean;
  meitnerium: boolean;
  darmstadtium: boolean;
  roentgenium: boolean;
  copernicium: boolean;
  nihonium: boolean;
  flerovium: boolean;
  moscovium: boolean;
  livermorium: boolean;
  tennessine: boolean;
  oganesson: boolean;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  preview: string[];
  customization: Partial<ThemeCustomization>;
}

export const FONTS = [
  { value: "'Orbitron', sans-serif", label: 'Orbitron (Sci-Fi)' },
  { value: "'Rajdhani', sans-serif", label: 'Rajdhani (Tech)' },
  { value: "'Exo 2', sans-serif", label: 'Exo 2 (Futuristic)' },
  { value: "'Audiowide', sans-serif", label: 'Audiowide (Cyber)' },
  { value: "'Russo One', sans-serif", label: 'Russo One (Bold)' },
  { value: "'Bebas Neue', sans-serif", label: 'Bebas Neue (Display)' },
  { value: "'Righteous', sans-serif", label: 'Righteous (Pop)' },
  { value: "'Bungee', sans-serif", label: 'Bungee (Street)' },
  { value: "'Press Start 2P', monospace", label: 'Press Start 2P (Pixel)' },
  { value: "'VT323', monospace", label: 'VT323 (Retro Terminal)' },
  { value: "'Share Tech Mono', monospace", label: 'Share Tech Mono (Hacker)' },
  { value: "'Courier Prime', monospace", label: 'Courier Prime (Typewriter)' },
  { value: "'Cinzel', serif", label: 'Cinzel (Fantasy)' },
  { value: "'Playfair Display', serif", label: 'Playfair Display (Elegant)' },
  { value: "'Cormorant Garamond', serif", label: 'Cormorant (Academic)' },
  { value: "'Dancing Script', cursive", label: 'Dancing Script (Handwritten)' },
  { value: "'Pacifico', cursive", label: 'Pacifico (Retro)' },
  { value: "'Permanent Marker', cursive", label: 'Permanent Marker (Graffiti)' },
  { value: "'Bangers', cursive", label: 'Bangers (Comic)' },
  { value: "'Fredoka One', cursive", label: 'Fredoka One (Cute)' },
  { value: "'Lobster', cursive", label: 'Lobster (Vintage)' },
  { value: "'Abril Fatface', cursive", label: 'Abril Fatface (Bold Serif)' },
  { value: "'Black Han Sans', sans-serif", label: 'Black Han Sans (K-Pop)' },
  { value: "'Noto Sans JP', sans-serif", label: 'Noto Sans JP (Japanese)' },
  { value: "'Saira Condensed', sans-serif", label: 'Saira Condensed (Compact)' },
  { value: "'Chakra Petch', sans-serif", label: 'Chakra Petch (Mech)' },
  { value: "'Michroma', sans-serif", label: 'Michroma (Space)' },
  { value: "'Quantico', sans-serif", label: 'Quantico (Military)' },
  { value: "'Teko', sans-serif", label: 'Teko (Industrial)' },
  { value: "'Barlow Condensed', sans-serif", label: 'Barlow Condensed (Modern)' },
];

export const TRANSITION_EASINGS = [
  { value: 'ease', label: 'Ease' },
  { value: 'ease-in', label: 'Ease In' },
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In Out' },
  { value: 'linear', label: 'Linear' },
  { value: 'cubic-bezier(0.34, 1.56, 0.64, 1)', label: 'Spring Bounce' },
  { value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', label: 'Back Bounce' },
  { value: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', label: 'Elastic' },
  { value: 'steps(4, end)', label: 'Stepped (4)' },
  { value: 'steps(8, end)', label: 'Stepped (8)' },
];

export const BG_ANIMATION_TYPES = [
  { value: 'particles', label: 'Particles' },
  { value: 'fireworks', label: 'Fireworks' },
  { value: 'sparkles', label: 'Sparkles' },
  { value: 'sparks', label: 'Electric Sparks' },
  { value: 'matrix', label: 'Matrix Rain' },
  { value: 'stars', label: 'Starfield' },
  { value: 'bubbles', label: 'Bubbles' },
  { value: 'snow', label: 'Snow' },
  { value: 'rain', label: 'Rain' },
  { value: 'confetti', label: 'Confetti' },
  { value: 'aurora', label: 'Aurora Borealis' },
  { value: 'lava', label: 'Lava Lamp' },
  { value: 'waves', label: 'Waves' },
  { value: 'grid', label: 'Animated Grid' },
  { value: 'none', label: 'None' },
];

const defaultCustomization: ThemeCustomization = {
  primaryColor: '#7c3aed',
  accentColor: '#06b6d4',
  backgroundColor: '#0d0f14',
  cardColor: '#141720',
  foregroundColor: '#e2e8f0',
  mutedColor: '#1a1f2e',
  borderColor: '#1e2433',
  secondaryColor: '#1e2433',
  successColor: '#10b981',
  warningColor: '#f59e0b',
  errorColor: '#ef4444',
  infoColor: '#06b6d4',
  gradientStart: '#7c3aed',
  gradientMid: '#06b6d4',
  gradientEnd: '#10b981',
  gradientAngle: 135,
  fontFamily: "'Orbitron', sans-serif",
  fontSizeBase: 14,
  fontWeightNormal: 400,
  fontWeightBold: 700,
  lineHeight: 1.6,
  letterSpacing: 0,
  headingFont: "'Orbitron', sans-serif",
  monoFont: "'Share Tech Mono', monospace",
  borderRadius: 8,
  cardPadding: 16,
  sidebarWidth: 240,
  contentMaxWidth: 1200,
  spacing: 4,
  glowIntensity: 0.4,
  shadowDepth: 24,
  blur: 0,
  saturation: 100,
  brightness: 100,
  contrast: 100,
  hueRotate: 0,
  perspective: 1000,
  rotateX: 0,
  rotateY: 0,
  translateZ: 0,
  cardDepth: 4,
  animationSpeed: 1,
  transitionEasing: 'ease',
  hoverScale: 1.02,
  clickScale: 0.98,
  bgAnimationType: 'particles',
  bgParticleCount: 80,
  bgParticleSize: 2,
  bgParticleSpeed: 1,
  bgParticleColor: '#7c3aed',
  bgFireworkFrequency: 3,
  bgSparkleIntensity: 0.6,
  bgSparkColor: '#06b6d4',
  bgGlowColor: '#7c3aed',
  bgOpacity: 0.6,
  bgBlur: 0,
  borderWidth: 1,
  borderStyle: 'solid',
  borderGlow: false,
  borderGlowColor: '#7c3aed',
  borderGlowIntensity: 0.3,
  buttonStyle: 'gradient',
  buttonGlow: true,
  buttonGlowColor: '#7c3aed',
  button3D: false,
  buttonBorderRadius: 8,
  buttonPaddingX: 16,
  buttonPaddingY: 8,
  cardStyle: 'glass',
  cardGlow: false,
  cardGlowColor: '#7c3aed',
  card3D: false,
  cardHoverLift: 4,
  cardBorderRadius: 12,
  sidebarStyle: 'dark',
  sidebarGlow: false,
  sidebarBlur: 0,
  sidebarOpacity: 1,
  textGlow: false,
  textGlowColor: '#7c3aed',
  textGlowIntensity: 0.5,
  gradientText: true,
  textShadow: false,
  scrollbarWidth: 6,
  scrollbarColor: '#1e2433',
  scrollbarTrackColor: '#0d0f14',
  cursorStyle: 'default',
  selectionColor: '#7c3aed',
  focusRingColor: '#7c3aed',
  focusRingWidth: 2,
  inputStyle: 'filled',
  badgeStyle: 'rounded',
  iconStyle: 'outline',
  avatarStyle: 'circle',
  tooltipStyle: 'dark',
  popoverStyle: 'card',
  modalStyle: 'centered',
  notificationStyle: 'toast',
  codeBlockStyle: 'dark',
  tableStyle: 'striped',
  listStyle: 'disc',
  dividerStyle: 'solid',
  tagStyle: 'rounded',
  progressStyle: 'bar',
  sliderStyle: 'default',
  checkboxStyle: 'square',
  radioStyle: 'circle',
  toggleStyle: 'pill',
  dropdownStyle: 'card',
  tabStyle: 'underline',
  breadcrumbStyle: 'slash',
  paginationStyle: 'rounded',
  alertStyle: 'filled',
  bannerStyle: 'full',
  chipStyle: 'rounded',
  avatarBorderColor: '#7c3aed',
  navActiveStyle: 'highlight',
  navHoverStyle: 'background',
  linkColor: '#06b6d4',
  linkHoverColor: '#7c3aed',
  linkDecoration: 'none',
  headingGradient: false,
  subheadingColor: '#94a3b8',
  captionColor: '#64748b',
  labelColor: '#94a3b8',
  placeholderColor: '#64748b',
  disabledOpacity: 0.5,
  overlayColor: '#000000',
  overlayOpacity: 0.6,
  backdropBlur: 8,
  glassmorphism: false,
  glassmorphismOpacity: 0.1,
  neumorphism: false,
  neonGlow: false,
  neonColor: '#00ff88',
  retroStyle: false,
  cyberpunkStyle: false,
  minimalistStyle: false,
  maximalistStyle: false,
  darkMode: true,
  highContrast: false,
  colorBlindMode: 'none',
  reducedMotion: false,
  compactMode: false,
  comfortableMode: true,
  spaciousMode: false,
  roundedEverything: false,
  sharpEverything: false,
  outlineStyle: false,
  filledStyle: true,
  ghostStyle: false,
  softStyle: false,
  boldStyle: false,
  lightStyle: false,
  monochromeMode: false,
  rainbowMode: false,
  pastelMode: false,
  vibrantMode: false,
  earthToneMode: false,
  oceanMode: false,
  forestMode: false,
  sunsetMode: false,
  midnightMode: false,
  neonMode: false,
  candyMode: false,
  metalMode: false,
  woodMode: false,
  stoneMode: false,
  glassMode: false,
  holographicMode: false,
  pixelMode: false,
  skeuomorphicMode: false,
  flatMode: false,
  materialMode: false,
  fluentMode: false,
  cupertino: false,
  androidStyle: false,
  windowsStyle: false,
  linuxStyle: false,
  terminalStyle: false,
  retroTerminalStyle: false,
  vaporwaveStyle: false,
  lofiStyle: false,
  synthwaveStyle: false,
  cottagecore: false,
  darkAcademia: false,
  lightAcademia: false,
  y2kStyle: false,
  memphisStyle: false,
  bauhaus: false,
  artDeco: false,
  brutalism: false,
  swissStyle: false,
  japaneseStyle: false,
  chineseStyle: false,
  arabicStyle: false,
  africanStyle: false,
  latinStyle: false,
  scifiStyle: false,
  fantasyStyle: false,
  horrorStyle: false,
  romanticStyle: false,
  industrialStyle: false,
  organicStyle: false,
  geometricStyle: false,
  abstractStyle: false,
  photoRealistic: false,
  illustrationStyle: false,
  comicStyle: false,
  animeStyle: false,
  pixarStyle: false,
  disneyStyle: false,
  marvelStyle: false,
  dcStyle: false,
  starWarsStyle: false,
  cyberpunk2077: false,
  witcher: false,
  minecraft: false,
  fortnite: false,
  overwatch: false,
  leagueStyle: false,
  dota2Style: false,
  valorantStyle: false,
  apexStyle: false,
  codStyle: false,
  haloStyle: false,
  destinyStyle: false,
  elderScrolls: false,
  falloutStyle: false,
  massEffect: false,
  dragonAge: false,
  diablo: false,
  warcraftStyle: false,
  finalFantasy: false,
  pokemonStyle: false,
  zeldaStyle: false,
  marioStyle: false,
  sonicStyle: false,
  megamanStyle: false,
  castlevania: false,
  metroidStyle: false,
  kirbyStyle: false,
  splatoonStyle: false,
  animalCrossing: false,
  stardewStyle: false,
  terraria: false,
  hollowKnight: false,
  celeste: false,
  undertale: false,
  cuphead: false,
  hades: false,
  deathStranding: false,
  ghostOfTsushima: false,
  horizonStyle: false,
  godOfWar: false,
  spidermanStyle: false,
  batmanStyle: false,
  ironmanStyle: false,
  tronStyle: false,
  matrixStyle: false,
  bladeRunnerStyle: false,
  dune: false,
  interstellar: false,
  avengersStyle: false,
  guardians: false,
  blackPanther: false,
  wakanda: false,
  asgard: false,
  midgard: false,
  olympus: false,
  atlantis: false,
  narnia: false,
  middleEarth: false,
  hogwarts: false,
  pandora: false,
  westeros: false,
  essos: false,
  dragonstone: false,
  winterfell: false,
  kingslanding: false,
  braavos: false,
  meereen: false,
  dothraki: false,
  lannister: false,
  stark: false,
  targaryen: false,
  baratheon: false,
  tyrell: false,
  martell: false,
  greyjoy: false,
  tully: false,
  arryn: false,
  freefolk: false,
  nightsWatch: false,
  kingsguard: false,
  smallfolk: false,
  maesters: false,
  faceless: false,
  unsullied: false,
  dothraki2: false,
  warlocks: false,
  shadowbinders: false,
  alchemists: false,
  sparrows: false,
  brotherhood: false,
  stonemen: false,
  corsairs: false,
  sellswords: false,
  goldCloaks: false,
  cityWatch: false,
  redCloaks: false,
  queensguard: false,
  dragonguard: false,
  ironborn: false,
  crannogmen: false,
  mountain: false,
  vale: false,
  riverlands: false,
  stormlands: false,
  reach: false,
  westerlands: false,
  north: false,
  dorne: false,
  crownlands: false,
  ironIslands: false,
  beyond: false,
  essosFree: false,
  slaver: false,
  summer: false,
  jade: false,
  ulthos: false,
  sothoryos: false,
  naath: false,
  basilisk: false,
  stepstones: false,
  disputed: false,
  pentos: false,
  braavos2: false,
  lorath: false,
  norvos: false,
  qohor: false,
  volantis: false,
  lys: false,
  tyrosh: false,
  myr: false,
  astapor: false,
  yunkai: false,
  tolos: false,
  elyria: false,
  mantarys: false,
  vaes: false,
  valyria: false,
  asshai: false,
  ibben: false,
  qarth: false,
  ghiscar: false,
  old: false,
  new: false,
  free: false,
  slave: false,
  dragon: false,
  fire: false,
  ice: false,
  blood: false,
  gold: false,
  silver: false,
  bronze: false,
  iron: false,
  steel: false,
  obsidian: false,
  dragonglass: false,
  valyrian: false,
  weirwood: false,
  heart: false,
  godswood: false,
  sept: false,
  septon: false,
  septa: false,
  high: false,
  sparrow: false,
  faith: false,
  seven: false,
  old2: false,
  new2: false,
  drowned: false,
  lord: false,
  red: false,
  black: false,
  white: false,
  grey: false,
  blue: false,
  green: false,
  yellow: false,
  orange: false,
  purple: false,
  pink: false,
  brown: false,
  beige: false,
  cream: false,
  ivory: false,
  pearl: false,
  champagne: false,
  rose: false,
  coral: false,
  salmon: false,
  peach: false,
  apricot: false,
  amber: false,
  honey: false,
  mustard: false,
  olive: false,
  lime: false,
  mint: false,
  teal: false,
  turquoise: false,
  aqua: false,
  sky: false,
  navy: false,
  indigo: false,
  violet: false,
  magenta: false,
  fuchsia: false,
  crimson: false,
  scarlet: false,
  ruby: false,
  garnet: false,
  burgundy: false,
  maroon: false,
  wine: false,
  plum: false,
  eggplant: false,
  lavender: false,
  lilac: false,
  mauve: false,
  periwinkle: false,
  slate: false,
  charcoal: false,
  graphite: false,
  ash: false,
  smoke: false,
  fog: false,
  mist: false,
  cloud: false,
  snow: false,
  ice2: false,
  frost: false,
  glacier: false,
  arctic: false,
  tundra: false,
  taiga: false,
  boreal: false,
  temperate: false,
  tropical: false,
  subtropical: false,
  mediterranean: false,
  desert: false,
  savanna: false,
  grassland: false,
  wetland: false,
  coastal: false,
  marine: false,
  freshwater: false,
  alpine: false,
  subalpine: false,
  montane: false,
  highland: false,
  lowland: false,
  plateau: false,
  valley: false,
  canyon: false,
  gorge: false,
  ravine: false,
  cliff: false,
  mesa: false,
  butte: false,
  dune2: false,
  oasis: false,
  island: false,
  peninsula: false,
  cape: false,
  bay: false,
  gulf: false,
  strait: false,
  channel: false,
  fjord: false,
  delta: false,
  estuary: false,
  lagoon: false,
  atoll: false,
  reef: false,
  shoal: false,
  bank: false,
  trench: false,
  ridge: false,
  seamount: false,
  guyot: false,
  abyssal: false,
  hadal: false,
  pelagic: false,
  benthic: false,
  littoral: false,
  intertidal: false,
  subtidal: false,
  supratidal: false,
  splash: false,
  spray: false,
  wave: false,
  tide: false,
  current: false,
  eddy: false,
  gyre: false,
  upwelling: false,
  downwelling: false,
  thermocline: false,
  halocline: false,
  pycnocline: false,
  oxycline: false,
  nutricline: false,
  chlorophyll: false,
  bioluminescence: false,
  phosphorescence: false,
  fluorescence: false,
  iridescence: false,
  opalescence: false,
  nacreous: false,
  chatoyancy: false,
  asterism: false,
  adularescence: false,
  labradorescence: false,
  schiller: false,
  aventurescence: false,
  diaphanous: false,
  translucent: false,
  transparent: false,
  opaque: false,
  matte: false,
  satin: false,
  glossy: false,
  metallic: false,
  pearlescent: false,
  holographic: false,
  prismatic: false,
  dichroic: false,
  trichroic: false,
  pleochroic: false,
  birefringent: false,
  anisotropic: false,
  isotropic: false,
  amorphous: false,
  crystalline: false,
  polycrystalline: false,
  monocrystalline: false,
  epitaxial: false,
  heteroepitaxial: false,
  homoepitaxial: false,
  pseudomorphic: false,
  metamorphic: false,
  igneous: false,
  sedimentary: false,
  volcanic: false,
  plutonic: false,
  hypabyssal: false,
  intrusive: false,
  extrusive: false,
  effusive: false,
  explosive: false,
  pyroclastic: false,
  tephra: false,
  lapilli: false,
  pumice: false,
  obsidian2: false,
  basalt: false,
  granite: false,
  rhyolite: false,
  andesite: false,
  dacite: false,
  trachyte: false,
  phonolite: false,
  syenite: false,
  diorite: false,
  gabbro: false,
  peridotite: false,
  dunite: false,
  harzburgite: false,
  lherzolite: false,
  wehrlite: false,
  websterite: false,
  pyroxenite: false,
  hornblendite: false,
  anorthosite: false,
  troctolite: false,
  norite: false,
  monzonite: false,
  tonalite: false,
  granodiorite: false,
  quartz: false,
  feldspar: false,
  mica: false,
  amphibole: false,
  pyroxene: false,
  olivine: false,
  garnet2: false,
  spinel: false,
  corundum: false,
  diamond: false,
  graphite2: false,
  calcite: false,
  dolomite: false,
  aragonite: false,
  gypsum: false,
  halite: false,
  fluorite: false,
  apatite: false,
  magnetite: false,
  hematite: false,
  pyrite: false,
  chalcopyrite: false,
  galena: false,
  sphalerite: false,
  cinnabar: false,
  realgar: false,
  orpiment: false,
  stibnite: false,
  arsenopyrite: false,
  molybdenite: false,
  wolframite: false,
  cassiterite: false,
  columbite: false,
  tantalite: false,
  uraninite: false,
  thorianite: false,
  monazite: false,
  xenotime: false,
  zircon: false,
  titanite: false,
  rutile: false,
  ilmenite: false,
  chromite: false,
  spessartine: false,
  almandine: false,
  pyrope: false,
  grossular: false,
  andradite: false,
  uvarovite: false,
  rhodolite: false,
  tsavorite: false,
  demantoid: false,
  hessonite: false,
  topaz: false,
  tourmaline: false,
  beryl: false,
  emerald: false,
  aquamarine: false,
  morganite: false,
  heliodor: false,
  goshenite: false,
  bixbite: false,
  maxixe: false,
  chrysoberyl: false,
  alexandrite: false,
  cymophane: false,
  tanzanite: false,
  iolite: false,
  kyanite: false,
  sillimanite: false,
  andalusite: false,
  staurolite: false,
  chloritoid: false,
  epidote: false,
  zoisite: false,
  clinozoisite: false,
  piemontite: false,
  allanite: false,
  vesuvianite: false,
  diopside: false,
  enstatite: false,
  hypersthene: false,
  augite: false,
  aegirine: false,
  jadeite: false,
  spodumene: false,
  wollastonite: false,
  rhodonite: false,
  pectolite: false,
  tremolite: false,
  actinolite: false,
  hornblende: false,
  glaucophane: false,
  riebeckite: false,
  arfvedsonite: false,
  katophorite: false,
  taramite: false,
  pargasite: false,
  tschermakite: false,
  edenite: false,
  hastingsite: false,
  sadanagaite: false,
  magnesiohastingsite: false,
  ferropargasite: false,
  ferrotschermakite: false,
  ferroedenite: false,
  ferroactinolite: false,
  ferrotremolite: false,
  cummingtonite: false,
  grunerite: false,
  anthophyllite: false,
  gedrite: false,
  holmquistite: false,
  clinoholmquistite: false,
  sodic: false,
  calcic: false,
  magnesian: false,
  ferrous: false,
  ferric: false,
  aluminous: false,
  titaniferous: false,
  chromiferous: false,
  manganiferous: false,
  nickeliferous: false,
  cobaltiferous: false,
  zinciferous: false,
  cupriferous: false,
  argentiferous: false,
  auriferous: false,
  platiniferous: false,
  palladiferous: false,
  rhodiferous: false,
  iridiferous: false,
  osmiferous: false,
  rutheniferous: false,
  rheniferous: false,
  molybdiferous: false,
  tungsteniferous: false,
  vanadiferous: false,
  niobiferous: false,
  tantaliferous: false,
  uraniferous: false,
  thoriferous: false,
  ceriferous: false,
  lanthaniferous: false,
  yttriferous: false,
  scandiferous: false,
  lithiferous: false,
  berylliferous: false,
  boriferous: false,
  siliciferous: false,
  phosphiferous: false,
  sulfiferous: false,
  chloriferous: false,
  fluoriferous: false,
  iodiferous: false,
  bromiferous: false,
  arseniferous: false,
  antimoniferous: false,
  bismuthiferous: false,
  telluriferous: false,
  seleniferous: false,
  mercuriferous: false,
  thallous: false,
  plumbiferous: false,
  stanniferous: false,
  indiferous: false,
  gallous: false,
  germaniferous: false,
  hafniferous: false,
  zirconiferous: false,
  ytterbiferous: false,
  erbiferous: false,
  holmiferous: false,
  dysprosiferous: false,
  terbiferous: false,
  gadoliniferous: false,
  europiferous: false,
  samariferous: false,
  neodymiferous: false,
  praseodymiferous: false,
  lanthiferous: false,
  barium: false,
  strontium: false,
  calcium: false,
  magnesium: false,
  sodium: false,
  potassium: false,
  rubidium: false,
  cesium: false,
  francium: false,
  radium: false,
  actinium: false,
  thorium: false,
  protactinium: false,
  uranium: false,
  neptunium: false,
  plutonium: false,
  americium: false,
  curium: false,
  berkelium: false,
  californium: false,
  einsteinium: false,
  fermium: false,
  mendelevium: false,
  nobelium: false,
  lawrencium: false,
  rutherfordium: false,
  dubnium: false,
  seaborgium: false,
  bohrium: false,
  hassium: false,
  meitnerium: false,
  darmstadtium: false,
  roentgenium: false,
  copernicium: false,
  nihonium: false,
  flerovium: false,
  moscovium: false,
  livermorium: false,
  tennessine: false,
  oganesson: false,
};

export const PRESET_THEMES: Theme[] = [
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    description: 'Electric neon on dark streets — glowing cyan & magenta with 3D depth',
    preview: ['#0a0a1a', '#00ffff', '#ff00ff', '#ffff00'],
    customization: {
      primaryColor: '#00ffff',
      accentColor: '#ff00ff',
      backgroundColor: '#0a0a1a',
      cardColor: '#0f0f2a',
      foregroundColor: '#e0f0ff',
      borderColor: '#00ffff33',
      gradientStart: '#00ffff',
      gradientMid: '#ff00ff',
      gradientEnd: '#ffff00',
      fontFamily: "'Orbitron', sans-serif",
      headingFont: "'Orbitron', sans-serif",
      monoFont: "'Share Tech Mono', monospace",
      neonGlow: true,
      neonColor: '#00ffff',
      glowIntensity: 0.9,
      bgAnimationType: 'sparks',
      bgParticleColor: '#00ffff',
      bgSparkColor: '#ff00ff',
      bgGlowColor: '#00ffff',
      bgSparkleIntensity: 0.9,
      card3D: true,
      cardDepth: 8,
      button3D: true,
      borderGlow: true,
      borderGlowColor: '#00ffff',
      borderGlowIntensity: 0.8,
      textGlow: true,
      textGlowColor: '#00ffff',
      textGlowIntensity: 0.7,
      gradientText: true,
      cyberpunkStyle: true,
      neonMode: true,
      vibrantMode: true,
    },
  },
  {
    id: 'synthwave-sunset',
    name: 'Synthwave Sunset',
    description: 'Retro 80s vibes with purple grids, pink horizons, and chrome text',
    preview: ['#1a0533', '#ff6ec7', '#c724b1', '#f5a623'],
    customization: {
      primaryColor: '#c724b1',
      accentColor: '#ff6ec7',
      backgroundColor: '#1a0533',
      cardColor: '#240744',
      foregroundColor: '#ffd6f0',
      borderColor: '#c724b133',
      gradientStart: '#ff6ec7',
      gradientMid: '#c724b1',
      gradientEnd: '#f5a623',
      fontFamily: "'Righteous', sans-serif",
      headingFont: "'Bebas Neue', sans-serif",
      monoFont: "'VT323', monospace",
      bgAnimationType: 'aurora',
      bgParticleColor: '#ff6ec7',
      bgGlowColor: '#c724b1',
      glowIntensity: 0.7,
      card3D: true,
      cardDepth: 6,
      synthwaveStyle: true,
      retroStyle: true,
      neonGlow: true,
      neonColor: '#ff6ec7',
      textGlow: true,
      textGlowColor: '#ff6ec7',
      gradientText: true,
    },
  },
  {
    id: 'deep-space',
    name: 'Deep Space',
    description: 'Cosmic darkness with nebula colors, star fields, and galactic gradients',
    preview: ['#030712', '#6366f1', '#8b5cf6', '#06b6d4'],
    customization: {
      primaryColor: '#6366f1',
      accentColor: '#06b6d4',
      backgroundColor: '#030712',
      cardColor: '#0a0f1e',
      foregroundColor: '#c7d2fe',
      borderColor: '#6366f122',
      gradientStart: '#6366f1',
      gradientMid: '#8b5cf6',
      gradientEnd: '#06b6d4',
      fontFamily: "'Michroma', sans-serif",
      headingFont: "'Exo 2', sans-serif",
      monoFont: "'Share Tech Mono', monospace",
      bgAnimationType: 'stars',
      bgParticleCount: 200,
      bgParticleColor: '#ffffff',
      bgGlowColor: '#6366f1',
      bgFireworkFrequency: 2,
      glowIntensity: 0.5,
      card3D: true,
      cardDepth: 5,
      scifiStyle: true,
      gradientText: true,
      textGlow: true,
      textGlowColor: '#6366f1',
    },
  },
  {
    id: 'lava-forge',
    name: 'Lava Forge',
    description: 'Molten metal and volcanic fire — deep blacks with ember orange and crimson',
    preview: ['#0d0500', '#ff4500', '#ff8c00', '#ffd700'],
    customization: {
      primaryColor: '#ff4500',
      accentColor: '#ff8c00',
      backgroundColor: '#0d0500',
      cardColor: '#1a0800',
      foregroundColor: '#ffe4c4',
      borderColor: '#ff450033',
      gradientStart: '#ff4500',
      gradientMid: '#ff8c00',
      gradientEnd: '#ffd700',
      fontFamily: "'Russo One', sans-serif",
      headingFont: "'Bebas Neue', sans-serif",
      monoFont: "'Courier Prime', monospace",
      bgAnimationType: 'lava',
      bgParticleColor: '#ff4500',
      bgGlowColor: '#ff8c00',
      bgSparkColor: '#ffd700',
      bgSparkleIntensity: 0.8,
      glowIntensity: 0.8,
      card3D: true,
      cardDepth: 7,
      borderGlow: true,
      borderGlowColor: '#ff4500',
      industrialStyle: true,
      vibrantMode: true,
    },
  },
  {
    id: 'arctic-crystal',
    name: 'Arctic Crystal',
    description: 'Frozen tundra with ice-blue glass, crystalline borders, and frost effects',
    preview: ['#0a1628', '#7dd3fc', '#38bdf8', '#e0f2fe'],
    customization: {
      primaryColor: '#38bdf8',
      accentColor: '#7dd3fc',
      backgroundColor: '#0a1628',
      cardColor: '#0f2040',
      foregroundColor: '#e0f2fe',
      borderColor: '#38bdf833',
      gradientStart: '#7dd3fc',
      gradientMid: '#38bdf8',
      gradientEnd: '#0ea5e9',
      fontFamily: "'Exo 2', sans-serif",
      headingFont: "'Michroma', sans-serif",
      monoFont: "'Share Tech Mono', monospace",
      bgAnimationType: 'snow',
      bgParticleColor: '#e0f2fe',
      bgGlowColor: '#38bdf8',
      glowIntensity: 0.5,
      glassmorphism: true,
      glassmorphismOpacity: 0.15,
      card3D: true,
      cardDepth: 4,
      borderGlow: true,
      borderGlowColor: '#38bdf8',
      gradientText: true,
    },
  },
  {
    id: 'toxic-matrix',
    name: 'Toxic Matrix',
    description: 'Hacker green on black — matrix rain, terminal fonts, and phosphor glow',
    preview: ['#000800', '#00ff41', '#008f11', '#003b00'],
    customization: {
      primaryColor: '#00ff41',
      accentColor: '#00cc33',
      backgroundColor: '#000800',
      cardColor: '#001200',
      foregroundColor: '#00ff41',
      borderColor: '#00ff4133',
      gradientStart: '#00ff41',
      gradientMid: '#00cc33',
      gradientEnd: '#008f11',
      fontFamily: "'Share Tech Mono', monospace",
      headingFont: "'VT323', monospace",
      monoFont: "'VT323', monospace",
      bgAnimationType: 'matrix',
      bgParticleColor: '#00ff41',
      bgGlowColor: '#00ff41',
      glowIntensity: 0.9,
      neonGlow: true,
      neonColor: '#00ff41',
      textGlow: true,
      textGlowColor: '#00ff41',
      terminalStyle: true,
      matrixStyle: true,
      retroTerminalStyle: true,
    },
  },
  {
    id: 'golden-empire',
    name: 'Golden Empire',
    description: 'Royal gold and deep burgundy — luxurious 3D embossed cards with Art Deco fonts',
    preview: ['#1a0a00', '#ffd700', '#b8860b', '#8b0000'],
    customization: {
      primaryColor: '#ffd700',
      accentColor: '#b8860b',
      backgroundColor: '#1a0a00',
      cardColor: '#2a1500',
      foregroundColor: '#fff8dc',
      borderColor: '#ffd70033',
      gradientStart: '#ffd700',
      gradientMid: '#b8860b',
      gradientEnd: '#8b0000',
      fontFamily: "'Cinzel', serif",
      headingFont: "'Cinzel', serif",
      monoFont: "'Courier Prime', monospace",
      bgAnimationType: 'particles',
      bgParticleColor: '#ffd700',
      bgGlowColor: '#ffd700',
      bgSparkleIntensity: 0.7,
      glowIntensity: 0.6,
      card3D: true,
      cardDepth: 8,
      button3D: true,
      borderGlow: true,
      borderGlowColor: '#ffd700',
      artDeco: true,
      gradientText: true,
      textGlow: true,
      textGlowColor: '#ffd700',
    },
  },
  {
    id: 'vaporwave-dream',
    name: 'Vaporwave Dream',
    description: 'Pastel pink and purple with grid floors, palm trees, and retro aesthetics',
    preview: ['#1a0a2e', '#ff71ce', '#01cdfe', '#05ffa1'],
    customization: {
      primaryColor: '#ff71ce',
      accentColor: '#01cdfe',
      backgroundColor: '#1a0a2e',
      cardColor: '#2a1040',
      foregroundColor: '#ffe4f0',
      borderColor: '#ff71ce33',
      gradientStart: '#ff71ce',
      gradientMid: '#01cdfe',
      gradientEnd: '#05ffa1',
      fontFamily: "'Pacifico', cursive",
      headingFont: "'Righteous', sans-serif",
      monoFont: "'VT323', monospace",
      bgAnimationType: 'aurora',
      bgParticleColor: '#ff71ce',
      bgGlowColor: '#01cdfe',
      glowIntensity: 0.6,
      vaporwaveStyle: true,
      retroStyle: true,
      pastelMode: true,
      gradientText: true,
      card3D: true,
      cardDepth: 5,
    },
  },
  {
    id: 'blood-moon',
    name: 'Blood Moon',
    description: 'Dark crimson horror with dripping red accents, gothic fonts, and eerie glow',
    preview: ['#0d0000', '#8b0000', '#dc143c', '#ff4444'],
    customization: {
      primaryColor: '#dc143c',
      accentColor: '#8b0000',
      backgroundColor: '#0d0000',
      cardColor: '#1a0000',
      foregroundColor: '#ffe4e4',
      borderColor: '#dc143c33',
      gradientStart: '#dc143c',
      gradientMid: '#8b0000',
      gradientEnd: '#ff4444',
      fontFamily: "'Cinzel', serif",
      headingFont: "'Cinzel', serif",
      monoFont: "'Courier Prime', monospace",
      bgAnimationType: 'particles',
      bgParticleColor: '#dc143c',
      bgGlowColor: '#8b0000',
      bgSparkleIntensity: 0.5,
      glowIntensity: 0.7,
      card3D: true,
      cardDepth: 6,
      borderGlow: true,
      borderGlowColor: '#dc143c',
      horrorStyle: true,
      textGlow: true,
      textGlowColor: '#dc143c',
      gradientText: true,
    },
  },
  {
    id: 'ocean-abyss',
    name: 'Ocean Abyss',
    description: 'Deep sea bioluminescence — dark teal with glowing aqua particles and wave motion',
    preview: ['#000d1a', '#00b4d8', '#0077b6', '#90e0ef'],
    customization: {
      primaryColor: '#00b4d8',
      accentColor: '#90e0ef',
      backgroundColor: '#000d1a',
      cardColor: '#001a2e',
      foregroundColor: '#caf0f8',
      borderColor: '#00b4d833',
      gradientStart: '#00b4d8',
      gradientMid: '#0077b6',
      gradientEnd: '#90e0ef',
      fontFamily: "'Exo 2', sans-serif",
      headingFont: "'Rajdhani', sans-serif",
      monoFont: "'Share Tech Mono', monospace",
      bgAnimationType: 'bubbles',
      bgParticleColor: '#00b4d8',
      bgGlowColor: '#0077b6',
      bgSparkleIntensity: 0.6,
      glowIntensity: 0.5,
      glassmorphism: true,
      glassmorphismOpacity: 0.1,
      card3D: true,
      cardDepth: 4,
      oceanMode: true,
      gradientText: true,
    },
  },
  {
    id: 'forest-spirit',
    name: 'Forest Spirit',
    description: 'Ancient woodland magic — deep greens with golden fireflies and organic textures',
    preview: ['#0a1a0a', '#22c55e', '#16a34a', '#fbbf24'],
    customization: {
      primaryColor: '#22c55e',
      accentColor: '#fbbf24',
      backgroundColor: '#0a1a0a',
      cardColor: '#0f2a0f',
      foregroundColor: '#dcfce7',
      borderColor: '#22c55e33',
      gradientStart: '#22c55e',
      gradientMid: '#16a34a',
      gradientEnd: '#fbbf24',
      fontFamily: "'Cormorant Garamond', serif",
      headingFont: "'Cinzel', serif",
      monoFont: "'Courier Prime', monospace",
      bgAnimationType: 'sparkles',
      bgParticleColor: '#fbbf24',
      bgGlowColor: '#22c55e',
      bgSparkleIntensity: 0.7,
      glowIntensity: 0.4,
      card3D: true,
      cardDepth: 4,
      forestMode: true,
      organicStyle: true,
      fantasyStyle: true,
      gradientText: true,
    },
  },
  {
    id: 'chrome-future',
    name: 'Chrome Future',
    description: 'Polished chrome and steel — metallic gradients with holographic reflections',
    preview: ['#0a0a0a', '#c0c0c0', '#808080', '#e8e8e8'],
    customization: {
      primaryColor: '#c0c0c0',
      accentColor: '#e8e8e8',
      backgroundColor: '#0a0a0a',
      cardColor: '#141414',
      foregroundColor: '#f0f0f0',
      borderColor: '#c0c0c033',
      gradientStart: '#c0c0c0',
      gradientMid: '#808080',
      gradientEnd: '#e8e8e8',
      fontFamily: "'Rajdhani', sans-serif",
      headingFont: "'Audiowide', sans-serif",
      monoFont: "'Share Tech Mono', monospace",
      bgAnimationType: 'particles',
      bgParticleColor: '#c0c0c0',
      bgGlowColor: '#808080',
      glowIntensity: 0.3,
      metalMode: true,
      holographicMode: true,
      card3D: true,
      cardDepth: 6,
      button3D: true,
      gradientText: true,
    },
  },
  {
    id: 'candy-pop',
    name: 'Candy Pop',
    description: 'Bubblegum explosion — bright candy colors with 3D pop-art style and confetti',
    preview: ['#fff0f5', '#ff69b4', '#ff1493', '#00bfff'],
    customization: {
      primaryColor: '#ff69b4',
      accentColor: '#00bfff',
      backgroundColor: '#fff0f5',
      cardColor: '#ffffff',
      foregroundColor: '#1a1a2e',
      borderColor: '#ff69b433',
      gradientStart: '#ff69b4',
      gradientMid: '#ff1493',
      gradientEnd: '#00bfff',
      fontFamily: "'Fredoka One', cursive",
      headingFont: "'Bangers', cursive",
      monoFont: "'Courier Prime', monospace",
      bgAnimationType: 'confetti',
      bgParticleColor: '#ff69b4',
      bgGlowColor: '#ff1493',
      bgSparkleIntensity: 0.9,
      glowIntensity: 0.4,
      card3D: true,
      cardDepth: 8,
      button3D: true,
      candyMode: true,
      pastelMode: true,
      gradientText: true,
      darkMode: false,
    },
  },
  {
    id: 'pixel-retro',
    name: 'Pixel Retro',
    description: '8-bit nostalgia — pixel fonts, chunky borders, and classic arcade colors',
    preview: ['#1a1a2e', '#e94560', '#0f3460', '#16213e'],
    customization: {
      primaryColor: '#e94560',
      accentColor: '#0f3460',
      backgroundColor: '#1a1a2e',
      cardColor: '#16213e',
      foregroundColor: '#e0e0e0',
      borderColor: '#e9456033',
      gradientStart: '#e94560',
      gradientMid: '#0f3460',
      gradientEnd: '#533483',
      fontFamily: "'Press Start 2P', monospace",
      headingFont: "'Press Start 2P', monospace",
      monoFont: "'VT323', monospace",
      bgAnimationType: 'grid',
      bgParticleColor: '#e94560',
      bgGlowColor: '#0f3460',
      glowIntensity: 0.5,
      pixelMode: true,
      retroStyle: true,
      card3D: false,
      borderRadius: 0,
      buttonBorderRadius: 0,
      cardBorderRadius: 0,
      sharpEverything: true,
    },
  },
  {
    id: 'holographic-prism',
    name: 'Holographic Prism',
    description: 'Rainbow holographic foil — shifting prismatic colors with iridescent glow',
    preview: ['#0a0a1a', '#ff0080', '#00ff80', '#8000ff'],
    customization: {
      primaryColor: '#ff0080',
      accentColor: '#00ff80',
      backgroundColor: '#0a0a1a',
      cardColor: '#0f0f2a',
      foregroundColor: '#f0f0ff',
      borderColor: '#ff008033',
      gradientStart: '#ff0080',
      gradientMid: '#00ff80',
      gradientEnd: '#8000ff',
      fontFamily: "'Exo 2', sans-serif",
      headingFont: "'Audiowide', sans-serif",
      monoFont: "'Share Tech Mono', monospace",
      bgAnimationType: 'fireworks',
      bgParticleColor: '#ff0080',
      bgGlowColor: '#00ff80',
      bgFireworkFrequency: 5,
      bgSparkleIntensity: 1.0,
      glowIntensity: 0.8,
      holographicMode: true,
      card3D: true,
      cardDepth: 6,
      borderGlow: true,
      borderGlowColor: '#ff0080',
      gradientText: true,
      rainbowMode: true,
    },
  },
  {
    id: 'dark-academia',
    name: 'Dark Academia',
    description: 'Gothic scholarly aesthetic — aged parchment, ink, and candlelight warmth',
    preview: ['#1a1209', '#8b7355', '#d4a853', '#2c1810'],
    customization: {
      primaryColor: '#d4a853',
      accentColor: '#8b7355',
      backgroundColor: '#1a1209',
      cardColor: '#2c1810',
      foregroundColor: '#f5e6c8',
      borderColor: '#d4a85333',
      gradientStart: '#d4a853',
      gradientMid: '#8b7355',
      gradientEnd: '#5c3d2e',
      fontFamily: "'Cormorant Garamond', serif",
      headingFont: "'Playfair Display', serif",
      monoFont: "'Courier Prime', monospace",
      bgAnimationType: 'particles',
      bgParticleColor: '#d4a853',
      bgGlowColor: '#8b7355',
      bgSparkleIntensity: 0.3,
      glowIntensity: 0.3,
      card3D: true,
      cardDepth: 3,
      darkAcademia: true,
      gradientText: true,
    },
  },
  {
    id: 'electric-storm',
    name: 'Electric Storm',
    description: 'Thunderstorm energy — electric blue lightning with dark clouds and plasma arcs',
    preview: ['#050a1a', '#4fc3f7', '#0288d1', '#ffffff'],
    customization: {
      primaryColor: '#4fc3f7',
      accentColor: '#0288d1',
      backgroundColor: '#050a1a',
      cardColor: '#0a1428',
      foregroundColor: '#e1f5fe',
      borderColor: '#4fc3f733',
      gradientStart: '#4fc3f7',
      gradientMid: '#0288d1',
      gradientEnd: '#ffffff',
      fontFamily: "'Chakra Petch', sans-serif",
      headingFont: "'Audiowide', sans-serif",
      monoFont: "'Share Tech Mono', monospace",
      bgAnimationType: 'sparks',
      bgParticleColor: '#4fc3f7',
      bgGlowColor: '#0288d1',
      bgSparkColor: '#ffffff',
      bgSparkleIntensity: 0.9,
      bgFireworkFrequency: 4,
      glowIntensity: 0.8,
      card3D: true,
      cardDepth: 5,
      borderGlow: true,
      borderGlowColor: '#4fc3f7',
      neonGlow: true,
      neonColor: '#4fc3f7',
      textGlow: true,
      textGlowColor: '#4fc3f7',
      gradientText: true,
    },
  },
  {
    id: 'sakura-bloom',
    name: 'Sakura Bloom',
    description: 'Japanese cherry blossom — soft pinks with ink brush strokes and zen minimalism',
    preview: ['#1a0a14', '#ffb7c5', '#ff85a1', '#c9184a'],
    customization: {
      primaryColor: '#ff85a1',
      accentColor: '#ffb7c5',
      backgroundColor: '#1a0a14',
      cardColor: '#2a1020',
      foregroundColor: '#ffe4ec',
      borderColor: '#ff85a133',
      gradientStart: '#ffb7c5',
      gradientMid: '#ff85a1',
      gradientEnd: '#c9184a',
      fontFamily: "'Noto Sans JP', sans-serif",
      headingFont: "'Cormorant Garamond', serif",
      monoFont: "'Courier Prime', monospace",
      bgAnimationType: 'sparkles',
      bgParticleColor: '#ffb7c5',
      bgGlowColor: '#ff85a1',
      bgSparkleIntensity: 0.6,
      glowIntensity: 0.4,
      card3D: true,
      cardDepth: 3,
      japaneseStyle: true,
      romanticStyle: true,
      gradientText: true,
    },
  },
  {
    id: 'obsidian-blade',
    name: 'Obsidian Blade',
    description: 'Ultra-dark with razor-sharp silver edges — stealth assassin aesthetic',
    preview: ['#050505', '#1a1a1a', '#c0c0c0', '#ff3333'],
    customization: {
      primaryColor: '#c0c0c0',
      accentColor: '#ff3333',
      backgroundColor: '#050505',
      cardColor: '#0a0a0a',
      foregroundColor: '#e0e0e0',
      borderColor: '#c0c0c033',
      gradientStart: '#c0c0c0',
      gradientMid: '#808080',
      gradientEnd: '#ff3333',
      fontFamily: "'Quantico', sans-serif",
      headingFont: "'Russo One', sans-serif",
      monoFont: "'Share Tech Mono', monospace",
      bgAnimationType: 'particles',
      bgParticleColor: '#c0c0c0',
      bgGlowColor: '#ff3333',
      bgSparkleIntensity: 0.4,
      glowIntensity: 0.3,
      card3D: true,
      cardDepth: 4,
      borderGlow: true,
      borderGlowColor: '#c0c0c0',
      metalMode: true,
      minimalistStyle: true,
      gradientText: true,
    },
  },
  {
    id: 'cosmic-carnival',
    name: 'Cosmic Carnival',
    description: 'Galactic festival — multicolor fireworks, star bursts, and celebration energy',
    preview: ['#0a0520', '#ff6b6b', '#ffd93d', '#6bcb77'],
    customization: {
      primaryColor: '#ff6b6b',
      accentColor: '#ffd93d',
      backgroundColor: '#0a0520',
      cardColor: '#150a30',
      foregroundColor: '#fff9e6',
      borderColor: '#ff6b6b33',
      gradientStart: '#ff6b6b',
      gradientMid: '#ffd93d',
      gradientEnd: '#6bcb77',
      fontFamily: "'Bungee', sans-serif",
      headingFont: "'Bangers', cursive",
      monoFont: "'Courier Prime', monospace",
      bgAnimationType: 'fireworks',
      bgParticleColor: '#ff6b6b',
      bgGlowColor: '#ffd93d',
      bgFireworkFrequency: 6,
      bgSparkleIntensity: 1.0,
      bgSparkColor: '#6bcb77',
      glowIntensity: 0.7,
      card3D: true,
      cardDepth: 7,
      button3D: true,
      borderGlow: true,
      borderGlowColor: '#ffd93d',
      rainbowMode: true,
      vibrantMode: true,
      gradientText: true,
      textGlow: true,
      textGlowColor: '#ffd93d',
    },
  },
];

export interface ThemeContextValue {
  activeTheme: Theme;
  customization: ThemeCustomization;
  setActiveTheme: (theme: Theme) => void;
  updateCustomization: (updates: Partial<ThemeCustomization>) => void;
  resetToTheme: (themeId: string) => void;
  resetToDefault: () => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [activeTheme, setActiveThemeState] = useState<Theme>(PRESET_THEMES[0]);
  const [customization, setCustomization] = useState<ThemeCustomization>({
    ...defaultCustomization,
    ...PRESET_THEMES[0].customization,
  });
  const [userId, setUserId] = useState<string | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Derive per-user storage key
  const storageKey = userId ? `codepilot-theme-${userId}` : 'codepilot-theme';

  // Resolve current user ID from Supabase session
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user?.id ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load theme when userId resolves (or on first mount for guests)
  useEffect(() => {
    const key = userId ? `codepilot-theme-${userId}` : 'codepilot-theme';
    const saved = localStorage.getItem(key);
    // Also try the generic key as fallback for existing users
    const fallback = !saved && userId ? localStorage.getItem('codepilot-theme') : null;
    const raw = saved || fallback;
    if (raw) {
      try {
        const { themeId, customization: savedCustom } = JSON.parse(raw);
        const theme = PRESET_THEMES.find((t) => t.id === themeId) || PRESET_THEMES[0];
        setActiveThemeState(theme);
        setCustomization({ ...defaultCustomization, ...theme.customization, ...savedCustom });
      } catch {
        // ignore
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Persist theme on change (debounced to avoid excessive writes)
  useEffect(() => {
    applyTheme(customization);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ themeId: activeTheme.id, customization })
      );
    }, 300);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customization, activeTheme.id, storageKey]);

  const applyTheme = useCallback((c: ThemeCustomization) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', c.primaryColor);
    root.style.setProperty('--accent', c.accentColor);
    root.style.setProperty('--background', c.backgroundColor);
    root.style.setProperty('--card', c.cardColor);
    root.style.setProperty('--foreground', c.foregroundColor);
    root.style.setProperty('--muted', c.mutedColor);
    root.style.setProperty('--border', c.borderColor);
    root.style.setProperty('--secondary', c.secondaryColor);
    root.style.setProperty('--green', c.successColor);
    root.style.setProperty('--amber', c.warningColor);
    root.style.setProperty('--red', c.errorColor);
    root.style.setProperty('--cyan', c.infoColor);
    root.style.setProperty('--radius', `${c.borderRadius}px`);
    root.style.setProperty('--font-sans', c.fontFamily);
    root.style.setProperty('--font-mono', c.monoFont);
    root.style.setProperty('--theme-primary', c.primaryColor);
    root.style.setProperty('--theme-accent', c.accentColor);
    root.style.setProperty('--theme-glow', `rgba(${hexToRgb(c.primaryColor)}, ${c.glowIntensity})`);
    root.style.setProperty('--theme-gradient', `linear-gradient(${c.gradientAngle}deg, ${c.gradientStart}, ${c.gradientMid}, ${c.gradientEnd})`);
    root.style.setProperty('--theme-font', c.fontFamily);
    root.style.setProperty('--theme-heading-font', c.headingFont);
    root.style.setProperty('--theme-border-radius', `${c.borderRadius}px`);
    root.style.setProperty('--theme-shadow', `0 ${c.shadowDepth / 4}px ${c.shadowDepth}px rgba(0,0,0,0.5)`);
    root.style.setProperty('--theme-card-depth', `${c.cardDepth}px`);
    root.style.setProperty('--theme-animation-speed', `${c.animationSpeed}`);
    root.style.setProperty('--theme-hover-scale', `${c.hoverScale}`);
    root.style.setProperty('--theme-click-scale', `${c.clickScale}`);
    root.style.setProperty('--theme-neon-color', c.neonColor);
    root.style.setProperty('--theme-text-glow', c.textGlow ? `0 0 ${c.textGlowIntensity * 20}px ${c.textGlowColor}` : 'none');
    root.style.setProperty('--theme-border-glow', c.borderGlow ? `0 0 ${c.borderGlowIntensity * 20}px ${c.borderGlowColor}` : 'none');
    root.style.setProperty('--theme-card-glow', c.cardGlow ? `0 0 ${c.glowIntensity * 30}px ${c.cardGlowColor || c.primaryColor}` : 'none');
    root.style.setProperty('--theme-selection', c.selectionColor);
    root.style.setProperty('--theme-link', c.linkColor);
    root.style.setProperty('--theme-link-hover', c.linkHoverColor);
    root.style.setProperty('--theme-scrollbar', c.scrollbarColor);
    root.style.setProperty('--theme-scrollbar-track', c.scrollbarTrackColor);
    root.style.setProperty('--theme-scrollbar-width', `${c.scrollbarWidth}px`);
    root.style.setProperty('--theme-focus-ring', c.focusRingColor);
    root.style.setProperty('--theme-focus-ring-width', `${c.focusRingWidth}px`);
    root.style.setProperty('--theme-disabled-opacity', `${c.disabledOpacity}`);
    root.style.setProperty('--theme-overlay', c.overlayColor);
    root.style.setProperty('--theme-overlay-opacity', `${c.overlayOpacity}`);
    root.style.setProperty('--theme-backdrop-blur', `${c.backdropBlur}px`);
    root.style.setProperty('--theme-glass-opacity', `${c.glassmorphismOpacity}`);
    root.style.setProperty('--theme-perspective', `${c.perspective}px`);
    root.style.setProperty('--theme-font-size', `${c.fontSizeBase}px`);
    root.style.setProperty('--theme-line-height', `${c.lineHeight}`);
    root.style.setProperty('--theme-letter-spacing', `${c.letterSpacing}em`);
    root.style.setProperty('--theme-font-weight', `${c.fontWeightNormal}`);
    root.style.setProperty('--theme-font-weight-bold', `${c.fontWeightBold}`);
    root.style.setProperty('--theme-spacing', `${c.spacing}px`);
    root.style.setProperty('--theme-card-padding', `${c.cardPadding}px`);
    root.style.setProperty('--theme-sidebar-width', `${c.sidebarWidth}px`);
    root.style.setProperty('--theme-content-max-width', `${c.contentMaxWidth}px`);
    root.style.setProperty('--theme-border-width', `${c.borderWidth}px`);
    root.style.setProperty('--theme-blur', `${c.blur}px`);
    root.style.setProperty('--theme-saturation', `${c.saturation}%`);
    root.style.setProperty('--theme-brightness', `${c.brightness}%`);
    root.style.setProperty('--theme-contrast', `${c.contrast}%`);
    root.style.setProperty('--theme-hue-rotate', `${c.hueRotate}deg`);
    root.style.setProperty('--theme-button-radius', `${c.buttonBorderRadius}px`);
    root.style.setProperty('--theme-button-px', `${c.buttonPaddingX}px`);
    root.style.setProperty('--theme-button-py', `${c.buttonPaddingY}px`);
    root.style.setProperty('--theme-card-radius', `${c.cardBorderRadius}px`);
    root.style.setProperty('--theme-card-hover-lift', `${c.cardHoverLift}px`);
    root.style.setProperty('--theme-sidebar-blur', `${c.sidebarBlur}px`);
    root.style.setProperty('--theme-sidebar-opacity', `${c.sidebarOpacity}`);
    root.style.setProperty('--theme-subheading', c.subheadingColor);
    root.style.setProperty('--theme-caption', c.captionColor);
    root.style.setProperty('--theme-label', c.labelColor);
    root.style.setProperty('--theme-placeholder', c.placeholderColor);
    root.style.setProperty('--theme-gradient-start', c.gradientStart);
    root.style.setProperty('--theme-gradient-mid', c.gradientMid);
    root.style.setProperty('--theme-gradient-end', c.gradientEnd);
    root.style.setProperty('--theme-gradient-angle', `${c.gradientAngle}deg`);
    root.style.setProperty('--theme-button-glow', c.buttonGlow ? `0 0 16px ${c.buttonGlowColor || c.primaryColor}` : 'none');
    root.style.setProperty('--theme-transition-easing', c.transitionEasing);
    root.style.setProperty('--theme-shadow-depth', `${c.shadowDepth}px`);
    root.style.setProperty('--theme-translate-z', `${c.translateZ}px`);
    root.style.setProperty('--theme-rotate-x', `${c.rotateX}deg`);
    root.style.setProperty('--theme-rotate-y', `${c.rotateY}deg`);
    root.style.setProperty('--theme-avatar-border', c.avatarBorderColor);
    root.style.setProperty('--theme-selection-bg', `${c.selectionColor}33`);
    root.style.setProperty('--theme-neon-glow', c.neonGlow ? `0 0 10px ${c.neonColor}, 0 0 20px ${c.neonColor}, 0 0 40px ${c.neonColor}` : 'none');
    root.style.setProperty('--theme-text-shadow', c.textShadow ? `2px 2px 4px rgba(0,0,0,0.8)` : 'none');
    root.style.setProperty('--theme-bg-glow', c.bgGlowColor);
    root.style.setProperty('--theme-bg-particle', c.bgParticleColor);
    root.style.setProperty('--theme-bg-spark', c.bgSparkColor);
    root.style.setProperty('--theme-bg-opacity', `${c.bgOpacity}`);
    root.style.setProperty('--theme-bg-blur', `${c.bgBlur}px`);
  }, []);

  const setActiveTheme = useCallback((theme: Theme) => {
    setActiveThemeState(theme);
    setCustomization({ ...defaultCustomization, ...theme.customization });
  }, []);

  const updateCustomization = useCallback((updates: Partial<ThemeCustomization>) => {
    setCustomization((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetToTheme = useCallback((themeId: string) => {
    const theme = PRESET_THEMES.find((t) => t.id === themeId) || PRESET_THEMES[0];
    setActiveThemeState(theme);
    setCustomization({ ...defaultCustomization, ...theme.customization });
  }, []);

  const resetToDefault = useCallback(() => {
    setActiveThemeState(PRESET_THEMES[0]);
    setCustomization({ ...defaultCustomization, ...PRESET_THEMES[0].customization });
  }, []);

  return (
    <ThemeContext.Provider
      value={{ activeTheme, customization, setActiveTheme, updateCustomization, resetToTheme, resetToDefault, themes: PRESET_THEMES }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '124, 58, 237';
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}
