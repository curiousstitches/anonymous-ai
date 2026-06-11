'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Camera, Check, AlertTriangle, Loader2, Keyboard, Cpu, Bell, Shield, ChevronRight, Trash2, X,  } from 'lucide-react';
import { toast } from 'sonner';
import Icon from '@/components/ui/AppIcon';


type ProfileForm = {
  displayName: string;
  email: string;
  bio: string;
  website: string;
};

const navItems = [
  { id: 'profile-nav-account', label: 'Account', icon: User },
  { id: 'profile-nav-preferences', label: 'Preferences', icon: Cpu },
  { id: 'profile-nav-shortcuts', label: 'Shortcuts', icon: Keyboard },
  { id: 'profile-nav-notifications', label: 'Notifications', icon: Bell },
  { id: 'profile-nav-security', label: 'Security', icon: Shield },
  { id: 'profile-nav-danger', label: 'Danger Zone', icon: AlertTriangle },
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

function DeleteModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  const [confirmText, setConfirmText] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div
        className="w-full max-w-md rounded-2xl p-6 card-glow fade-in"
        style={{ background: 'var(--card)', border: '1px solid rgba(239,68,68,0.3)' }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(239,68,68,0.15)' }}
            >
              <Trash2 size={18} style={{ color: '#ef4444' }} />
            </div>
            <div>
              <h3 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>
                Delete Account
              </h3>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                This action is permanent and irreversible
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg" style={{ color: 'var(--muted-foreground)' }} aria-label="Close dialog">
            <X size={16} />
          </button>
        </div>

        <div
          className="rounded-lg px-4 py-3 mb-4 text-sm"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}
        >
          Deleting your account will permanently remove all conversations, uploaded context files, and API key configurations. You will not be able to recover this data.
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>
            Type <span className="font-mono" style={{ color: '#ef4444' }}>delete my account</span> to confirm
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="input-base"
            placeholder="delete my account"
          />
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-ghost flex-1 justify-center">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={confirmText !== 'delete my account'}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-150 active:scale-95"
            style={
              confirmText === 'delete my account'
                ? { background: '#ef4444', color: 'white' }
                : { background: 'var(--muted)', color: 'var(--muted-foreground)', cursor: 'not-allowed' }
            }
          >
            Delete Account Permanently
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfileAccount() {
  const [activeSection, setActiveSection] = useState('profile-nav-account');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [prefs, setPrefs] = useState({
    'pref-autocomplete': true,
    'pref-streaming': true,
    'pref-sound': false,
    'pref-telemetry': false,
    'pref-compact': false,
  });

  const form = useForm<ProfileForm>({
    defaultValues: {
      displayName: 'Alex Chen',
      email: 'alex.chen@codepilot.dev',
      bio: 'Senior fullstack engineer. TypeScript, Python, Rust. Building developer tools.',
      website: 'https://alexchen.dev',
    },
  });

  const handleSave = (data: ProfileForm) => {
    setSaveStatus('saving');
    setIsSaving(true);
    // Backend integration point: PATCH /api/user/profile
    setTimeout(() => {
      setSaveStatus('saved');
      setIsSaving(false);
      toast.success('Profile updated successfully');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 1200);
  };

  const togglePref = (id: string) => {
    setPrefs((prev) => ({ ...prev, [id]: !(prev as Record<string, boolean>)[id] }));
  };

  return (
    <>
      {showDeleteModal && (
        <DeleteModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => {
            setShowDeleteModal(false);
            toast.error('Account deleted — you have been signed out');
          }}
        />
      )}

      <div className="flex h-full overflow-hidden">
        {/* Settings nav */}
        <div
          className="w-56 flex-shrink-0 border-r flex flex-col overflow-y-auto"
          style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
        >
          {/* User summary */}
          <div className="px-4 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3">
              <div
                className="relative w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
              >
                AC
                <div
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                  style={{ background: '#10b981', borderColor: 'var(--card)' }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>
                  Alex Chen
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>
                  alex.chen@codepilot.dev
                </p>
              </div>
            </div>
          </div>

          <nav className="p-2 space-y-0.5 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150"
                  style={
                    active
                      ? {
                          background: item.id === 'profile-nav-danger' ?'rgba(239,68,68,0.1)' :'rgba(124,58,237,0.12)',
                          color: item.id === 'profile-nav-danger' ? '#ef4444' : '#a78bfa',
                        }
                      : {
                          color: item.id === 'profile-nav-danger' ? '#ef4444' : 'var(--muted-foreground)',
                        }
                  }
                >
                  <Icon size={15} />
                  {item.label}
                  {active && <ChevronRight size={12} className="ml-auto" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="max-w-2xl px-6 lg:px-8 py-6">

            {/* Account section */}
            {activeSection === 'profile-nav-account' && (
              <div className="space-y-6 fade-in">
                <div>
                  <h1 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Account</h1>
                  <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                    Manage your display name, email, and public profile information.
                  </p>
                </div>

                {/* Avatar */}
                <div className="card-base p-5">
                  <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                    Profile Photo
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold"
                        style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
                      >
                        AC
                      </div>
                      <button
                        className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-150 active:scale-95"
                        style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
                        aria-label="Change profile photo"
                      >
                        <Camera size={13} />
                      </button>
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Alex Chen</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                        Member since Jan 2026 · 936 conversations
                      </p>
                      <button className="text-xs mt-2" style={{ color: 'var(--accent)' }}>
                        Upload new photo
                      </button>
                    </div>
                  </div>
                </div>

                {/* Profile form */}
                <form onSubmit={form.handleSubmit(handleSave)} className="card-base p-5 space-y-4">
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                    Profile Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>
                        Display Name
                      </label>
                      <input
                        type="text"
                        className="input-base text-sm"
                        {...form.register('displayName', { required: 'Name is required' })}
                      />
                      {form.formState.errors.displayName && (
                        <p className="mt-1 text-xs" style={{ color: 'var(--red)' }}>
                          {form.formState.errors.displayName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="input-base text-sm"
                        {...form.register('email', { required: 'Email is required' })}
                      />
                      {form.formState.errors.email && (
                        <p className="mt-1 text-xs" style={{ color: 'var(--red)' }}>
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>
                      Bio
                    </label>
                    <p className="text-xs mb-1.5" style={{ color: 'var(--muted-foreground)' }}>
                      A short description visible to other users on shared workspaces
                    </p>
                    <textarea
                      rows={3}
                      className="input-base text-sm resize-none"
                      {...form.register('bio')}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>
                      Website
                    </label>
                    <input
                      type="url"
                      className="input-base text-sm"
                      placeholder="https://yoursite.dev"
                      {...form.register('website')}
                    />
                  </div>

                  {/* Sticky save bar */}
                  <div
                    className="flex items-center justify-between pt-3 border-t"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      {saveStatus === 'saved' ? (
                        <span className="flex items-center gap-1" style={{ color: '#10b981' }}>
                          <Check size={12} /> Changes saved
                        </span>
                      ) : (
                        'Unsaved changes will be lost if you navigate away'
                      )}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => form.reset()}
                        className="btn-ghost text-xs"
                      >
                        Discard
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-150 active:scale-95"
                        style={
                          saveStatus === 'saved'
                            ? { background: 'rgba(16,185,129,0.15)', color: '#10b981' }
                            : { background: 'var(--primary)', color: 'white' }
                        }
                      >
                        {isSaving ? (
                          <><Loader2 size={12} className="animate-spin" /> Saving...</>
                        ) : saveStatus === 'saved' ? (
                          <><Check size={12} /> Saved!</>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                    </div>
                  </div>
                </form>

                {/* Stats */}
                <div className="card-base p-5">
                  <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                    Account Stats
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { id: 'stat-convs', label: 'Conversations', value: '936' },
                      { id: 'stat-tokens', label: 'Tokens Used', value: '847k' },
                      { id: 'stat-files', label: 'Context Files', value: '8' },
                      { id: 'stat-days', label: 'Days Active', value: '127' },
                    ].map((s) => (
                      <div key={s.id} className="text-center">
                        <p className="text-2xl font-bold token-count" style={{ color: 'var(--foreground)' }}>{s.value}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Preferences section */}
            {activeSection === 'profile-nav-preferences' && (
              <div className="space-y-6 fade-in">
                <div>
                  <h1 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Preferences</h1>
                  <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                    Set your default AI model, coding language, and interface preferences.
                  </p>
                </div>

                <div className="card-base p-5 space-y-4">
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>AI Defaults</h3>

                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>
                      Default AI Model
                    </label>
                    <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>
                      Used for all new conversations unless overridden in chat
                    </p>
                    <select
                      className="input-base text-sm"
                      defaultValue="ollama"
                      aria-label="Default AI model"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      <option value="ollama">Ollama / LLaMA 3.1 70B (Self-hosted)</option>
                      <option value="gpt4o">GPT-4o (OpenAI)</option>
                      <option value="claude">Claude 3.5 Sonnet (Anthropic)</option>
                      <option value="gemini">Gemini 1.5 Pro (Google)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>
                      Default Coding Language
                    </label>
                    <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>
                      Pre-selects this language in the chat input bar
                    </p>
                    <select
                      className="input-base text-sm"
                      defaultValue="typescript"
                      aria-label="Default coding language"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {['Auto-detect', 'TypeScript', 'Python', 'JavaScript', 'Rust', 'Go', 'Java', 'SQL', 'Bash'].map((l) => (
                        <option key={`lang-opt-${l}`} value={l.toLowerCase().replace(' ', '-')}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="card-base divide-y" style={{ borderColor: 'var(--border)' }}>
                  <div className="px-5 py-3">
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Interface</h3>
                  </div>
                  {[
                    { id: 'pref-autocomplete', label: 'AI Autocomplete', desc: 'Show inline suggestions as you type in the input bar' },
                    { id: 'pref-streaming', label: 'Streaming Responses', desc: 'Display tokens in real-time as the model generates them' },
                    { id: 'pref-sound', label: 'Audio Cue on Completion', desc: 'Play a subtle sound when the AI finishes a response' },
                    { id: 'pref-compact', label: 'Compact Message Layout', desc: 'Reduce vertical spacing between chat messages' },
                    { id: 'pref-telemetry', label: 'Usage Analytics', desc: 'Share anonymous usage data to improve CodePilot (no code is shared)' },
                  ].map((p) => (
                    <div key={p.id} className="flex items-center justify-between px-5 py-4">
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{p.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{p.desc}</p>
                      </div>
                      <Toggle enabled={prefs[p.id as keyof typeof prefs]} onChange={() => togglePref(p.id)} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Danger zone */}
            {activeSection === 'profile-nav-danger' && (
              <div className="space-y-6 fade-in">
                <div>
                  <h1 className="text-xl font-semibold" style={{ color: '#ef4444' }}>Danger Zone</h1>
                  <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                    Destructive actions. These cannot be undone.
                  </p>
                </div>

                <div
                  className="card-base p-5 space-y-4"
                  style={{ borderColor: 'rgba(239,68,68,0.3)' }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                        Clear All Conversations
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                        Permanently delete all 936 conversation threads and messages
                      </p>
                    </div>
                    <button
                      className="px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 active:scale-95"
                      style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' }}
                      onClick={() => toast.error('All conversations cleared')}
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="h-px" style={{ background: 'rgba(239,68,68,0.15)' }} />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                        Revoke All API Keys
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                        Remove all stored API keys for OpenAI, Anthropic, and Gemini
                      </p>
                    </div>
                    <button
                      className="px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 active:scale-95"
                      style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' }}
                      onClick={() => toast.success('All API keys revoked')}
                    >
                      Revoke Keys
                    </button>
                  </div>

                  <div className="h-px" style={{ background: 'rgba(239,68,68,0.15)' }} />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#ef4444' }}>
                        Delete Account
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                        Permanently delete your account, all data, and conversation history
                      </p>
                    </div>
                    <button
                      className="px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 active:scale-95"
                      style={{ background: '#ef4444', color: 'white' }}
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeSection === 'profile-nav-notifications' && (
              <div className="space-y-6 fade-in">
                <div>
                  <h1 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Notifications</h1>
                  <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                    Control when CodePilot sends you alerts and updates.
                  </p>
                </div>
                <div className="card-base divide-y" style={{ borderColor: 'var(--border)' }}>
                  {[
                    { id: 'nf-complete', label: 'Generation Complete', desc: 'Notify when a long AI response finishes', on: true },
                    { id: 'nf-error', label: 'Model Errors', desc: 'Alert when the AI backend returns an error or timeout', on: true },
                    { id: 'nf-token', label: 'Context Window Warning', desc: 'Warn when context is 80% full and should be trimmed', on: true },
                    { id: 'nf-update', label: 'Product Updates', desc: 'Notify about new CodePilot features and model additions', on: false },
                    { id: 'nf-weekly', label: 'Weekly Usage Summary', desc: 'Email digest of your token usage and top languages', on: false },
                  ].map((n) => {
                    const [on, setOn] = React.useState(n.on);
                    return (
                      <div key={n.id} className="flex items-center justify-between px-5 py-4">
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{n.label}</p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{n.desc}</p>
                        </div>
                        <Toggle enabled={on} onChange={setOn} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Security */}
            {activeSection === 'profile-nav-security' && (
              <div className="space-y-6 fade-in">
                <div>
                  <h1 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Security</h1>
                  <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                    Manage your password, sessions, and two-factor authentication.
                  </p>
                </div>

                <div className="card-base p-5 space-y-4">
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Change Password</h3>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>
                      Current Password
                    </label>
                    <input type="password" className="input-base text-sm" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>
                      New Password
                    </label>
                    <input type="password" className="input-base text-sm" placeholder="Min. 8 characters" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>
                      Confirm New Password
                    </label>
                    <input type="password" className="input-base text-sm" placeholder="Re-enter new password" />
                  </div>
                  <button className="btn-primary text-xs py-2">Update Password</button>
                </div>

                <div className="card-base p-5">
                  <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                    Two-Factor Authentication
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm" style={{ color: 'var(--foreground)' }}>Authenticator App</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                        Use an app like 1Password or Authy to generate codes
                      </p>
                    </div>
                    <span className="badge-amber">Not enabled</span>
                  </div>
                  <button
                    className="mt-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 active:scale-95"
                    style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  >
                    Enable 2FA
                  </button>
                </div>
              </div>
            )}

            {/* Shortcuts */}
            {activeSection === 'profile-nav-shortcuts' && (
              <div className="space-y-6 fade-in">
                <div>
                  <h1 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Keyboard Shortcuts</h1>
                  <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                    All active shortcuts in CodePilot. Click a binding to reassign it.
                  </p>
                </div>
                <div className="card-base divide-y" style={{ borderColor: 'var(--border)' }}>
                  {[
                    { id: 'ksc-newchat', action: 'New Chat', binding: '⌘ N', category: 'Chat' },
                    { id: 'ksc-send', action: 'Send Message', binding: '↵ Enter', category: 'Chat' },
                    { id: 'ksc-newline', action: 'Insert Newline', binding: '⇧ Enter', category: 'Chat' },
                    { id: 'ksc-copy', action: 'Copy Last Code Block', binding: '⌘ ⇧ C', category: 'Code' },
                    { id: 'ksc-sidebar', action: 'Toggle Conversation Sidebar', binding: '⌘ B', category: 'Navigation' },
                    { id: 'ksc-model', action: 'Switch Active Model', binding: '⌘ M', category: 'AI' },
                    { id: 'ksc-context', action: 'Attach File Context', binding: '⌘ K', category: 'Context' },
                    { id: 'ksc-search', action: 'Search Conversations', binding: '⌘ /', category: 'Navigation' },
                    { id: 'ksc-settings', action: 'Open Settings', binding: '⌘ ,', category: 'Navigation' },
                  ].map((sc) => (
                    <div key={sc.id} className="flex items-center justify-between px-5 py-3">
                      <div>
                        <p className="text-sm" style={{ color: 'var(--foreground)' }}>{sc.action}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{sc.category}</p>
                      </div>
                      <kbd
                        className="px-2 py-1 rounded text-xs font-mono cursor-pointer transition-all duration-150 hover:border-primary"
                        style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--muted-foreground)' }}
                      >
                        {sc.binding}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}