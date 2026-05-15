'use client';
import React, { useState } from 'react';
import { X, Hammer, ChevronDown, Sparkles } from 'lucide-react';

interface BuilderPanelProps {
  onClose: () => void;
  onBuild: (prompt: string) => void;
  isGenerating: boolean;
}

const TEMPLATES = [
  {
    category: 'Web App',
    items: [
      { label: 'REST API', desc: 'Express + TypeScript + Zod validation', prompt: 'Build a production-ready REST API with Express.js and TypeScript. Include: typed routes, Zod request validation, error handling middleware, health check endpoint, and a sample CRUD resource (items). Include package.json and a README with setup instructions.' },
      { label: 'Next.js App', desc: 'Next.js 14 + TypeScript + Tailwind', prompt: 'Build a Next.js 14 app with TypeScript and Tailwind CSS. Include: app router layout, a home page, a dynamic route page, a reusable Button component, and a global CSS file. Include package.json and README.' },
      { label: 'React SPA', desc: 'Vite + React + TypeScript + React Router', prompt: 'Build a React single-page app with Vite, TypeScript, and React Router v6. Include: home page, about page, a 404 page, a shared Navbar component, and proper routing. Include package.json and README.' },
      { label: 'GraphQL API', desc: 'Apollo Server + TypeScript', prompt: 'Build a GraphQL API with Apollo Server and TypeScript. Include: schema definition, resolvers, a sample User type with CRUD queries and mutations, and an in-memory data store. Include package.json and README.' },
    ],
  },
  {
    category: 'CLI Tool',
    items: [
      { label: 'Node CLI', desc: 'Commander.js + TypeScript', prompt: 'Build a Node.js CLI tool with Commander.js and TypeScript. Include: multiple sub-commands, flags, colored output with chalk, a help screen, and a sample command that reads/writes a JSON config file. Include package.json and README.' },
      { label: 'Python CLI', desc: 'Click + Rich', prompt: 'Build a Python CLI tool with Click and Rich. Include: multiple commands, options, a progress bar example, a table output example, and error handling. Include requirements.txt and README.' },
    ],
  },
  {
    category: 'Backend Service',
    items: [
      { label: 'FastAPI Service', desc: 'Python + FastAPI + Pydantic', prompt: 'Build a FastAPI service with Python. Include: Pydantic models, multiple endpoints (GET, POST, PUT, DELETE), request validation, error handling, and OpenAPI docs setup. Include requirements.txt and README.' },
      { label: 'WebSocket Server', desc: 'Node.js + ws + TypeScript', prompt: 'Build a WebSocket server with Node.js, the ws library, and TypeScript. Include: connection handling, message broadcasting, room support, heartbeat/ping-pong, and a simple HTML client to test it. Include package.json and README.' },
    ],
  },
  {
    category: 'Utility / Script',
    items: [
      { label: 'File Processor', desc: 'Node.js script to batch process files', prompt: 'Build a Node.js TypeScript script that batch-processes files in a directory. Include: recursive directory scanning, file filtering by extension, parallel processing with a concurrency limit, progress reporting, and a dry-run mode. Include package.json and README.' },
      { label: 'Data Pipeline', desc: 'Python ETL script', prompt: 'Build a Python ETL data pipeline script. Include: reading from a CSV file, transforming/cleaning data with pandas, validating records, writing output to a new CSV, and a summary report. Include requirements.txt and README.' },
    ],
  },
];

const STACK_OPTIONS = [
  'TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Java',
];

export default function BuilderPanel({ onClose, onBuild, isGenerating }: BuilderPanelProps) {
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedStack, setSelectedStack] = useState('TypeScript');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Web App');

  const handleBuildCustom = () => {
    if (!customPrompt.trim()) return;
    const fullPrompt = `[Stack: ${selectedStack}]\n\n${customPrompt.trim()}`;
    onBuild(fullPrompt);
  };

  const handleTemplate = (prompt: string) => {
    onBuild(prompt);
  };

  return (
    <div
      className="w-72 flex-shrink-0 border-l flex flex-col overflow-hidden"
      style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-2">
          <Hammer size={14} style={{ color: '#a78bfa' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Project Builder</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded transition-colors"
          style={{ color: 'var(--muted-foreground)' }}
          aria-label="Close builder panel"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-4">
        {/* Custom build */}
        <div>
          <p className="text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>
            Custom Build
          </p>
          {/* Stack selector */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {STACK_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStack(s)}
                className="px-2 py-0.5 rounded text-xs font-mono transition-all duration-150"
                style={
                  selectedStack === s
                    ? { background: 'rgba(124,58,237,0.2)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.4)' }
                    : { background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }
                }
              >
                {s}
              </button>
            ))}
          </div>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Describe the app or feature you want to build…"
            rows={4}
            className="w-full resize-none rounded-lg border p-2.5 text-xs outline-none scrollbar-thin"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--input)',
              color: 'var(--foreground)',
              lineHeight: '1.6',
            }}
          />
          <button
            onClick={handleBuildCustom}
            disabled={!customPrompt.trim() || isGenerating}
            className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 active:scale-95"
            style={
              customPrompt.trim() && !isGenerating
                ? { background: 'rgba(124,58,237,0.9)', color: 'white' }
                : { background: 'var(--muted)', color: 'var(--muted-foreground)', cursor: 'not-allowed' }
            }
          >
            {isGenerating ? (
              <>
                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Building…
              </>
            ) : (
              <>
                <Hammer size={12} />
                Build Project
              </>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="border-t" style={{ borderColor: 'var(--border)' }} />

        {/* Templates */}
        <div>
          <p className="text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>
            Quick Templates
          </p>
          <div className="space-y-1">
            {TEMPLATES.map((cat) => (
              <div key={cat.category}>
                <button
                  onClick={() => setExpandedCategory(expandedCategory === cat.category ? null : cat.category)}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
                  style={{ color: 'var(--foreground)', background: expandedCategory === cat.category ? 'rgba(124,58,237,0.08)' : 'transparent' }}
                >
                  <span>{cat.category}</span>
                  <ChevronDown
                    size={12}
                    style={{
                      color: 'var(--muted-foreground)',
                      transform: expandedCategory === cat.category ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.15s',
                    }}
                  />
                </button>
                {expandedCategory === cat.category && (
                  <div className="ml-2 mt-0.5 space-y-0.5">
                    {cat.items.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => handleTemplate(item.prompt)}
                        disabled={isGenerating}
                        className="w-full text-left px-2.5 py-2 rounded-lg text-xs transition-all duration-150 group"
                        style={{ color: 'var(--foreground)' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.08)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                      >
                        <div className="flex items-center gap-1.5">
                          <Sparkles size={10} style={{ color: '#a78bfa', flexShrink: 0 }} />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <p className="mt-0.5 text-[10px] leading-snug" style={{ color: 'var(--muted-foreground)' }}>
                          {item.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
