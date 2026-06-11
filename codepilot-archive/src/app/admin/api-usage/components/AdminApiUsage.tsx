'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  AlertTriangle, CheckCircle, XCircle, RefreshCw, Activity,
  ShieldCheck, AlertOctagon, Key, Eye, EyeOff, Pencil, Check, X,
  Zap, Clock, BarChart2, Wifi, WifiOff, Play, Loader2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { testPuterConnection, type PuterTestResult } from '@/lib/ai/puterClient';

interface ProviderStatus {
  id: string;
  name: string;
  color: string;
  icon: string;
  enabled: boolean;
  requestsToday: number;
  requestsLimit: number;
  tokensUsed: number;
  tokensLimit: number;
  latencyMs: number;
  lastChecked: Date;
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  statusMessage: string;
  costToday: number;
  errorRate: number;
  apiKeyEnvVar: string;
}

// Simulated stored keys (in production these would come from a secure backend)
const PROVIDER_KEY_STORE: Record<string, string> = {
  openai: '',
  gemini: '',
  anthropic: '',
  puter: '',
};

const REFRESH_INTERVAL_MS = 15_000;

function getStatusColor(status: ProviderStatus['status']): string {
  switch (status) {
    case 'healthy': return '#10b981';
    case 'warning': return '#f59e0b';
    case 'critical': return '#ef4444';
    case 'offline': return '#6b7280';
  }
}

function getStatusIcon(status: ProviderStatus['status']) {
  switch (status) {
    case 'healthy': return <CheckCircle size={14} />;
    case 'warning': return <AlertTriangle size={14} />;
    case 'critical': return <AlertOctagon size={14} />;
    case 'offline': return <XCircle size={14} />;
  }
}

function computeStatus(provider: Omit<ProviderStatus, 'status' | 'statusMessage' | 'apiKeyEnvVar'>): Pick<ProviderStatus, 'status' | 'statusMessage'> {
  if (!provider.enabled) return { status: 'offline', statusMessage: 'Provider disabled or no API key configured' };
  const reqPct = provider.requestsLimit > 0 ? (provider.requestsToday / provider.requestsLimit) * 100 : 0;
  const tokPct = provider.tokensLimit > 0 ? (provider.tokensUsed / provider.tokensLimit) * 100 : 0;
  const maxPct = Math.max(reqPct, tokPct);
  if (provider.errorRate > 20) return { status: 'critical', statusMessage: `High error rate: ${provider.errorRate.toFixed(1)}% of requests failing` };
  if (maxPct >= 100) return { status: 'critical', statusMessage: 'Rate limit reached — requests are being blocked' };
  if (maxPct >= 80) return { status: 'warning', statusMessage: `Usage at ${maxPct.toFixed(0)}% — approaching limit` };
  if (provider.latencyMs > 3000) return { status: 'warning', statusMessage: `High latency: ${provider.latencyMs}ms avg response` };
  return { status: 'healthy', statusMessage: 'Operating normally' };
}

// Build providers with seeded values — called only client-side to avoid hydration mismatch
function buildProviders(openaiEnabled: boolean, geminiEnabled: boolean, puterEnabled: boolean): ProviderStatus[] {
  const now = new Date();

  const openaiBase = {
    id: 'openai', name: 'OpenAI', color: '#06b6d4', icon: '⚡', enabled: openaiEnabled,
    requestsToday: openaiEnabled ? Math.floor(Math.random() * 120) + 40 : 0,
    requestsLimit: 500,
    tokensUsed: openaiEnabled ? Math.floor(Math.random() * 180_000) + 60_000 : 0,
    tokensLimit: 300_000,
    latencyMs: openaiEnabled ? Math.floor(Math.random() * 600) + 400 : 0,
    lastChecked: now,
    costToday: openaiEnabled ? parseFloat((Math.random() * 3 + 0.5).toFixed(2)) : 0,
    errorRate: openaiEnabled ? parseFloat((Math.random() * 3).toFixed(1)) : 0,
    apiKeyEnvVar: 'OPENAI_API_KEY',
  };

  const geminiBase = {
    id: 'gemini', name: 'Gemini', color: '#f59e0b', icon: '✦', enabled: geminiEnabled,
    requestsToday: geminiEnabled ? Math.floor(Math.random() * 80) + 20 : 0,
    requestsLimit: 1500,
    tokensUsed: geminiEnabled ? Math.floor(Math.random() * 500_000) + 100_000 : 0,
    tokensLimit: 1_000_000,
    latencyMs: geminiEnabled ? Math.floor(Math.random() * 400) + 300 : 0,
    lastChecked: now,
    costToday: 0,
    errorRate: geminiEnabled ? parseFloat((Math.random() * 2).toFixed(1)) : 0,
    apiKeyEnvVar: 'GEMINI_API_KEY',
  };

  const puterBase = {
    id: 'puter', name: 'Puter (Free)', color: '#a78bfa', icon: '∞', enabled: puterEnabled,
    requestsToday: puterEnabled ? Math.floor(Math.random() * 200) + 50 : 0,
    requestsLimit: 0,
    tokensUsed: puterEnabled ? Math.floor(Math.random() * 400_000) + 100_000 : 0,
    tokensLimit: 0,
    latencyMs: puterEnabled ? Math.floor(Math.random() * 800) + 500 : 0,
    lastChecked: now,
    costToday: 0,
    errorRate: puterEnabled ? parseFloat((Math.random() * 5).toFixed(1)) : 0,
    apiKeyEnvVar: 'PUTER_API_KEY',
  };

  return [openaiBase, geminiBase, puterBase].map((p) => ({ ...p, ...computeStatus(p) }));
}

function UsageBar({ used, limit, color }: { used: number; limit: number; color: string }) {
  if (limit === 0) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
          <div className="h-full rounded-full w-full opacity-30" style={{ background: color }} />
        </div>
        <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)', minWidth: 60 }}>Unlimited</span>
      </div>
    );
  }
  const pct = Math.min((used / limit) * 100, 100);
  const barColor = pct >= 100 ? '#ef4444' : pct >= 80 ? '#f59e0b' : color;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: barColor }} />
      </div>
      <span className="text-xs font-mono" style={{ color: pct >= 80 ? barColor : 'var(--muted-foreground)', minWidth: 60 }}>
        {pct.toFixed(0)}%
      </span>
    </div>
  );
}

function AlertBanners({ providers }: { providers: ProviderStatus[] }) {
  const alerts = providers.filter((p) => p.status === 'warning' || p.status === 'critical' || p.status === 'offline');
  if (alerts.length === 0) return null;
  return (
    <div className="space-y-2">
      {alerts.map((p) => (
        <div
          key={`alert-${p.id}`}
          className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm"
          style={{
            background: p.status === 'critical' ? 'rgba(239,68,68,0.08)' : p.status === 'warning' ? 'rgba(245,158,11,0.08)' : 'rgba(107,114,128,0.08)',
            border: `1px solid ${p.status === 'critical' ? 'rgba(239,68,68,0.3)' : p.status === 'warning' ? 'rgba(245,158,11,0.3)' : 'rgba(107,114,128,0.3)'}`,
          }}
        >
          <span style={{ color: getStatusColor(p.status), marginTop: 1 }}>{getStatusIcon(p.status)}</span>
          <div>
            <span className="font-semibold" style={{ color: getStatusColor(p.status) }}>{p.name}: </span>
            <span style={{ color: 'var(--foreground)' }}>{p.statusMessage}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function maskKey(key: string): string {
  if (!key || key.length < 8) return key ? '••••••••' : '';
  return key.slice(0, 4) + '••••••••' + key.slice(-4);
}

function ApiKeyEditor({ providerId, providerColor, envVar }: { providerId: string; providerColor: string; envVar: string }) {
  const [storedKey, setStoredKey] = useState<string>(PROVIDER_KEY_STORE[providerId] || '');
  const [isEditing, setIsEditing] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [saved, setSaved] = useState(false);

  const handleEdit = () => { setEditValue(storedKey); setIsEditing(true); setShowKey(false); };
  const handleSave = () => {
    PROVIDER_KEY_STORE[providerId] = editValue.trim();
    setStoredKey(editValue.trim());
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  const handleCancel = () => { setIsEditing(false); setEditValue(''); };

  return (
    <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-center gap-1.5 mb-2">
        <Key size={11} style={{ color: providerColor }} />
        <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>API Key</span>
        <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: `${providerColor}15`, color: providerColor, fontSize: '10px' }}>
          {envVar}
        </span>
      </div>
      {isEditing ? (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <input
              type={showKey ? 'text' : 'password'}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder="Paste your API key here…"
              autoFocus
              className="flex-1 text-xs font-mono px-2.5 py-1.5 rounded-lg outline-none transition-all"
              style={{ background: 'var(--muted)', border: `1px solid ${providerColor}60`, color: 'var(--foreground)', minWidth: 0 }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel(); }}
            />
            <button onClick={() => setShowKey((v) => !v)} className="p-1.5 rounded-lg transition-colors flex-shrink-0" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }} title={showKey ? 'Hide key' : 'Show key'}>
              {showKey ? <EyeOff size={12} /> : <Eye size={12} />}
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={handleSave} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex-1 justify-center" style={{ background: providerColor, color: '#fff' }}>
              <Check size={11} /> Save
            </button>
            <button onClick={handleCancel} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex-1 justify-center" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }}>
              <X size={11} /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <div className="flex-1 flex items-center px-2.5 py-1.5 rounded-lg min-w-0" style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}>
            <span className="text-xs font-mono truncate" style={{ color: storedKey ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
              {storedKey ? (showKey ? storedKey : maskKey(storedKey)) : 'No key set'}
            </span>
          </div>
          {storedKey && (
            <button onClick={() => setShowKey((v) => !v)} className="p-1.5 rounded-lg transition-colors flex-shrink-0" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }} title={showKey ? 'Hide key' : 'Reveal key'}>
              {showKey ? <EyeOff size={12} /> : <Eye size={12} />}
            </button>
          )}
          <button onClick={handleEdit} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0" style={{ background: saved ? 'rgba(16,185,129,0.12)' : `${providerColor}15`, color: saved ? '#10b981' : providerColor, border: `1px solid ${saved ? 'rgba(16,185,129,0.3)' : providerColor + '30'}` }}>
            {saved ? (<><Check size={11} />Saved</>) : (<><Pencil size={11} />{storedKey ? 'Edit' : 'Add Key'}</>)}
          </button>
        </div>
      )}
    </div>
  );
}

function ProviderCard({ provider }: { provider: ProviderStatus }) {
  const statusColor = getStatusColor(provider.status);
  return (
    <div className="rounded-xl p-5 flex flex-col gap-4" style={{ background: 'var(--card)', border: `1px solid ${provider.status !== 'healthy' ? statusColor + '40' : 'var(--border)'}` }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold" style={{ background: `${provider.color}18`, color: provider.color }}>
            {provider.icon}
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{provider.name}</p>
            <div className="flex items-center gap-1 mt-0.5" style={{ color: statusColor }}>
              {getStatusIcon(provider.status)}
              <span className="text-xs capitalize">{provider.status}</span>
            </div>
          </div>
        </div>
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: statusColor, boxShadow: provider.status === 'healthy' ? `0 0 8px ${statusColor}` : 'none' }} />
      </div>
      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{provider.statusMessage}</p>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Requests today</span>
            <span className="text-xs font-mono" style={{ color: 'var(--foreground)' }}>
              {provider.requestsToday.toLocaleString()}{provider.requestsLimit > 0 ? ` / ${provider.requestsLimit.toLocaleString()}` : ''}
            </span>
          </div>
          <UsageBar used={provider.requestsToday} limit={provider.requestsLimit} color={provider.color} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Tokens used</span>
            <span className="text-xs font-mono" style={{ color: 'var(--foreground)' }}>
              {(provider.tokensUsed / 1000).toFixed(0)}k{provider.tokensLimit > 0 ? ` / ${(provider.tokensLimit / 1000).toFixed(0)}k` : ''}
            </span>
          </div>
          <UsageBar used={provider.tokensUsed} limit={provider.tokensLimit} color={provider.color} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 pt-1 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="text-center">
          <p className="text-xs font-mono font-semibold" style={{ color: 'var(--foreground)' }}>{provider.latencyMs > 0 ? `${provider.latencyMs}ms` : '—'}</p>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Latency</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-mono font-semibold" style={{ color: provider.errorRate > 5 ? '#ef4444' : 'var(--foreground)' }}>{provider.errorRate > 0 ? `${provider.errorRate}%` : '0%'}</p>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Error rate</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-mono font-semibold" style={{ color: 'var(--foreground)' }}>{provider.costToday > 0 ? `$${provider.costToday.toFixed(2)}` : 'Free'}</p>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Cost today</p>
        </div>
      </div>
      <ApiKeyEditor providerId={provider.id} providerColor={provider.color} envVar={provider.apiKeyEnvVar} />
    </div>
  );
}

// ─── Puter Live Test Panel ────────────────────────────────────────────────────

type TestState = 'idle' | 'running' | 'done' | 'error';

interface TestRun {
  result: PuterTestResult;
  runAt: string; // formatted time string — set client-side only
}

function PuterTestPanel() {
  const [testState, setTestState] = useState<TestState>('idle');
  const [history, setHistory] = useState<TestRun[]>([]);
  const [currentResult, setCurrentResult] = useState<PuterTestResult | null>(null);
  const abortRef = useRef(false);

  const runTest = useCallback(async () => {
    abortRef.current = false;
    setTestState('running');
    setCurrentResult(null);

    try {
      const result = await testPuterConnection('gpt-4o-mini');
      if (abortRef.current) return;
      setCurrentResult(result);
      setTestState(result.success ? 'done' : 'error');
      setHistory((prev) => [
        { result, runAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) },
        ...prev.slice(0, 9),
      ]);
    } catch (err) {
      if (abortRef.current) return;
      setTestState('error');
      setCurrentResult({
        success: false,
        latencyMs: 0,
        ttfbMs: 0,
        totalChars: 0,
        tokensEstimate: 0,
        charsPerSecond: 0,
        model: 'gpt-4o-mini',
        provider: 'openai-failover',
        error: err instanceof Error ? err.message : 'Unknown error',
        timestamp: new Date(),
      });
    }
  }, []);

  useEffect(() => () => { abortRef.current = true; }, []);

  const providerColor = currentResult?.provider === 'puter' ? '#a78bfa' : '#06b6d4';
  const providerLabel = currentResult?.provider === 'puter' ? 'Puter (direct)' : 'OpenAI (failover)';

  return (
    <div className="rounded-xl p-5 space-y-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(167,139,250,0.12)', color: '#a78bfa' }}>
            <Zap size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Puter Live Callback Test</p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Real-time latency, TTFB &amp; throughput measurement</p>
          </div>
        </div>
        <button
          onClick={runTest}
          disabled={testState === 'running'}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            background: testState === 'running' ? 'rgba(167,139,250,0.1)' : '#a78bfa',
            color: testState === 'running' ? '#a78bfa' : '#fff',
            border: testState === 'running' ? '1px solid rgba(167,139,250,0.3)' : 'none',
            cursor: testState === 'running' ? 'not-allowed' : 'pointer',
          }}
        >
          {testState === 'running' ? (
            <><Loader2 size={14} className="animate-spin" /> Running…</>
          ) : (
            <><Play size={14} /> Run Test</>
          )}
        </button>
      </div>

      {/* Result metrics */}
      {currentResult && (
        <div
          className="rounded-xl p-4 space-y-4"
          style={{
            background: currentResult.success ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)',
            border: `1px solid ${currentResult.success ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
          }}
        >
          {/* Status row */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              {currentResult.success
                ? <CheckCircle size={15} style={{ color: '#10b981' }} />
                : <XCircle size={15} style={{ color: '#ef4444' }} />}
              <span className="text-sm font-semibold" style={{ color: currentResult.success ? '#10b981' : '#ef4444' }}>
                {currentResult.success ? 'Test Passed' : 'Test Failed'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {currentResult.provider === 'puter'
                ? <Wifi size={13} style={{ color: providerColor }} />
                : <WifiOff size={13} style={{ color: providerColor }} />}
              <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: `${providerColor}18`, color: providerColor }}>
                {providerLabel}
              </span>
            </div>
          </div>

          {/* Error message */}
          {currentResult.error && (
            <div className="text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
              <span className="font-semibold">Puter error: </span>{currentResult.error}
              {currentResult.provider === 'openai-failover' && (
                <span className="block mt-1 opacity-80">↳ Automatically routed to OpenAI failover</span>
              )}
            </div>
          )}

          {/* Metrics grid */}
          {currentResult.success && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <MetricTile icon={<Clock size={13} />} label="Total latency" value={`${currentResult.latencyMs}ms`} color={currentResult.latencyMs < 1500 ? '#10b981' : currentResult.latencyMs < 3000 ? '#f59e0b' : '#ef4444'} />
              <MetricTile icon={<Zap size={13} />} label="Time to first byte" value={currentResult.ttfbMs > 0 ? `${currentResult.ttfbMs}ms` : '—'} color={currentResult.ttfbMs < 800 ? '#10b981' : '#f59e0b'} />
              <MetricTile icon={<BarChart2 size={13} />} label="Throughput" value={currentResult.charsPerSecond > 0 ? `${currentResult.charsPerSecond} c/s` : '—'} color="#a78bfa" />
              <MetricTile icon={<Activity size={13} />} label="Est. tokens" value={`~${currentResult.tokensEstimate}`} color="#06b6d4" />
            </div>
          )}

          {/* Speed rating */}
          {currentResult.success && (
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Speed rating:</span>
              <SpeedRating latencyMs={currentResult.latencyMs} />
            </div>
          )}
        </div>
      )}

      {/* Idle placeholder */}
      {testState === 'idle' && (
        <div className="flex flex-col items-center justify-center py-8 gap-2" style={{ color: 'var(--muted-foreground)' }}>
          <Zap size={28} style={{ opacity: 0.3 }} />
          <p className="text-sm">Click <strong>Run Test</strong> to send a live callback to Puter and measure performance</p>
        </div>
      )}

      {/* Running placeholder */}
      {testState === 'running' && !currentResult && (
        <div className="flex flex-col items-center justify-center py-8 gap-3" style={{ color: 'var(--muted-foreground)' }}>
          <Loader2 size={24} className="animate-spin" style={{ color: '#a78bfa' }} />
          <p className="text-sm">Sending callback to Puter AI…</p>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>Recent runs</p>
          <div className="space-y-1.5">
            {history.map((run, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs" style={{ background: 'var(--muted)' }}>
                <span style={{ color: run.result.success ? '#10b981' : '#ef4444' }}>
                  {run.result.success ? <CheckCircle size={11} /> : <XCircle size={11} />}
                </span>
                <span className="font-mono" style={{ color: 'var(--muted-foreground)', minWidth: 70 }}>{run.runAt}</span>
                <span className="font-mono font-semibold" style={{ color: 'var(--foreground)' }}>{run.result.latencyMs}ms</span>
                <span style={{ color: 'var(--muted-foreground)' }}>TTFB {run.result.ttfbMs > 0 ? `${run.result.ttfbMs}ms` : '—'}</span>
                <span className="ml-auto px-1.5 py-0.5 rounded text-xs" style={{ background: run.result.provider === 'puter' ? 'rgba(167,139,250,0.15)' : 'rgba(6,182,212,0.15)', color: run.result.provider === 'puter' ? '#a78bfa' : '#06b6d4' }}>
                  {run.result.provider === 'puter' ? 'Puter' : 'Failover'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MetricTile({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col gap-1 p-3 rounded-lg" style={{ background: 'var(--muted)' }}>
      <div className="flex items-center gap-1.5" style={{ color }}>
        {icon}
        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{label}</span>
      </div>
      <p className="text-base font-bold font-mono" style={{ color }}>{value}</p>
    </div>
  );
}

function SpeedRating({ latencyMs }: { latencyMs: number }) {
  let label: string;
  let color: string;
  let bars: number;

  if (latencyMs < 800) { label = 'Excellent'; color = '#10b981'; bars = 5; }
  else if (latencyMs < 1500) { label = 'Good'; color = '#34d399'; bars = 4; }
  else if (latencyMs < 2500) { label = 'Average'; color = '#f59e0b'; bars = 3; }
  else if (latencyMs < 4000) { label = 'Slow'; color = '#f97316'; bars = 2; }
  else { label = 'Very slow'; color = '#ef4444'; bars = 1; }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-end gap-0.5">
        {[1, 2, 3, 4, 5].map((b) => (
          <div
            key={b}
            className="rounded-sm transition-all"
            style={{
              width: 5,
              height: 4 + b * 3,
              background: b <= bars ? color : 'var(--border)',
            }}
          />
        ))}
      </div>
      <span className="text-xs font-semibold" style={{ color }}>{label}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminApiUsage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [providers, setProviders] = useState<ProviderStatus[]>([]);
  const [lastRefreshStr, setLastRefreshStr] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL_MS / 1000);
  const lastRefreshRef = useRef<Date | null>(null);

  const refresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      const now = new Date();
      setProviders(buildProviders(true, false, true));
      lastRefreshRef.current = now;
      // Format time client-side only — avoids hydration mismatch
      setLastRefreshStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCountdown(REFRESH_INTERVAL_MS / 1000);
      setIsRefreshing(false);
    }, 600);
  }, []);

  useEffect(() => {
    if (!isAdmin || !isAdmin()) {
      router.replace('/');
      return;
    }
    refresh();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const interval = setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  useEffect(() => {
    const tick = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : REFRESH_INTERVAL_MS / 1000));
    }, 1000);
    return () => clearInterval(tick);
  }, [lastRefreshStr]);

  const criticalCount = providers.filter((p) => p.status === 'critical').length;
  const warningCount = providers.filter((p) => p.status === 'warning').length;
  const healthyCount = providers.filter((p) => p.status === 'healthy').length;

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="max-w-screen-xl px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.12)', color: '#a78bfa' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>Admin · Live API Monitor</h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Real-time usage across all connected AI providers</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {criticalCount > 0 && (
                <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' }}>
                  <AlertOctagon size={11} />{criticalCount} Critical
                </span>
              )}
              {warningCount > 0 && (
                <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}>
                  <AlertTriangle size={11} />{warningCount} Warning
                </span>
              )}
              {criticalCount === 0 && warningCount === 0 && healthyCount > 0 && (
                <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }}>
                  <CheckCircle size={11} />All Systems Healthy
                </span>
              )}
            </div>
            <button
              onClick={refresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }}
            >
              <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
              {isRefreshing ? 'Refreshing…' : `Refresh (${countdown}s)`}
            </button>
          </div>
        </div>

        {/* Alert banners */}
        <AlertBanners providers={providers} />

        {/* Live indicator */}
        <div className="flex items-center gap-2">
          <Activity size={12} style={{ color: '#10b981' }} />
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            Live · Auto-refreshes every {REFRESH_INTERVAL_MS / 1000}s
            {lastRefreshStr ? ` · Last updated ${lastRefreshStr}` : ''}
          </span>
        </div>

        {/* Provider cards */}
        {providers.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw size={20} className="animate-spin" style={{ color: 'var(--muted-foreground)' }} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {providers.map((p) => <ProviderCard key={p.id} provider={p} />)}
          </div>
        )}

        {/* ── Puter Live Test Panel ── */}
        <PuterTestPanel />

        {/* Summary stats */}
        {providers.length > 0 && (
          <div className="rounded-xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="text-center">
              <p className="text-2xl font-bold font-mono" style={{ color: 'var(--foreground)' }}>
                {providers.reduce((s, p) => s + p.requestsToday, 0).toLocaleString()}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Total requests today</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold font-mono" style={{ color: 'var(--foreground)' }}>
                {(providers.reduce((s, p) => s + p.tokensUsed, 0) / 1000).toFixed(0)}k
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Total tokens used</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold font-mono" style={{ color: 'var(--foreground)' }}>
                ${providers.reduce((s, p) => s + p.costToday, 0).toFixed(2)}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Est. cost today</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold font-mono" style={{ color: providers.some((p) => p.errorRate > 5) ? '#ef4444' : 'var(--foreground)' }}>
                {(providers.reduce((s, p) => s + p.errorRate, 0) / Math.max(providers.filter((p) => p.enabled).length, 1)).toFixed(1)}%
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Avg error rate</p>
            </div>
          </div>
        )}

        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          ⚠️ Providers marked <strong>offline</strong> have placeholder API keys. Configure real keys in Settings → AI Backends to enable live monitoring.
        </p>
      </div>
    </div>
  );
}
