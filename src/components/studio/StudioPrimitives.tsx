import React from 'react';

export function Pill({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'default' | 'success' | 'warning' | 'premium' }) {
  const toneClass =
    tone === 'success'
      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-400/20'
      : tone === 'warning'
      ? 'bg-amber-500/10 text-amber-200 border-amber-400/20'
      : tone === 'premium'
      ? 'bg-pink-500/10 text-pink-200 border-pink-400/20'
      : 'bg-white/5 text-white/80 border-white/10';

  return <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${toneClass}`}>{children}</span>;
}

export function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`surface-panel ${className}`.trim()}>{children}</div>;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/80">{eyebrow}</p> : null}
        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">{title}</h1>
        {description ? <p className="max-w-3xl text-sm leading-7 text-slate-300">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}

export function MetricCard({ value, label, detail }: { value: string; label: string; detail: string }) {
  return (
    <Panel className="space-y-3 p-5">
      <div className="text-3xl font-semibold text-white">{value}</div>
      <div>
        <p className="text-sm font-medium text-slate-100">{label}</p>
        <p className="mt-2 text-sm leading-6 text-slate-400">{detail}</p>
      </div>
    </Panel>
  );
}
