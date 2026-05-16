'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { allThemes, themeGroups, type ThemePreset } from '@/lib/theme-presets';

interface PersonalizationSettings {
  density: 'compact' | 'balanced' | 'spacious';
  motion: 'low' | 'medium' | 'high';
  depth: 'soft' | 'medium' | 'dramatic';
  narrationEnabled: boolean;
}

interface ThemeContextValue {
  activeTheme: ThemePreset;
  themes: ThemePreset[];
  themeGroups: typeof themeGroups;
  personalization: PersonalizationSettings;
  setActiveTheme: (themeId: string) => void;
  updatePersonalization: (updates: Partial<PersonalizationSettings>) => void;
  resetTheme: () => void;
}

const DEFAULT_THEME_ID = 'simple-midnight';
const STORAGE_KEY = 'codepilot-theme-v2';
const SETTINGS_KEY = 'codepilot-theme-settings-v2';

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getThemeById(themeId: string | null | undefined): ThemePreset {
  return allThemes.find((theme) => theme.id === themeId) ?? allThemes[0];
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [activeThemeId, setActiveThemeId] = useState(DEFAULT_THEME_ID);
  const [personalization, setPersonalization] = useState<PersonalizationSettings>({
    density: 'balanced',
    motion: 'medium',
    depth: 'medium',
    narrationEnabled: false,
  });

  useEffect(() => {
    try {
      const savedThemeId = localStorage.getItem(STORAGE_KEY);
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      if (savedThemeId) setActiveThemeId(getThemeById(savedThemeId).id);
      if (savedSettings) {
        setPersonalization((prev) => ({ ...prev, ...JSON.parse(savedSettings) }));
      }
    } catch {
      // ignore localStorage issues
    }
  }, []);

  const activeTheme = useMemo(() => getThemeById(activeThemeId), [activeThemeId]);

  useEffect(() => {
    const root = document.documentElement;
    const densityMap = {
      compact: '0.88',
      balanced: '1',
      spacious: '1.12',
    } as const;
    const motionMap = {
      low: '8s',
      medium: '5s',
      high: '3s',
    } as const;
    const depthMap = {
      soft: '18px',
      medium: '28px',
      dramatic: '42px',
    } as const;

    root.style.setProperty('--background', activeTheme.background);
    root.style.setProperty('--foreground', activeTheme.text);
    root.style.setProperty('--primary', activeTheme.primary);
    root.style.setProperty('--primary-foreground', '#ffffff');
    root.style.setProperty('--secondary', activeTheme.surface);
    root.style.setProperty('--secondary-foreground', activeTheme.text);
    root.style.setProperty('--accent', activeTheme.accent);
    root.style.setProperty('--accent-foreground', '#ffffff');
    root.style.setProperty('--muted', activeTheme.surface);
    root.style.setProperty('--muted-foreground', activeTheme.muted);
    root.style.setProperty('--card', activeTheme.surface);
    root.style.setProperty('--card-foreground', activeTheme.text);
    root.style.setProperty('--border', activeTheme.border);
    root.style.setProperty('--input', activeTheme.surface);
    root.style.setProperty('--ring', activeTheme.primary);
    root.style.setProperty('--surface-glow', activeTheme.glow);
    root.style.setProperty('--visual-density', densityMap[personalization.density]);
    root.style.setProperty('--motion-speed', motionMap[personalization.motion]);
    root.style.setProperty('--panel-depth', depthMap[personalization.depth]);
    root.dataset.themeEffect = activeTheme.effect;

    try {
      localStorage.setItem(STORAGE_KEY, activeTheme.id);
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(personalization));
    } catch {
      // ignore localStorage issues
    }
  }, [activeTheme, personalization]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      activeTheme,
      themes: allThemes,
      themeGroups,
      personalization,
      setActiveTheme: (themeId: string) => setActiveThemeId(getThemeById(themeId).id),
      updatePersonalization: (updates) => setPersonalization((prev) => ({ ...prev, ...updates })),
      resetTheme: () => {
        setActiveThemeId(DEFAULT_THEME_ID);
        setPersonalization({
          density: 'balanced',
          motion: 'medium',
          depth: 'medium',
          narrationEnabled: false,
        });
      },
    }),
    [activeTheme, personalization],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
