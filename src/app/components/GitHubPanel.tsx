'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GitBranch, Star, Lock, Unlock, RefreshCw, X, ExternalLink, Key, AlertCircle, Loader2 } from 'lucide-react';

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3572a5',
  Rust: '#dea584',
  Go: '#00add8',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Ruby: '#701516',
  PHP: '#4f5d95',
  Swift: '#f05138',
  Kotlin: '#a97bff',
  Shell: '#89e051',
  CSS: '#563d7c',
  HTML: '#e34c26',
};

interface Repo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  private: boolean;
  html_url: string;
  updated_at: string;
}

interface GitHubPanelProps {
  onOpenInChat: (message: string) => void;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export default function GitHubPanel({ onOpenInChat }: GitHubPanelProps) {
  const [tokenInput, setTokenInput] = useState('');
  const [savedToken, setSavedToken] = useState('');
  const [username, setUsername] = useState('');
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUserAndRepos = useCallback(async (token: string) => {
    setLoading(true);
    setError('');
    try {
      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      };

      const userRes = await fetch('https://api.github.com/user', { headers });
      if (!userRes.ok) {
        const msg = userRes.status === 401 ? 'Invalid token — check your PAT and try again.' : `GitHub API error ${userRes.status}`;
        throw new Error(msg);
      }
      const user = await userRes.json();
      setUsername(user.login);

      const reposRes = await fetch('https://api.github.com/user/repos?sort=updated&per_page=30&affiliation=owner,collaborator', { headers });
      if (!reposRes.ok) throw new Error(`Failed to fetch repos: ${reposRes.status}`);
      const repoData: Repo[] = await reposRes.json();
      setRepos(repoData);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to connect to GitHub';
      setError(msg);
      setSavedToken('');
      localStorage.removeItem('codepilot_github_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('codepilot_github_token');
    if (stored) {
      setSavedToken(stored);
      fetchUserAndRepos(stored);
    }
  }, [fetchUserAndRepos]);

  function handleConnect() {
    const t = tokenInput.trim();
    if (!t) return;
    localStorage.setItem('codepilot_github_token', t);
    setSavedToken(t);
    setTokenInput('');
    fetchUserAndRepos(t);
  }

  function handleDisconnect() {
    localStorage.removeItem('codepilot_github_token');
    setSavedToken('');
    setUsername('');
    setRepos([]);
    setError('');
  }

  function handleOpenInChat(repoName: string) {
    onOpenInChat(`I want to work on the **${repoName}** repository. Please help me with coding tasks for this project.`);
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.15)' }}>
          <GitBranch size={18} style={{ color: '#a78bfa' }} />
        </div>
        <div>
          <h2 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>GitHub Integration</h2>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Connect your GitHub account to browse and work on repos</p>
        </div>
      </div>

      {!savedToken ? (
        /* ── Not connected ─────────────────────────────── */
        <div
          className="rounded-xl p-6 border"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Key size={16} style={{ color: 'var(--muted-foreground)' }} />
            <h3 className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Connect with a Personal Access Token</h3>
          </div>
          <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>
            Generate a token at{' '}
            <a
              href="https://github.com/settings/tokens/new?scopes=repo&description=CodePilot"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-80"
              style={{ color: '#a78bfa' }}
            >
              github.com/settings/tokens
            </a>{' '}
            with <code className="px-1 py-0.5 rounded text-xs" style={{ background: 'var(--muted)' }}>repo</code> scope.
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
              className="flex-1 px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500"
              style={{
                background: 'var(--muted)',
                border: '1px solid var(--border)',
                color: 'var(--foreground)',
              }}
            />
            <button
              onClick={handleConnect}
              disabled={!tokenInput.trim()}
              className="px-4 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: '#7c3aed', color: '#fff' }}
            >
              Connect
            </button>
          </div>
          {error && (
            <div className="mt-3 flex items-center gap-2 text-xs text-red-400">
              <AlertCircle size={13} />
              {error}
            </div>
          )}
        </div>
      ) : (
        /* ── Connected ─────────────────────────────────── */
        <div>
          {/* Status bar */}
          <div
            className="flex items-center justify-between px-4 py-3 rounded-xl mb-4 border"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                @{username}
              </span>
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>connected</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchUserAndRepos(savedToken)}
                disabled={loading}
                className="p-1.5 rounded-lg transition-colors disabled:opacity-50"
                style={{ color: 'var(--muted-foreground)' }}
                title="Refresh"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              </button>
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors"
                style={{ color: 'var(--muted-foreground)', background: 'var(--muted)' }}
              >
                <X size={12} />
                Disconnect
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-xs text-red-400 mb-3 px-1">
              <AlertCircle size={13} />
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin" style={{ color: 'var(--muted-foreground)' }} />
            </div>
          )}

          {/* Repo list */}
          {!loading && repos.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs mb-3 px-1" style={{ color: 'var(--muted-foreground)' }}>
                {repos.length} repositories — sorted by recently updated
              </p>
              {repos.map((repo) => (
                <div
                  key={repo.id}
                  className="rounded-xl p-4 border transition-all hover:border-purple-500/40"
                  style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm truncate" style={{ color: 'var(--foreground)' }}>
                          {repo.name}
                        </span>
                        {repo.private ? (
                          <span className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                            <Lock size={10} /> Private
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
                            <Unlock size={10} /> Public
                          </span>
                        )}
                        {repo.language && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{
                              background: `${LANG_COLORS[repo.language] || '#6b7280'}22`,
                              color: LANG_COLORS[repo.language] || '#9ca3af',
                            }}
                          >
                            {repo.language}
                          </span>
                        )}
                      </div>
                      {repo.description && (
                        <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--muted-foreground)' }}>
                          {repo.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                          <Star size={11} />
                          {repo.stargazers_count}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                          Updated {timeAgo(repo.updated_at)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: 'var(--muted-foreground)' }}
                        title="Open on GitHub"
                      >
                        <ExternalLink size={14} />
                      </a>
                      <button
                        onClick={() => handleOpenInChat(repo.full_name)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95"
                        style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)' }}
                      >
                        Open in Chat
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && repos.length === 0 && !error && (
            <div className="text-center py-12" style={{ color: 'var(--muted-foreground)' }}>
              <GitBranch size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No repositories found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
