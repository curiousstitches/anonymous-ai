'use client';

import React, { useState } from 'react';
import { Cpu, Settings, Bell, Keyboard, Palette, Shield } from 'lucide-react';
import ProviderCard from './ProviderCard';
import { NotificationFeedDemo } from '@/components/ui/NotificationFeed';

const settingsCategories = [
  { id: 'cat-ai', label: 'AI Backends', icon: Cpu },
  { id: 'cat-preferences', label: 'Editor Preferences', icon: Palette },
  { id: 'cat-shortcuts', label: 'Keyboard Shortcuts', icon: Keyboard },
  { id: 'cat-notifications', label: 'Notifications', icon: Bell },
  { id: 'cat-security', label: 'Security', icon: Shield },
];

const providers = [
  {
    id: 'ollama',
    name: 'Ollama (Self-hosted)',
    description: 'Run LLaMA, Mistral, CodeLlama locally — no API key needed',
    icon: '🦙',
    color: '#10b981',
    isActive: false,
    isConnected: true,
    models: ['llama3.1:70b', 'llama3.1:8b', 'codellama:34b', 'mistral:7b', 'deepseek-coder:6.7b'],
    defaultModel: 'llama3.1:70b',
    hasApiKey: false,
    hasEndpoint: true,
    endpointPlaceholder: 'http://localhost:11434',
  },
  {
    id: 'puter',
    name: 'Puter.js (Free)',
    description: 'Free unlimited access to GPT-4o, Claude 3.5 & more — no API key required',
    icon: '🆓',
    color: '#22d3ee',
    isActive: true,
    isConnected: true,
    models: ['gpt-4o', 'gpt-4o-mini', 'claude-3-5-sonnet'],
    defaultModel: 'gpt-4o',
    hasApiKey: false,
    hasEndpoint: false,
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4o, o1-mini — bring your own API key',
    icon: '⚡',
    color: '#06b6d4',
    isActive: false,
    isConnected: false,
    models: ['gpt-4o', 'gpt-4o-mini', 'o1-mini', 'o1-preview', 'gpt-3.5-turbo'],
    defaultModel: 'gpt-4o',
    hasApiKey: true,
    hasEndpoint: false,
    apiKeyPlaceholder: 'sk-proj-••••••••••••••••',
    docsUrl: 'https://platform.openai.com/api-keys',
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    description: 'Claude 3.5 Sonnet & Haiku — excellent at code explanation',
    icon: '🧠',
    color: '#a78bfa',
    isActive: false,
    isConnected: true,
    models: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229'],
    defaultModel: 'claude-3-5-sonnet-20241022',
    hasApiKey: true,
    hasEndpoint: false,
    apiKeyPlaceholder: 'sk-ant-••••••••••••••••',
    docsUrl: 'https://console.anthropic.com/keys',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Gemini 1.5 Pro — generous free tier, strong at multimodal',
    icon: '✨',
    color: '#f59e0b',
    isActive: false,
    isConnected: false,
    models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash-exp'],
    defaultModel: 'gemini-1.5-pro',
    hasApiKey: true,
    hasEndpoint: false,
    apiKeyPlaceholder: 'AIza••••••••••••••••',
    docsUrl: 'https://aistudio.google.com/app/apikey',
  },
];

const editorPreferences = [
  { id: 'pref-autocomplete', label: 'AI Autocomplete', description: 'Show inline code suggestions as you type', enabled: true },
  { id: 'pref-syntax', label: 'Syntax Highlighting in Chat', description: 'Highlight code blocks in conversation messages', enabled: true },
  { id: 'pref-linenum', label: 'Line Numbers in Code Blocks', description: 'Show line numbers in generated code', enabled: false },
  { id: 'pref-wordwrap', label: 'Word Wrap in Code Blocks', description: 'Wrap long lines instead of horizontal scroll', enabled: false },
  { id: 'pref-streaming', label: 'Streaming Responses', description: 'Show tokens as they are generated (real-time)', enabled: true },
  { id: 'pref-sound', label: 'Sound on Response Complete', description: 'Play a subtle sound when AI finishes responding', enabled: false },
];

// Notification settings defined outside component to avoid hook-in-map issue
const notificationDefaults: Record<string, boolean> = {
  'notif-complete': true,
  'notif-error': true,
  'notif-token': true,
  'notif-update': false,
};

const notificationItems = [
  { id: 'notif-complete', label: 'Response Complete', description: 'Notify when a long generation finishes' },
  { id: 'notif-error', label: 'Model Errors', description: 'Alert when AI backend returns an error' },
  { id: 'notif-token', label: 'Token Budget Warning', description: 'Warn when context window is 80% full' },
  { id: 'notif-update', label: 'CodePilot Updates', description: 'Notify about new features and model updates' },
];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className="relative inline-flex w-10 h-5 rounded-full transition-all duration-200 flex-shrink-0"
      style={{ background: enabled ? 'var(--primary)' : 'var(--border)' }}
    >
      <span
        className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200"
        style={{
          background: 'white',
          left: enabled ? '22px' : '2px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
        }}
      />
    </button>
  );
}

export default function SettingsScreen() {
  const [activeCategory, setActiveCategory] = useState('cat-ai');
  const [activeProvider, setActiveProvider] = useState('puter');
  const [preferences, setPreferences] = useState(
    Object.fromEntries(editorPreferences.map((p) => [p.id, p.enabled]))
  );
  // Notifications state lifted out of map to fix invalid hook call
  const [notifications, setNotifications] = useState<Record<string, boolean>>(notificationDefaults);

  const togglePref = (id: string) => {
    setPreferences((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleNotif = (id: string) => {
    setNotifications((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden">
      {/* Settings nav — narrow on all sizes */}
      <div
        className="w-full md:w-44 lg:w-48 flex-shrink-0 border-b md:border-b-0 md:border-r flex flex-col overflow-y-auto"
        style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
      >
        <div className="px-3 py-3 border-b hidden md:flex" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <Settings size={14} style={{ color: 'var(--primary)' }} />
            <h2 className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>Settings</h2>
          </div>
        </div>
        {/* Mobile: horizontal scroll tabs */}
        <nav className="flex md:flex-col gap-0.5 p-2 overflow-x-auto md:overflow-x-visible">
          {settingsCategories.map((cat) => {
            const CatIcon = cat.icon;
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="flex-shrink-0 md:w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap"
                style={
                  active
                    ? { background: 'rgba(124,58,237,0.12)', color: '#a78bfa' }
                    : { color: 'var(--muted-foreground)' }
                }
              >
                <CatIcon size={13} className="flex-shrink-0" />
                <span className="truncate">{cat.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content — takes remaining space */}
      <div className="flex-1 overflow-y-auto scrollbar-thin min-w-0">
        <div className="px-4 sm:px-6 lg:px-8 py-5 max-w-4xl">
          {activeCategory === 'cat-ai' && (
            <div>
              <div className="mb-5">
                <h1 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                  AI Backends
                </h1>
                <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Configure which AI models power CodePilot. One backend is active at a time. Your API keys are stored in your browser and never leave your device.
                </p>
              </div>

              {/* Active model summary */}
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5 animated-border"
                style={{ background: 'rgba(16,185,129,0.05)' }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: 'rgba(16,185,129,0.15)' }}
                >
                  🆓
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                    Puter.js (Free) is your active backend
                  </p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--muted-foreground)' }}>
                    Running gpt-4o · No API key required · Free unlimited access
                  </p>
                </div>
                <div className="ml-auto flex-shrink-0">
                  <span className="badge-green">
                    <span className="w-1.5 h-1.5 rounded-full pulse-glow" style={{ background: '#10b981' }} />
                    Live
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {providers.map((p) => (
                  <ProviderCard
                    key={p.id}
                    {...p}
                    isActive={activeProvider === p.id}
                    onSetActive={setActiveProvider}
                  />
                ))}
              </div>
            </div>
          )}

          {activeCategory === 'cat-preferences' && (
            <div>
              <div className="mb-5">
                <h1 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                  Editor Preferences
                </h1>
                <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Customize how CodePilot displays and interacts with code in your chat sessions.
                </p>
              </div>

              <div className="card-base divide-y" style={{ borderColor: 'var(--border)' }}>
                {editorPreferences.map((pref) => (
                  <div key={pref.id} className="flex items-center justify-between px-4 py-3 gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        {pref.label}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                        {pref.description}
                      </p>
                    </div>
                    <Toggle enabled={preferences[pref.id]} onChange={() => togglePref(pref.id)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeCategory === 'cat-shortcuts' && (
            <div>
              <div className="mb-5">
                <h1 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                  Keyboard Shortcuts
                </h1>
                <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Speed up your workflow with these shortcuts. Click any binding to reassign it.
                </p>
              </div>
              <div className="card-base divide-y" style={{ borderColor: 'var(--border)' }}>
                {[
                  { id: 'sc-newchat', action: 'New Chat', binding: '⌘ N' },
                  { id: 'sc-send', action: 'Send Message', binding: '↵ Enter' },
                  { id: 'sc-newline', action: 'Insert Newline', binding: '⇧ Enter' },
                  { id: 'sc-copy', action: 'Copy Last Code Block', binding: '⌘ ⇧ C' },
                  { id: 'sc-sidebar', action: 'Toggle Conversation Sidebar', binding: '⌘ B' },
                  { id: 'sc-model', action: 'Switch Active Model', binding: '⌘ M' },
                  { id: 'sc-context', action: 'Attach File Context', binding: '⌘ K' },
                  { id: 'sc-search', action: 'Search Conversations', binding: '⌘ /' },
                ].map((sc) => (
                  <div key={sc.id} className="flex items-center justify-between px-4 py-3">
                    <p className="text-sm" style={{ color: 'var(--foreground)' }}>{sc.action}</p>
                    <kbd
                      className="px-2 py-1 rounded text-xs font-mono flex-shrink-0"
                      style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--muted-foreground)' }}
                    >
                      {sc.binding}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeCategory === 'cat-notifications' && (
            <NotificationFeedDemo />
          )}

          {activeCategory === 'cat-security' && (
            <div>
              <div className="mb-5">
                <h1 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Security</h1>
                <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Manage sessions, API key storage, and data handling.
                </p>
              </div>
              <div className="space-y-4">
                <div className="card-base px-4 py-4 space-y-3">
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>API Key Storage</h3>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    All API keys are stored in your browser&apos;s local storage using AES-256 encryption. They are never transmitted to CodePilot servers.
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="badge-green">Encrypted locally</span>
                    <span className="badge-cyan">Never leaves device</span>
                  </div>
                </div>
                <div className="card-base px-4 py-4">
                  <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Active Sessions</h3>
                  {[
                    { id: 'sess-1', device: 'MacBook Pro — Chrome 124', location: 'San Francisco, CA', current: true, time: 'Now' },
                    { id: 'sess-2', device: 'iPhone 15 — Safari', location: 'San Francisco, CA', current: false, time: '2h ago' },
                  ].map((s) => (
                    <div key={s.id} className="flex items-center justify-between py-2 border-b last:border-0 gap-3" style={{ borderColor: 'var(--border)' }}>
                      <div className="min-w-0">
                        <p className="text-xs font-medium flex items-center gap-2 flex-wrap" style={{ color: 'var(--foreground)' }}>
                          <span className="truncate">{s.device}</span>
                          {s.current && <span className="badge-green text-xs flex-shrink-0">Current</span>}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.location} · {s.time}</p>
                      </div>
                      {!s.current && (
                        <button className="text-xs px-2 py-1 rounded flex-shrink-0" style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)' }}>
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}