'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Check, X, Loader2, ChevronDown, ExternalLink } from 'lucide-react';

interface ProviderCardProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  isActive: boolean;
  isConnected: boolean;
  models: string[];
  defaultModel: string;
  hasApiKey: boolean;
  hasEndpoint?: boolean;
  endpointPlaceholder?: string;
  apiKeyPlaceholder?: string;
  docsUrl?: string;
  onSetActive: (id: string) => void;
}

export default function ProviderCard({
  id,
  name,
  description,
  icon,
  color,
  isActive,
  isConnected,
  models,
  defaultModel,
  hasApiKey,
  hasEndpoint,
  endpointPlaceholder,
  apiKeyPlaceholder,
  docsUrl,
  onSetActive,
}: ProviderCardProps) {
  const [expanded, setExpanded] = useState(isActive);
  const [apiKey, setApiKey] = useState(hasApiKey ? '••••••••••••••••••••••••' : '');
  const [showKey, setShowKey] = useState(false);
  const [endpoint, setEndpoint] = useState(
    id === 'ollama' ? 'http://localhost:11434' : ''
  );
  const [selectedModel, setSelectedModel] = useState(defaultModel);
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [saved, setSaved] = useState(false);

  const handleTest = () => {
    setTestStatus('loading');
    // Backend integration point: POST /api/providers/test with { provider: id, apiKey, endpoint }
    setTimeout(() => {
      setTestStatus(id === 'ollama' ? 'success' : hasApiKey ? 'success' : 'error');
      setTimeout(() => setTestStatus('idle'), 3000);
    }, 1800);
  };

  const handleSave = () => {
    setSaved(true);
    // Backend integration point: PATCH /api/settings/providers/:id
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div
      className="rounded-xl border overflow-hidden transition-all duration-200"
      style={{
        borderColor: isActive ? `${color}40` : 'var(--border)',
        background: isActive ? `${color}06` : 'var(--card)',
        boxShadow: isActive ? `0 0 0 1px ${color}25` : 'none',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: `${color}15`, border: `1px solid ${color}25` }}
          >
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                {name}
              </h3>
              {isActive && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
                >
                  Active
                </span>
              )}
              {isConnected ? (
                <span className="badge-green text-xs">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#10b981' }} />
                  Connected
                </span>
              ) : (
                <span className="badge-red text-xs">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#ef4444' }} />
                  Disconnected
                </span>
              )}
            </div>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
              {description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isActive && (
            <button
              onClick={(e) => { e.stopPropagation(); onSetActive(id); }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 active:scale-95"
              style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}
            >
              Set Active
            </button>
          )}
          <ChevronDown
            size={16}
            style={{
              color: 'var(--muted-foreground)',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 200ms ease',
            }}
          />
        </div>
      </div>

      {/* Expanded settings */}
      {expanded && (
        <div
          className="px-5 pb-5 border-t space-y-4 fade-in"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="pt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Endpoint (self-hosted only) */}
            {hasEndpoint && (
              <div className="lg:col-span-2">
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>
                  Ollama Endpoint URL
                </label>
                <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>
                  The base URL of your running Ollama instance. Default: http://localhost:11434
                </p>
                <input
                  type="text"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  placeholder={endpointPlaceholder}
                  className="input-base font-mono text-xs"
                />
              </div>
            )}

            {/* API Key */}
            {!hasEndpoint && (
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>
                    API Key
                  </label>
                  {docsUrl && (
                    <a
                      href={docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs"
                      style={{ color: color }}
                    >
                      Get API key <ExternalLink size={10} />
                    </a>
                  )}
                </div>
                <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>
                  Your key is stored locally and never sent to CodePilot servers.
                </p>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={apiKeyPlaceholder}
                    className="input-base font-mono text-xs pr-10"
                  />
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--muted-foreground)' }}
                    aria-label={showKey ? 'Hide API key' : 'Show API key'}
                  >
                    {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            )}

            {/* Model selector */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>
                Default Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="input-base text-xs"
                style={{ fontFamily: 'var(--font-mono)' }}
                aria-label={`Select default model for ${name}`}
              >
                {models.map((m) => (
                  <option key={`${id}-model-${m}`} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Connection test */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>
                Connection Test
              </label>
              <button
                onClick={handleTest}
                disabled={testStatus === 'loading'}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all duration-150 active:scale-95"
                style={
                  testStatus === 'success'
                    ? { background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }
                    : testStatus === 'error'
                    ? { background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }
                    : { background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }
                }
              >
                {testStatus === 'loading' && <Loader2 size={13} className="animate-spin" />}
                {testStatus === 'success' && <Check size={13} />}
                {testStatus === 'error' && <X size={13} />}
                {testStatus === 'idle' && 'Test Connection'}
                {testStatus === 'loading' && 'Testing...'}
                {testStatus === 'success' && 'Connection successful'}
                {testStatus === 'error' && 'Connection failed — check key'}
              </button>
            </div>
          </div>

          {/* Save */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              className="btn-ghost text-xs"
              onClick={() => setExpanded(false)}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-150 active:scale-95"
              style={
                saved
                  ? { background: 'rgba(16,185,129,0.15)', color: '#10b981' }
                  : { background: 'var(--primary)', color: 'white' }
              }
            >
              {saved ? <><Check size={12} /> Saved!</> : 'Save Configuration'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}