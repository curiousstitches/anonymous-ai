'use client';

import React, { useState } from 'react';
import { Copy, Check, Play, Download } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
}

const langColors: Record<string, string> = {
  python: '#10b981',
  typescript: '#06b6d4',
  javascript: '#f59e0b',
  sql: '#a78bfa',
  rust: '#ef4444',
  bash: '#64748b',
  yaml: '#f59e0b',
  json: '#94a3b8',
  dockerfile: '#64748b',
};

export default function CodeBlock({ code, language, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const color = langColors[language.toLowerCase()] || '#94a3b8';

  return (
    <div className="code-block my-3 overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{ borderColor: 'var(--border)', background: 'rgba(255,255,255,0.02)' }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-mono font-medium px-2 py-0.5 rounded"
            style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
          >
            {language}
          </span>
          {filename && (
            <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
              {filename}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            className="p-1.5 rounded-md transition-all duration-150 active:scale-95"
            style={{ color: 'var(--muted-foreground)' }}
            title="Download code"
          >
            <Download size={13} />
          </button>
          <button
            className="p-1.5 rounded-md transition-all duration-150 active:scale-95"
            style={{ color: 'var(--muted-foreground)' }}
            title="Run in terminal"
          >
            <Play size={13} />
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150 active:scale-95"
            style={
              copied
                ? { background: 'rgba(16,185,129,0.15)', color: '#10b981' }
                : { background: 'var(--muted)', color: 'var(--muted-foreground)' }
            }
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm leading-relaxed" style={{ margin: 0, background: '#0a0c10' }}>
          <code
            className="font-mono"
            style={{ color: 'var(--foreground)', fontSize: '13px' }}
          >
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}