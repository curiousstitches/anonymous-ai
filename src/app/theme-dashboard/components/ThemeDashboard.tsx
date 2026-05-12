'use client';

import React, { useState, useCallback } from 'react';
import { useTheme, FONTS, TRANSITION_EASINGS, BG_ANIMATION_TYPES, Theme, ThemeCustomization } from '@/contexts/ThemeContext';
import AppLayout from '@/components/AppLayout';

type TabId = 'themes' | 'colors' | 'typography' | 'layout' | 'effects' | 'background' | 'components' | 'advanced';

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'themes', label: 'Themes', icon: '🎨' },
  { id: 'colors', label: 'Colors', icon: '🌈' },
  { id: 'typography', label: 'Typography', icon: '✍️' },
  { id: 'layout', label: 'Layout', icon: '📐' },
  { id: 'effects', label: 'Effects', icon: '✨' },
  { id: 'background', label: 'Background', icon: '🌌' },
  { id: 'components', label: 'Components', icon: '🧩' },
  { id: 'advanced', label: 'Advanced', icon: '⚙️' },
];

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  description?: string;
}
function ColorPicker({ label, value, onChange, description }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>{label}</label>
      {description && <p className="text-xs" style={{ color: 'var(--muted-foreground)', opacity: 0.7 }}>{description}</p>}
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-8 rounded cursor-pointer border-0 p-0"
          style={{ background: 'transparent' }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2 py-1 rounded text-xs font-mono"
          style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
        />
      </div>
    </div>
  );
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
  description?: string;
}
function Slider({ label, value, min, max, step = 1, unit = '', onChange, description }: SliderProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>{label}</label>
        <span className="text-xs font-mono" style={{ color: 'var(--foreground)' }}>{value}{unit}</span>
      </div>
      {description && <p className="text-xs" style={{ color: 'var(--muted-foreground)', opacity: 0.7 }}>{description}</p>}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: 'var(--primary)' }}
      />
    </div>
  );
}

interface SelectProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  description?: string;
}
function Select({ label, value, options, onChange, description }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>{label}</label>
      {description && <p className="text-xs" style={{ color: 'var(--muted-foreground)', opacity: 0.7 }}>{description}</p>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-2 py-1.5 rounded text-xs"
        style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

interface ToggleProps {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  description?: string;
}
function Toggle({ label, value, onChange, description }: ToggleProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{label}</span>
        {description && <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{description}</span>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className="relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors"
        style={{ background: value ? 'var(--primary)' : 'var(--border)' }}
      >
        <span
          className="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform"
          style={{ transform: value ? 'translateX(19px)' : 'translateX(2px)' }}
        />
      </button>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{title}</h3>
      {subtitle && <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{subtitle}</p>}
    </div>
  );
}

function OptionGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-xl overflow-hidden mb-3" style={{ border: '1px solid var(--border)' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        style={{ background: 'var(--card)' }}
      >
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{title}</span>
        <span style={{ color: 'var(--muted-foreground)', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms' }}>▾</span>
      </button>
      {open && (
        <div className="px-4 py-4 grid grid-cols-1 gap-4" style={{ background: 'var(--muted)', borderTop: '1px solid var(--border)' }}>
          {children}
        </div>
      )}
    </div>
  );
}

export default function ThemeDashboard() {
  const { activeTheme, customization, setActiveTheme, updateCustomization, resetToTheme, resetToDefault, themes } = useTheme();
  const [activeTab, setActiveTab] = useState<TabId>('themes');
  const [searchTheme, setSearchTheme] = useState('');
  const [copied, setCopied] = useState(false);

  const u = useCallback((updates: Partial<ThemeCustomization>) => updateCustomization(updates), [updateCustomization]);

  const exportTheme = () => {
    const data = JSON.stringify({ themeId: activeTheme.id, customization }, null, 2);
    navigator.clipboard.writeText(data).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const filteredThemes = themes.filter((t) =>
    t.name.toLowerCase().includes(searchTheme.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTheme.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="flex h-full overflow-hidden" style={{ fontFamily: 'var(--font-sans)' }}>
        {/* Tab sidebar */}
        <div
          className="flex flex-col w-14 md:w-48 flex-shrink-0 border-r overflow-y-auto"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div className="px-3 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 className="hidden md:block text-sm font-bold" style={{ color: 'var(--foreground)' }}>Theme Studio</h2>
            <p className="hidden md:block text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Customize everything</p>
          </div>
          <nav className="flex flex-col gap-0.5 p-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-2 py-2.5 rounded-lg text-left transition-all"
                style={{
                  background: activeTab === tab.id ? 'rgba(124,58,237,0.15)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--primary)' : 'var(--muted-foreground)',
                  borderLeft: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
                }}
              >
                <span className="text-base">{tab.icon}</span>
                <span className="hidden md:block text-xs font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-auto p-2 border-t space-y-1" style={{ borderColor: 'var(--border)' }}>
            <button
              type="button"
              onClick={exportTheme}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs transition-all"
              style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}
            >
              <span>📋</span>
              <span className="hidden md:block">{copied ? 'Copied!' : 'Export'}</span>
            </button>
            <button
              type="button"
              onClick={resetToDefault}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs transition-all"
              style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}
            >
              <span>↺</span>
              <span className="hidden md:block">Reset</span>
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Active theme indicator */}
          <div
            className="flex items-center gap-3 p-3 rounded-xl mb-6"
            style={{
              background: `linear-gradient(135deg, ${customization.gradientStart}22, ${customization.gradientEnd}22)`,
              border: `1px solid ${customization.primaryColor}33`,
            }}
          >
            <div className="flex gap-1">
              {activeTheme.preview.map((c, i) => (
                <div key={i} className="w-5 h-5 rounded-full" style={{ background: c }} />
              ))}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate" style={{ color: 'var(--foreground)' }}>{activeTheme.name}</p>
              <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{activeTheme.description}</p>
            </div>
            <button
              type="button"
              onClick={() => resetToTheme(activeTheme.id)}
              className="text-xs px-3 py-1.5 rounded-lg"
              style={{ background: 'var(--primary)', color: 'white' }}
            >
              Reset Theme
            </button>
          </div>

          {/* THEMES TAB */}
          {activeTab === 'themes' && (
            <div>
              <SectionHeader title="Choose a Theme" subtitle="20 high-detail 3D pop-style themes" />
              <input
                type="text"
                placeholder="Search themes..."
                value={searchTheme}
                onChange={(e) => setSearchTheme(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm mb-4"
                style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredThemes.map((theme) => (
                  <ThemeCard
                    key={theme.id}
                    theme={theme}
                    active={activeTheme.id === theme.id}
                    onSelect={() => setActiveTheme(theme)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* COLORS TAB */}
          {activeTab === 'colors' && (
            <div>
              <SectionHeader title="Color Palette" subtitle="Fine-tune every color in the interface" />
              <OptionGroup title="Primary Colors">
                <ColorPicker label="Primary" value={customization.primaryColor} onChange={(v) => u({ primaryColor: v })} description="Main brand color" />
                <ColorPicker label="Accent" value={customization.accentColor} onChange={(v) => u({ accentColor: v })} description="Secondary highlight color" />
                <ColorPicker label="Secondary" value={customization.secondaryColor} onChange={(v) => u({ secondaryColor: v })} />
              </OptionGroup>
              <OptionGroup title="Background & Surface">
                <ColorPicker label="Background" value={customization.backgroundColor} onChange={(v) => u({ backgroundColor: v })} />
                <ColorPicker label="Card" value={customization.cardColor} onChange={(v) => u({ cardColor: v })} />
                <ColorPicker label="Muted" value={customization.mutedColor} onChange={(v) => u({ mutedColor: v })} />
                <ColorPicker label="Border" value={customization.borderColor} onChange={(v) => u({ borderColor: v })} />
              </OptionGroup>
              <OptionGroup title="Text Colors">
                <ColorPicker label="Foreground" value={customization.foregroundColor} onChange={(v) => u({ foregroundColor: v })} />
                <ColorPicker label="Subheading" value={customization.subheadingColor} onChange={(v) => u({ subheadingColor: v })} />
                <ColorPicker label="Caption" value={customization.captionColor} onChange={(v) => u({ captionColor: v })} />
                <ColorPicker label="Label" value={customization.labelColor} onChange={(v) => u({ labelColor: v })} />
                <ColorPicker label="Placeholder" value={customization.placeholderColor} onChange={(v) => u({ placeholderColor: v })} />
              </OptionGroup>
              <OptionGroup title="Status Colors">
                <ColorPicker label="Success" value={customization.successColor} onChange={(v) => u({ successColor: v })} />
                <ColorPicker label="Warning" value={customization.warningColor} onChange={(v) => u({ warningColor: v })} />
                <ColorPicker label="Error" value={customization.errorColor} onChange={(v) => u({ errorColor: v })} />
                <ColorPicker label="Info" value={customization.infoColor} onChange={(v) => u({ infoColor: v })} />
              </OptionGroup>
              <OptionGroup title="Gradient">
                <ColorPicker label="Gradient Start" value={customization.gradientStart} onChange={(v) => u({ gradientStart: v })} />
                <ColorPicker label="Gradient Mid" value={customization.gradientMid} onChange={(v) => u({ gradientMid: v })} />
                <ColorPicker label="Gradient End" value={customization.gradientEnd} onChange={(v) => u({ gradientEnd: v })} />
                <Slider label="Gradient Angle" value={customization.gradientAngle} min={0} max={360} unit="°" onChange={(v) => u({ gradientAngle: v })} />
              </OptionGroup>
              <OptionGroup title="Interactive Colors">
                <ColorPicker label="Link Color" value={customization.linkColor} onChange={(v) => u({ linkColor: v })} />
                <ColorPicker label="Link Hover" value={customization.linkHoverColor} onChange={(v) => u({ linkHoverColor: v })} />
                <ColorPicker label="Selection" value={customization.selectionColor} onChange={(v) => u({ selectionColor: v })} />
                <ColorPicker label="Focus Ring" value={customization.focusRingColor} onChange={(v) => u({ focusRingColor: v })} />
                <ColorPicker label="Avatar Border" value={customization.avatarBorderColor} onChange={(v) => u({ avatarBorderColor: v })} />
              </OptionGroup>
              <OptionGroup title="Overlay & Backdrop">
                <ColorPicker label="Overlay Color" value={customization.overlayColor} onChange={(v) => u({ overlayColor: v })} />
                <Slider label="Overlay Opacity" value={customization.overlayOpacity} min={0} max={1} step={0.05} onChange={(v) => u({ overlayOpacity: v })} />
              </OptionGroup>
            </div>
          )}

          {/* TYPOGRAPHY TAB */}
          {activeTab === 'typography' && (
            <div>
              <SectionHeader title="Typography" subtitle="Fonts, sizes, weights, and text styling" />
              <OptionGroup title="Font Families">
                <Select label="Body Font" value={customization.fontFamily} options={FONTS} onChange={(v) => u({ fontFamily: v })} description="Used for all body text" />
                <Select label="Heading Font" value={customization.headingFont} options={FONTS} onChange={(v) => u({ headingFont: v })} description="Used for headings and titles" />
                <Select label="Mono Font" value={customization.monoFont} options={FONTS} onChange={(v) => u({ monoFont: v })} description="Used for code and monospace text" />
              </OptionGroup>
              <OptionGroup title="Font Sizes & Spacing">
                <Slider label="Base Font Size" value={customization.fontSizeBase} min={10} max={20} unit="px" onChange={(v) => u({ fontSizeBase: v })} />
                <Slider label="Line Height" value={customization.lineHeight} min={1} max={2.5} step={0.05} onChange={(v) => u({ lineHeight: v })} />
                <Slider label="Letter Spacing" value={customization.letterSpacing} min={-0.1} max={0.3} step={0.01} unit="em" onChange={(v) => u({ letterSpacing: v })} />
              </OptionGroup>
              <OptionGroup title="Font Weights">
                <Slider label="Normal Weight" value={customization.fontWeightNormal} min={100} max={900} step={100} onChange={(v) => u({ fontWeightNormal: v })} />
                <Slider label="Bold Weight" value={customization.fontWeightBold} min={400} max={900} step={100} onChange={(v) => u({ fontWeightBold: v })} />
              </OptionGroup>
              <OptionGroup title="Text Effects">
                <Toggle label="Gradient Text" value={customization.gradientText} onChange={(v) => u({ gradientText: v })} description="Apply gradient to headings" />
                <Toggle label="Heading Gradient" value={customization.headingGradient} onChange={(v) => u({ headingGradient: v })} description="Gradient on all headings" />
                <Toggle label="Text Glow" value={customization.textGlow} onChange={(v) => u({ textGlow: v })} description="Glowing text effect" />
                <ColorPicker label="Text Glow Color" value={customization.textGlowColor} onChange={(v) => u({ textGlowColor: v })} />
                <Slider label="Text Glow Intensity" value={customization.textGlowIntensity} min={0} max={1} step={0.05} onChange={(v) => u({ textGlowIntensity: v })} />
                <Toggle label="Text Shadow" value={customization.textShadow} onChange={(v) => u({ textShadow: v })} description="Drop shadow on text" />
              </OptionGroup>
              <OptionGroup title="Link Styles">
                <Select
                  label="Link Decoration"
                  value={customization.linkDecoration}
                  options={[
                    { value: 'none', label: 'None' },
                    { value: 'underline', label: 'Underline' },
                    { value: 'dotted underline', label: 'Dotted Underline' },
                    { value: 'dashed underline', label: 'Dashed Underline' },
                    { value: 'wavy underline', label: 'Wavy Underline' },
                  ]}
                  onChange={(v) => u({ linkDecoration: v })}
                />
              </OptionGroup>
            </div>
          )}

          {/* LAYOUT TAB */}
          {activeTab === 'layout' && (
            <div>
              <SectionHeader title="Layout & Spacing" subtitle="Control the structure and spacing of the interface" />
              <OptionGroup title="Border Radius">
                <Slider label="Global Border Radius" value={customization.borderRadius} min={0} max={32} unit="px" onChange={(v) => u({ borderRadius: v })} />
                <Slider label="Button Border Radius" value={customization.buttonBorderRadius} min={0} max={32} unit="px" onChange={(v) => u({ buttonBorderRadius: v })} />
                <Slider label="Card Border Radius" value={customization.cardBorderRadius} min={0} max={32} unit="px" onChange={(v) => u({ cardBorderRadius: v })} />
                <Toggle label="Round Everything" value={customization.roundedEverything} onChange={(v) => u({ roundedEverything: v })} />
                <Toggle label="Sharp Everything" value={customization.sharpEverything} onChange={(v) => u({ sharpEverything: v })} />
              </OptionGroup>
              <OptionGroup title="Spacing">
                <Slider label="Base Spacing Unit" value={customization.spacing} min={2} max={8} unit="px" onChange={(v) => u({ spacing: v })} />
                <Slider label="Card Padding" value={customization.cardPadding} min={8} max={40} unit="px" onChange={(v) => u({ cardPadding: v })} />
                <Slider label="Button Padding X" value={customization.buttonPaddingX} min={8} max={40} unit="px" onChange={(v) => u({ buttonPaddingX: v })} />
                <Slider label="Button Padding Y" value={customization.buttonPaddingY} min={4} max={20} unit="px" onChange={(v) => u({ buttonPaddingY: v })} />
              </OptionGroup>
              <OptionGroup title="Dimensions">
                <Slider label="Sidebar Width" value={customization.sidebarWidth} min={160} max={320} unit="px" onChange={(v) => u({ sidebarWidth: v })} />
                <Slider label="Content Max Width" value={customization.contentMaxWidth} min={800} max={1600} unit="px" onChange={(v) => u({ contentMaxWidth: v })} />
              </OptionGroup>
              <OptionGroup title="Borders">
                <Slider label="Border Width" value={customization.borderWidth} min={0} max={4} unit="px" onChange={(v) => u({ borderWidth: v })} />
                <Select
                  label="Border Style"
                  value={customization.borderStyle}
                  options={[
                    { value: 'solid', label: 'Solid' },
                    { value: 'dashed', label: 'Dashed' },
                    { value: 'dotted', label: 'Dotted' },
                    { value: 'double', label: 'Double' },
                    { value: 'groove', label: 'Groove' },
                    { value: 'ridge', label: 'Ridge' },
                  ]}
                  onChange={(v) => u({ borderStyle: v })}
                />
                <Toggle label="Border Glow" value={customization.borderGlow} onChange={(v) => u({ borderGlow: v })} />
                <ColorPicker label="Border Glow Color" value={customization.borderGlowColor} onChange={(v) => u({ borderGlowColor: v })} />
                <Slider label="Border Glow Intensity" value={customization.borderGlowIntensity} min={0} max={1} step={0.05} onChange={(v) => u({ borderGlowIntensity: v })} />
              </OptionGroup>
              <OptionGroup title="Density">
                <Toggle label="Compact Mode" value={customization.compactMode} onChange={(v) => u({ compactMode: v })} description="Tighter spacing" />
                <Toggle label="Comfortable Mode" value={customization.comfortableMode} onChange={(v) => u({ comfortableMode: v })} description="Default spacing" />
                <Toggle label="Spacious Mode" value={customization.spaciousMode} onChange={(v) => u({ spaciousMode: v })} description="Extra breathing room" />
              </OptionGroup>
              <OptionGroup title="Scrollbar">
                <Slider label="Scrollbar Width" value={customization.scrollbarWidth} min={2} max={16} unit="px" onChange={(v) => u({ scrollbarWidth: v })} />
                <ColorPicker label="Scrollbar Color" value={customization.scrollbarColor} onChange={(v) => u({ scrollbarColor: v })} />
                <ColorPicker label="Scrollbar Track" value={customization.scrollbarTrackColor} onChange={(v) => u({ scrollbarTrackColor: v })} />
              </OptionGroup>
            </div>
          )}

          {/* EFFECTS TAB */}
          {activeTab === 'effects' && (
            <div>
              <SectionHeader title="Visual Effects" subtitle="3D transforms, glow, glass, and more" />
              <OptionGroup title="Glow Effects">
                <Slider label="Glow Intensity" value={customization.glowIntensity} min={0} max={1} step={0.05} onChange={(v) => u({ glowIntensity: v })} />
                <Toggle label="Neon Glow" value={customization.neonGlow} onChange={(v) => u({ neonGlow: v })} description="Neon tube glow effect" />
                <ColorPicker label="Neon Color" value={customization.neonColor} onChange={(v) => u({ neonColor: v })} />
                <Toggle label="Card Glow" value={customization.cardGlow} onChange={(v) => u({ cardGlow: v })} />
                <ColorPicker label="Card Glow Color" value={customization.cardGlowColor || customization.primaryColor} onChange={(v) => u({ cardGlowColor: v })} />
                <Toggle label="Button Glow" value={customization.buttonGlow} onChange={(v) => u({ buttonGlow: v })} />
                <ColorPicker label="Button Glow Color" value={customization.buttonGlowColor || customization.primaryColor} onChange={(v) => u({ buttonGlowColor: v })} />
              </OptionGroup>
              <OptionGroup title="3D Effects">
                <Toggle label="Card 3D" value={customization.card3D} onChange={(v) => u({ card3D: v })} description="3D depth on cards" />
                <Slider label="Card Depth" value={customization.cardDepth} min={0} max={20} unit="px" onChange={(v) => u({ cardDepth: v })} />
                <Slider label="Card Hover Lift" value={customization.cardHoverLift} min={0} max={20} unit="px" onChange={(v) => u({ cardHoverLift: v })} />
                <Toggle label="Button 3D" value={customization.button3D} onChange={(v) => u({ button3D: v })} description="3D press effect on buttons" />
                <Slider label="Perspective" value={customization.perspective} min={200} max={2000} unit="px" onChange={(v) => u({ perspective: v })} />
                <Slider label="Rotate X" value={customization.rotateX} min={-20} max={20} unit="°" onChange={(v) => u({ rotateX: v })} />
                <Slider label="Rotate Y" value={customization.rotateY} min={-20} max={20} unit="°" onChange={(v) => u({ rotateY: v })} />
                <Slider label="Translate Z" value={customization.translateZ} min={-50} max={50} unit="px" onChange={(v) => u({ translateZ: v })} />
              </OptionGroup>
              <OptionGroup title="Glass & Blur">
                <Toggle label="Glassmorphism" value={customization.glassmorphism} onChange={(v) => u({ glassmorphism: v })} description="Frosted glass effect" />
                <Slider label="Glass Opacity" value={customization.glassmorphismOpacity} min={0} max={0.5} step={0.01} onChange={(v) => u({ glassmorphismOpacity: v })} />
                <Slider label="Backdrop Blur" value={customization.backdropBlur} min={0} max={40} unit="px" onChange={(v) => u({ backdropBlur: v })} />
                <Slider label="Content Blur" value={customization.blur} min={0} max={10} unit="px" onChange={(v) => u({ blur: v })} />
                <Slider label="Sidebar Blur" value={customization.sidebarBlur} min={0} max={40} unit="px" onChange={(v) => u({ sidebarBlur: v })} />
                <Slider label="Sidebar Opacity" value={customization.sidebarOpacity} min={0.3} max={1} step={0.05} onChange={(v) => u({ sidebarOpacity: v })} />
              </OptionGroup>
              <OptionGroup title="Shadows">
                <Slider label="Shadow Depth" value={customization.shadowDepth} min={0} max={60} unit="px" onChange={(v) => u({ shadowDepth: v })} />
              </OptionGroup>
              <OptionGroup title="CSS Filters">
                <Slider label="Saturation" value={customization.saturation} min={0} max={200} unit="%" onChange={(v) => u({ saturation: v })} />
                <Slider label="Brightness" value={customization.brightness} min={50} max={150} unit="%" onChange={(v) => u({ brightness: v })} />
                <Slider label="Contrast" value={customization.contrast} min={50} max={200} unit="%" onChange={(v) => u({ contrast: v })} />
                <Slider label="Hue Rotate" value={customization.hueRotate} min={0} max={360} unit="°" onChange={(v) => u({ hueRotate: v })} />
              </OptionGroup>
              <OptionGroup title="Animations">
                <Slider label="Animation Speed" value={customization.animationSpeed} min={0.1} max={3} step={0.1} unit="x" onChange={(v) => u({ animationSpeed: v })} />
                <Select label="Transition Easing" value={customization.transitionEasing} options={TRANSITION_EASINGS} onChange={(v) => u({ transitionEasing: v })} />
                <Slider label="Hover Scale" value={customization.hoverScale} min={1} max={1.2} step={0.01} onChange={(v) => u({ hoverScale: v })} />
                <Slider label="Click Scale" value={customization.clickScale} min={0.85} max={1} step={0.01} onChange={(v) => u({ clickScale: v })} />
                <Toggle label="Reduced Motion" value={customization.reducedMotion} onChange={(v) => u({ reducedMotion: v })} description="Disable all animations" />
              </OptionGroup>
              <OptionGroup title="Special Styles">
                <Toggle label="Neumorphism" value={customization.neumorphism} onChange={(v) => u({ neumorphism: v })} description="Soft UI emboss effect" />
                <Toggle label="Holographic" value={customization.holographicMode} onChange={(v) => u({ holographicMode: v })} description="Holographic foil effect" />
                <Toggle label="Pixel Mode" value={customization.pixelMode} onChange={(v) => u({ pixelMode: v })} description="8-bit pixel aesthetic" />
                <Toggle label="Retro Style" value={customization.retroStyle} onChange={(v) => u({ retroStyle: v })} />
                <Toggle label="Cyberpunk" value={customization.cyberpunkStyle} onChange={(v) => u({ cyberpunkStyle: v })} />
                <Toggle label="Vaporwave" value={customization.vaporwaveStyle} onChange={(v) => u({ vaporwaveStyle: v })} />
                <Toggle label="Synthwave" value={customization.synthwaveStyle} onChange={(v) => u({ synthwaveStyle: v })} />
                <Toggle label="Matrix Style" value={customization.matrixStyle} onChange={(v) => u({ matrixStyle: v })} />
                <Toggle label="Neon Mode" value={customization.neonMode} onChange={(v) => u({ neonMode: v })} />
                <Toggle label="Minimalist" value={customization.minimalistStyle} onChange={(v) => u({ minimalistStyle: v })} />
                <Toggle label="Brutalism" value={customization.brutalism} onChange={(v) => u({ brutalism: v })} />
                <Toggle label="Art Deco" value={customization.artDeco} onChange={(v) => u({ artDeco: v })} />
                <Toggle label="Bauhaus" value={customization.bauhaus} onChange={(v) => u({ bauhaus: v })} />
                <Toggle label="Memphis Style" value={customization.memphisStyle} onChange={(v) => u({ memphisStyle: v })} />
                <Toggle label="Y2K Style" value={customization.y2kStyle} onChange={(v) => u({ y2kStyle: v })} />
                <Toggle label="Skeuomorphic" value={customization.skeuomorphicMode} onChange={(v) => u({ skeuomorphicMode: v })} />
                <Toggle label="Flat Design" value={customization.flatMode} onChange={(v) => u({ flatMode: v })} />
                <Toggle label="Material Design" value={customization.materialMode} onChange={(v) => u({ materialMode: v })} />
                <Toggle label="Fluent Design" value={customization.fluentMode} onChange={(v) => u({ fluentMode: v })} />
              </OptionGroup>
            </div>
          )}

          {/* BACKGROUND TAB */}
          {activeTab === 'background' && (
            <div>
              <SectionHeader title="Animated Background" subtitle="Motion effects, particles, fireworks, and more" />
              <OptionGroup title="Animation Type">
                <Select label="Animation Type" value={customization.bgAnimationType} options={BG_ANIMATION_TYPES} onChange={(v) => u({ bgAnimationType: v })} description="Choose the background animation style" />
                <Slider label="Background Opacity" value={customization.bgOpacity} min={0} max={1} step={0.05} onChange={(v) => u({ bgOpacity: v })} />
                <Slider label="Background Blur" value={customization.bgBlur} min={0} max={20} unit="px" onChange={(v) => u({ bgBlur: v })} />
              </OptionGroup>
              <OptionGroup title="Particles">
                <Slider label="Particle Count" value={customization.bgParticleCount} min={10} max={300} onChange={(v) => u({ bgParticleCount: v })} description="More particles = heavier performance" />
                <Slider label="Particle Size" value={customization.bgParticleSize} min={0.5} max={10} step={0.5} unit="px" onChange={(v) => u({ bgParticleSize: v })} />
                <Slider label="Particle Speed" value={customization.bgParticleSpeed} min={0.1} max={5} step={0.1} unit="x" onChange={(v) => u({ bgParticleSpeed: v })} />
                <ColorPicker label="Particle Color" value={customization.bgParticleColor} onChange={(v) => u({ bgParticleColor: v })} />
              </OptionGroup>
              <OptionGroup title="Fireworks">
                <Slider label="Firework Frequency" value={customization.bgFireworkFrequency} min={0.5} max={10} step={0.5} onChange={(v) => u({ bgFireworkFrequency: v })} description="Fireworks per second" />
              </OptionGroup>
              <OptionGroup title="Sparkles & Sparks">
                <Slider label="Sparkle Intensity" value={customization.bgSparkleIntensity} min={0} max={1} step={0.05} onChange={(v) => u({ bgSparkleIntensity: v })} />
                <ColorPicker label="Spark Color" value={customization.bgSparkColor} onChange={(v) => u({ bgSparkColor: v })} />
              </OptionGroup>
              <OptionGroup title="Glow">
                <ColorPicker label="Background Glow Color" value={customization.bgGlowColor} onChange={(v) => u({ bgGlowColor: v })} />
              </OptionGroup>
            </div>
          )}

          {/* COMPONENTS TAB */}
          {activeTab === 'components' && (
            <div>
              <SectionHeader title="Component Styles" subtitle="Customize individual UI components" />
              <OptionGroup title="Buttons">
                <Select
                  label="Button Style"
                  value={customization.buttonStyle}
                  options={[
                    { value: 'gradient', label: 'Gradient' },
                    { value: 'solid', label: 'Solid' },
                    { value: 'outline', label: 'Outline' },
                    { value: 'ghost', label: 'Ghost' },
                    { value: 'soft', label: 'Soft' },
                    { value: 'neon', label: 'Neon' },
                    { value: 'glass', label: 'Glass' },
                    { value: 'metallic', label: 'Metallic' },
                  ]}
                  onChange={(v) => u({ buttonStyle: v })}
                />
              </OptionGroup>
              <OptionGroup title="Cards">
                <Select
                  label="Card Style"
                  value={customization.cardStyle}
                  options={[
                    { value: 'glass', label: 'Glass' },
                    { value: 'solid', label: 'Solid' },
                    { value: 'outline', label: 'Outline' },
                    { value: 'flat', label: 'Flat' },
                    { value: 'elevated', label: 'Elevated' },
                    { value: 'neon', label: 'Neon Border' },
                    { value: 'gradient', label: 'Gradient Border' },
                    { value: 'neumorphic', label: 'Neumorphic' },
                  ]}
                  onChange={(v) => u({ cardStyle: v })}
                />
              </OptionGroup>
              <OptionGroup title="Inputs">
                <Select
                  label="Input Style"
                  value={customization.inputStyle}
                  options={[
                    { value: 'filled', label: 'Filled' },
                    { value: 'outline', label: 'Outline' },
                    { value: 'underline', label: 'Underline' },
                    { value: 'ghost', label: 'Ghost' },
                    { value: 'glass', label: 'Glass' },
                  ]}
                  onChange={(v) => u({ inputStyle: v })}
                />
                <Slider label="Focus Ring Width" value={customization.focusRingWidth} min={0} max={6} unit="px" onChange={(v) => u({ focusRingWidth: v })} />
              </OptionGroup>
              <OptionGroup title="Navigation">
                <Select
                  label="Nav Active Style"
                  value={customization.navActiveStyle}
                  options={[
                    { value: 'highlight', label: 'Highlight' },
                    { value: 'underline', label: 'Underline' },
                    { value: 'pill', label: 'Pill' },
                    { value: 'border-left', label: 'Left Border' },
                    { value: 'glow', label: 'Glow' },
                    { value: 'gradient', label: 'Gradient' },
                  ]}
                  onChange={(v) => u({ navActiveStyle: v })}
                />
                <Select
                  label="Nav Hover Style"
                  value={customization.navHoverStyle}
                  options={[
                    { value: 'background', label: 'Background' },
                    { value: 'underline', label: 'Underline' },
                    { value: 'scale', label: 'Scale' },
                    { value: 'glow', label: 'Glow' },
                    { value: 'color', label: 'Color Change' },
                  ]}
                  onChange={(v) => u({ navHoverStyle: v })}
                />
              </OptionGroup>
              <OptionGroup title="Badges & Tags">
                <Select
                  label="Badge Style"
                  value={customization.badgeStyle}
                  options={[
                    { value: 'rounded', label: 'Rounded' },
                    { value: 'square', label: 'Square' },
                    { value: 'pill', label: 'Pill' },
                    { value: 'dot', label: 'Dot' },
                    { value: 'outline', label: 'Outline' },
                  ]}
                  onChange={(v) => u({ badgeStyle: v })}
                />
                <Select
                  label="Tag Style"
                  value={customization.tagStyle}
                  options={[
                    { value: 'rounded', label: 'Rounded' },
                    { value: 'square', label: 'Square' },
                    { value: 'pill', label: 'Pill' },
                    { value: 'outline', label: 'Outline' },
                    { value: 'soft', label: 'Soft' },
                  ]}
                  onChange={(v) => u({ tagStyle: v })}
                />
              </OptionGroup>
              <OptionGroup title="Forms">
                <Select
                  label="Checkbox Style"
                  value={customization.checkboxStyle}
                  options={[
                    { value: 'square', label: 'Square' },
                    { value: 'rounded', label: 'Rounded' },
                    { value: 'circle', label: 'Circle' },
                    { value: 'toggle', label: 'Toggle' },
                  ]}
                  onChange={(v) => u({ checkboxStyle: v })}
                />
                <Select
                  label="Toggle Style"
                  value={customization.toggleStyle}
                  options={[
                    { value: 'pill', label: 'Pill' },
                    { value: 'square', label: 'Square' },
                    { value: 'ios', label: 'iOS Style' },
                    { value: 'android', label: 'Android Style' },
                  ]}
                  onChange={(v) => u({ toggleStyle: v })}
                />
              </OptionGroup>
              <OptionGroup title="Tables & Lists">
                <Select
                  label="Table Style"
                  value={customization.tableStyle}
                  options={[
                    { value: 'striped', label: 'Striped' },
                    { value: 'bordered', label: 'Bordered' },
                    { value: 'minimal', label: 'Minimal' },
                    { value: 'card', label: 'Card' },
                    { value: 'compact', label: 'Compact' },
                  ]}
                  onChange={(v) => u({ tableStyle: v })}
                />
              </OptionGroup>
              <OptionGroup title="Code Blocks">
                <Select
                  label="Code Block Style"
                  value={customization.codeBlockStyle}
                  options={[
                    { value: 'dark', label: 'Dark' },
                    { value: 'light', label: 'Light' },
                    { value: 'terminal', label: 'Terminal' },
                    { value: 'neon', label: 'Neon' },
                    { value: 'matrix', label: 'Matrix' },
                    { value: 'retro', label: 'Retro' },
                  ]}
                  onChange={(v) => u({ codeBlockStyle: v })}
                />
              </OptionGroup>
              <OptionGroup title="Modals & Overlays">
                <Select
                  label="Modal Style"
                  value={customization.modalStyle}
                  options={[
                    { value: 'centered', label: 'Centered' },
                    { value: 'slide-up', label: 'Slide Up' },
                    { value: 'slide-right', label: 'Slide Right' },
                    { value: 'fullscreen', label: 'Fullscreen' },
                    { value: 'glass', label: 'Glass' },
                  ]}
                  onChange={(v) => u({ modalStyle: v })}
                />
                <Slider label="Disabled Opacity" value={customization.disabledOpacity} min={0.1} max={0.9} step={0.05} onChange={(v) => u({ disabledOpacity: v })} />
              </OptionGroup>
            </div>
          )}

          {/* ADVANCED TAB */}
          {activeTab === 'advanced' && (
            <div>
              <SectionHeader title="Advanced Settings" subtitle="Accessibility, color modes, and special features" />
              <OptionGroup title="Accessibility">
                <Toggle label="High Contrast" value={customization.highContrast} onChange={(v) => u({ highContrast: v })} description="Increase contrast for readability" />
                <Toggle label="Reduced Motion" value={customization.reducedMotion} onChange={(v) => u({ reducedMotion: v })} description="Disable animations" />
                <Select
                  label="Color Blind Mode"
                  value={customization.colorBlindMode}
                  options={[
                    { value: 'none', label: 'None' },
                    { value: 'protanopia', label: 'Protanopia (Red-Blind)' },
                    { value: 'deuteranopia', label: 'Deuteranopia (Green-Blind)' },
                    { value: 'tritanopia', label: 'Tritanopia (Blue-Blind)' },
                    { value: 'achromatopsia', label: 'Achromatopsia (Monochrome)' },
                  ]}
                  onChange={(v) => u({ colorBlindMode: v })}
                />
              </OptionGroup>
              <OptionGroup title="Color Modes">
                <Toggle label="Monochrome Mode" value={customization.monochromeMode} onChange={(v) => u({ monochromeMode: v })} />
                <Toggle label="Rainbow Mode" value={customization.rainbowMode} onChange={(v) => u({ rainbowMode: v })} />
                <Toggle label="Pastel Mode" value={customization.pastelMode} onChange={(v) => u({ pastelMode: v })} />
                <Toggle label="Vibrant Mode" value={customization.vibrantMode} onChange={(v) => u({ vibrantMode: v })} />
                <Toggle label="Earth Tones" value={customization.earthToneMode} onChange={(v) => u({ earthToneMode: v })} />
                <Toggle label="Ocean Mode" value={customization.oceanMode} onChange={(v) => u({ oceanMode: v })} />
                <Toggle label="Forest Mode" value={customization.forestMode} onChange={(v) => u({ forestMode: v })} />
                <Toggle label="Sunset Mode" value={customization.sunsetMode} onChange={(v) => u({ sunsetMode: v })} />
                <Toggle label="Midnight Mode" value={customization.midnightMode} onChange={(v) => u({ midnightMode: v })} />
                <Toggle label="Candy Mode" value={customization.candyMode} onChange={(v) => u({ candyMode: v })} />
                <Toggle label="Metal Mode" value={customization.metalMode} onChange={(v) => u({ metalMode: v })} />
                <Toggle label="Glass Mode" value={customization.glassMode} onChange={(v) => u({ glassMode: v })} />
              </OptionGroup>
              <OptionGroup title="Cultural & Aesthetic Styles">
                <Toggle label="Japanese Style" value={customization.japaneseStyle} onChange={(v) => u({ japaneseStyle: v })} />
                <Toggle label="Chinese Style" value={customization.chineseStyle} onChange={(v) => u({ chineseStyle: v })} />
                <Toggle label="Arabic Style" value={customization.arabicStyle} onChange={(v) => u({ arabicStyle: v })} />
                <Toggle label="African Style" value={customization.africanStyle} onChange={(v) => u({ africanStyle: v })} />
                <Toggle label="Latin Style" value={customization.latinStyle} onChange={(v) => u({ latinStyle: v })} />
                <Toggle label="Dark Academia" value={customization.darkAcademia} onChange={(v) => u({ darkAcademia: v })} />
                <Toggle label="Light Academia" value={customization.lightAcademia} onChange={(v) => u({ lightAcademia: v })} />
                <Toggle label="Cottagecore" value={customization.cottagecore} onChange={(v) => u({ cottagecore: v })} />
                <Toggle label="Lo-Fi" value={customization.lofiStyle} onChange={(v) => u({ lofiStyle: v })} />
                <Toggle label="Swiss Style" value={customization.swissStyle} onChange={(v) => u({ swissStyle: v })} />
              </OptionGroup>
              <OptionGroup title="Genre Styles">
                <Toggle label="Sci-Fi" value={customization.scifiStyle} onChange={(v) => u({ scifiStyle: v })} />
                <Toggle label="Fantasy" value={customization.fantasyStyle} onChange={(v) => u({ fantasyStyle: v })} />
                <Toggle label="Horror" value={customization.horrorStyle} onChange={(v) => u({ horrorStyle: v })} />
                <Toggle label="Romantic" value={customization.romanticStyle} onChange={(v) => u({ romanticStyle: v })} />
                <Toggle label="Industrial" value={customization.industrialStyle} onChange={(v) => u({ industrialStyle: v })} />
                <Toggle label="Organic" value={customization.organicStyle} onChange={(v) => u({ organicStyle: v })} />
                <Toggle label="Geometric" value={customization.geometricStyle} onChange={(v) => u({ geometricStyle: v })} />
                <Toggle label="Abstract" value={customization.abstractStyle} onChange={(v) => u({ abstractStyle: v })} />
                <Toggle label="Comic Style" value={customization.comicStyle} onChange={(v) => u({ comicStyle: v })} />
                <Toggle label="Anime Style" value={customization.animeStyle} onChange={(v) => u({ animeStyle: v })} />
              </OptionGroup>
              <OptionGroup title="Game Styles">
                <Toggle label="Cyberpunk 2077" value={customization.cyberpunk2077} onChange={(v) => u({ cyberpunk2077: v })} />
                <Toggle label="Minecraft" value={customization.minecraft} onChange={(v) => u({ minecraft: v })} />
                <Toggle label="Fortnite" value={customization.fortnite} onChange={(v) => u({ fortnite: v })} />
                <Toggle label="Valorant" value={customization.valorantStyle} onChange={(v) => u({ valorantStyle: v })} />
                <Toggle label="Apex Legends" value={customization.apexStyle} onChange={(v) => u({ apexStyle: v })} />
                <Toggle label="Halo" value={customization.haloStyle} onChange={(v) => u({ haloStyle: v })} />
                <Toggle label="Final Fantasy" value={customization.finalFantasy} onChange={(v) => u({ finalFantasy: v })} />
                <Toggle label="Pokémon" value={customization.pokemonStyle} onChange={(v) => u({ pokemonStyle: v })} />
                <Toggle label="Zelda" value={customization.zeldaStyle} onChange={(v) => u({ zeldaStyle: v })} />
                <Toggle label="Mario" value={customization.marioStyle} onChange={(v) => u({ marioStyle: v })} />
                <Toggle label="Hollow Knight" value={customization.hollowKnight} onChange={(v) => u({ hollowKnight: v })} />
                <Toggle label="Hades" value={customization.hades} onChange={(v) => u({ hades: v })} />
                <Toggle label="Cuphead" value={customization.cuphead} onChange={(v) => u({ cuphead: v })} />
                <Toggle label="Undertale" value={customization.undertale} onChange={(v) => u({ undertale: v })} />
                <Toggle label="Celeste" value={customization.celeste} onChange={(v) => u({ celeste: v })} />
              </OptionGroup>
              <OptionGroup title="Movie & TV Styles">
                <Toggle label="Tron" value={customization.tronStyle} onChange={(v) => u({ tronStyle: v })} />
                <Toggle label="Matrix" value={customization.matrixStyle} onChange={(v) => u({ matrixStyle: v })} />
                <Toggle label="Blade Runner" value={customization.bladeRunnerStyle} onChange={(v) => u({ bladeRunnerStyle: v })} />
                <Toggle label="Dune" value={customization.dune} onChange={(v) => u({ dune: v })} />
                <Toggle label="Interstellar" value={customization.interstellar} onChange={(v) => u({ interstellar: v })} />
                <Toggle label="Avengers" value={customization.avengersStyle} onChange={(v) => u({ avengersStyle: v })} />
                <Toggle label="Star Wars" value={customization.starWarsStyle} onChange={(v) => u({ starWarsStyle: v })} />
                <Toggle label="Iron Man" value={customization.ironmanStyle} onChange={(v) => u({ ironmanStyle: v })} />
                <Toggle label="Batman" value={customization.batmanStyle} onChange={(v) => u({ batmanStyle: v })} />
                <Toggle label="Spider-Man" value={customization.spidermanStyle} onChange={(v) => u({ spidermanStyle: v })} />
                <Toggle label="Black Panther" value={customization.blackPanther} onChange={(v) => u({ blackPanther: v })} />
                <Toggle label="Guardians" value={customization.guardians} onChange={(v) => u({ guardians: v })} />
                <Toggle label="Hogwarts" value={customization.hogwarts} onChange={(v) => u({ hogwarts: v })} />
                <Toggle label="Middle Earth" value={customization.middleEarth} onChange={(v) => u({ middleEarth: v })} />
                <Toggle label="Narnia" value={customization.narnia} onChange={(v) => u({ narnia: v })} />
                <Toggle label="Pandora (Avatar)" value={customization.pandora} onChange={(v) => u({ pandora: v })} />
              </OptionGroup>
              <OptionGroup title="OS & Platform Styles">
                <Toggle label="iOS / Cupertino" value={customization.cupertino} onChange={(v) => u({ cupertino: v })} />
                <Toggle label="Android" value={customization.androidStyle} onChange={(v) => u({ androidStyle: v })} />
                <Toggle label="Windows" value={customization.windowsStyle} onChange={(v) => u({ windowsStyle: v })} />
                <Toggle label="Linux" value={customization.linuxStyle} onChange={(v) => u({ linuxStyle: v })} />
                <Toggle label="Terminal" value={customization.terminalStyle} onChange={(v) => u({ terminalStyle: v })} />
                <Toggle label="Retro Terminal" value={customization.retroTerminalStyle} onChange={(v) => u({ retroTerminalStyle: v })} />
              </OptionGroup>
            </div>
          )}
        </div>

        {/* Live Preview Panel */}
        <div
          className="hidden xl:flex flex-col w-72 flex-shrink-0 border-l overflow-y-auto"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div className="px-4 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>Live Preview</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>See changes in real-time</p>
          </div>
          <div className="p-4 space-y-4">
            {/* Color swatches */}
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>COLOR PALETTE</p>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { color: customization.primaryColor, label: 'Primary' },
                  { color: customization.accentColor, label: 'Accent' },
                  { color: customization.backgroundColor, label: 'BG' },
                  { color: customization.cardColor, label: 'Card' },
                  { color: customization.foregroundColor, label: 'Text' },
                  { color: customization.successColor, label: 'Success' },
                  { color: customization.warningColor, label: 'Warning' },
                  { color: customization.errorColor, label: 'Error' },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-lg border" style={{ background: s.color, borderColor: 'var(--border)' }} />
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)', fontSize: '9px' }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gradient preview */}
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>GRADIENT</p>
              <div
                className="h-10 rounded-lg"
                style={{
                  background: `linear-gradient(${customization.gradientAngle}deg, ${customization.gradientStart}, ${customization.gradientMid}, ${customization.gradientEnd})`,
                }}
              />
            </div>

            {/* Button preview */}
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>BUTTON</p>
              <button
                className="w-full py-2 rounded-lg text-xs font-medium text-white"
                style={{
                  background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.accentColor})`,
                  borderRadius: `${customization.buttonBorderRadius}px`,
                  boxShadow: customization.buttonGlow ? `0 0 16px ${customization.buttonGlowColor || customization.primaryColor}` : undefined,
                  fontFamily: customization.fontFamily,
                }}
              >
                Sample Button
              </button>
            </div>

            {/* Card preview */}
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>CARD</p>
              <div
                className="p-3 rounded-xl"
                style={{
                  background: customization.cardColor,
                  border: `${customization.borderWidth}px ${customization.borderStyle} ${customization.borderColor}`,
                  borderRadius: `${customization.cardBorderRadius}px`,
                  boxShadow: customization.cardGlow ? `0 0 20px ${customization.cardGlowColor || customization.primaryColor}` : `0 4px ${customization.shadowDepth}px rgba(0,0,0,0.4)`,
                }}
              >
                <p className="text-xs font-bold mb-1" style={{ color: customization.foregroundColor, fontFamily: customization.headingFont }}>Card Title</p>
                <p className="text-xs" style={{ color: customization.subheadingColor, fontFamily: customization.fontFamily }}>Card description text goes here.</p>
              </div>
            </div>

            {/* Typography preview */}
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>TYPOGRAPHY</p>
              <div className="space-y-1">
                <p style={{ fontFamily: customization.headingFont, color: customization.foregroundColor, fontSize: '16px', fontWeight: customization.fontWeightBold }}>Heading</p>
                <p style={{ fontFamily: customization.fontFamily, color: customization.subheadingColor, fontSize: `${customization.fontSizeBase}px` }}>Body text sample</p>
                <p style={{ fontFamily: customization.monoFont, color: customization.accentColor, fontSize: '12px' }}>const code = true;</p>
              </div>
            </div>

            {/* Active theme info */}
            <div
              className="p-3 rounded-xl"
              style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
            >
              <p className="text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{activeTheme.name}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{activeTheme.description}</p>
              <div className="flex gap-1 mt-2">
                {activeTheme.preview.map((c, i) => (
                  <div key={i} className="w-4 h-4 rounded-full" style={{ background: c }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function ThemeCard({ theme, active, onSelect }: { theme: Theme; active: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="text-left rounded-2xl overflow-hidden transition-all duration-200 group"
      style={{
        background: theme.customization.cardColor || '#141720',
        border: active ? `2px solid ${theme.customization.primaryColor || '#7c3aed'}` : '2px solid transparent',
        boxShadow: active ? `0 0 20px ${theme.customization.primaryColor || '#7c3aed'}44` : '0 4px 16px rgba(0,0,0,0.3)',
        transform: active ? 'scale(1.02)' : undefined,
      }}
    >
      {/* Color bar */}
      <div
        className="h-2"
        style={{
          background: `linear-gradient(90deg, ${theme.preview.join(', ')})`,
        }}
      />
      {/* Preview area */}
      <div
        className="h-20 flex items-center justify-center relative overflow-hidden"
        style={{ background: theme.customization.backgroundColor || '#0d0f14' }}
      >
        <div className="flex gap-1.5">
          {theme.preview.map((c, i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: i === 0 ? '28px' : '20px',
                height: i === 0 ? '28px' : '20px',
                background: c,
                boxShadow: `0 0 12px ${c}88`,
              }}
            />
          ))}
        </div>
        {active && (
          <div
            className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
            style={{ background: theme.customization.primaryColor || '#7c3aed' }}
          >
            ✓
          </div>
        )}
      </div>
      {/* Info */}
      <div className="p-3">
        <p
          className="text-sm font-bold mb-0.5 truncate"
          style={{
            color: theme.customization.foregroundColor || '#e2e8f0',
            fontFamily: theme.customization.headingFont || 'inherit',
          }}
        >
          {theme.name}
        </p>
        <p
          className="text-xs line-clamp-2"
          style={{ color: theme.customization.subheadingColor || '#94a3b8' }}
        >
          {theme.description}
        </p>
      </div>
    </button>
  );
}
