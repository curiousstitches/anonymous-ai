'use client';

import { useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export default function AnimatedBackground() {
  const { activeTheme, personalization } = useTheme();

  const sparkles = useMemo(
    () =>
      Array.from({ length: personalization.motion === 'low' ? 10 : personalization.motion === 'medium' ? 16 : 22 }, (_, index) => ({
        id: index,
        top: `${(index * 13) % 100}%`,
        left: `${(index * 17) % 100}%`,
        delay: `${(index % 7) * 0.35}s`,
        duration: personalization.motion === 'high' ? '2.8s' : '4.6s',
      })),
    [personalization.motion],
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 20% 20%, ${activeTheme.glow}, transparent 28%), radial-gradient(circle at 80% 0%, ${activeTheme.accent}22, transparent 25%), linear-gradient(135deg, ${activeTheme.background}, ${activeTheme.surface})`,
        }}
      />

      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '90px 90px' }} />

      {(activeTheme.effect === 'sparkle' || activeTheme.effect === 'pulse') &&
        sparkles.map((sparkle) => (
          <span
            key={sparkle.id}
            className="absolute rounded-full animate-pulse"
            style={{
              top: sparkle.top,
              left: sparkle.left,
              width: sparkle.id % 3 === 0 ? 10 : 6,
              height: sparkle.id % 3 === 0 ? 10 : 6,
              background: activeTheme.accent,
              boxShadow: `0 0 18px ${activeTheme.accent}`,
              opacity: 0.6,
              animationDuration: sparkle.duration,
              animationDelay: sparkle.delay,
            }}
          />
        ))}

      {activeTheme.effect === 'fluid' && (
        <>
          <div className="absolute -left-24 top-20 h-80 w-80 rounded-full blur-3xl opacity-35 animate-pulse" style={{ background: activeTheme.primary, animationDuration: '7s' }} />
          <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full blur-3xl opacity-30 animate-pulse" style={{ background: activeTheme.accent, animationDuration: '9s' }} />
        </>
      )}

      {activeTheme.effect === 'fire' && (
        <>
          <div className="absolute inset-x-0 bottom-0 h-64 opacity-60 blur-3xl" style={{ background: `linear-gradient(180deg, transparent, ${activeTheme.primary}55 45%, ${activeTheme.accent}55 100%)` }} />
          <div className="absolute left-1/4 bottom-10 h-32 w-32 rounded-full blur-3xl opacity-50 animate-pulse" style={{ background: activeTheme.primary, animationDuration: '2.6s' }} />
          <div className="absolute right-1/4 bottom-6 h-40 w-40 rounded-full blur-3xl opacity-40 animate-pulse" style={{ background: activeTheme.accent, animationDuration: '3.2s' }} />
        </>
      )}

      {activeTheme.effect === 'gradient' && (
        <div className="absolute inset-0 opacity-40" style={{ background: `linear-gradient(120deg, ${activeTheme.primary}11, transparent 35%, ${activeTheme.accent}22 60%, transparent)` }} />
      )}
    </div>
  );
}
