'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AppLogo from './ui/AppLogo';
import { MessageSquare, BarChart3, FolderOpen, Settings, User, ChevronLeft, ChevronRight, Zap, Activity, Plus, LogOut, ShieldCheck, Gauge, ScrollText, Palette, X,  } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const navItems = [
  {
    key: 'nav-chat',
    label: 'Chat',
    href: '/',
    icon: MessageSquare,
    badge: null,
  },
  {
    key: 'nav-usage',
    label: 'Usage',
    href: '/usage-dashboard',
    icon: BarChart3,
    badge: null,
  },
  {
    key: 'nav-projects',
    label: 'Projects',
    href: '/project-context-manager',
    icon: FolderOpen,
    badge: '3',
  },
  {
    key: 'nav-themes',
    label: 'Themes',
    href: '/theme-dashboard',
    icon: Palette,
    badge: null,
  },
  {
    key: 'nav-settings',
    label: 'Settings',
    href: '/settings-api-configuration',
    icon: Settings,
    badge: null,
  },
  {
    key: 'nav-profile',
    label: 'Profile',
    href: '/profile-account',
    icon: User,
    badge: null,
  },
];

const modelStatusMap: Record<string, { color: string; label: string }> = {
  ollama: { color: '#10b981', label: 'Ollama / LLaMA 3' },
  openai: { color: '#06b6d4', label: 'GPT-4o' },
  anthropic: { color: '#a78bfa', label: 'Claude 3.5' },
  gemini: { color: '#f59e0b', label: 'Gemini 1.5 Pro' },
};

const activeModel = 'ollama';

export default function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, isAdmin } = useAuth();
  const [tokenUsed] = useState(847_230);
  const [tokenLimit] = useState(2_000_000);
  const [adminModeActive, setAdminModeActive] = useState(false);

  const tokenPct = Math.round((tokenUsed / tokenLimit) * 100);
  const model = modelStatusMap[activeModel];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      onMobileClose();
      router.replace('/sign-up-login-screen');
      router.refresh();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Close mobile drawer when navigating
  const handleNavClick = () => {
    onMobileClose();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo + collapse toggle */}
      <div
        className="flex items-center justify-between px-3 py-4 border-b"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className={`flex items-center gap-2 overflow-hidden ${collapsed ? 'justify-center w-full' : ''}`}>
          <AppLogo size={28} />
          {!collapsed && (
            <span className="font-bold text-base gradient-text whitespace-nowrap">
              CodePilot
            </span>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg transition-colors hidden lg:flex"
            style={{ color: 'var(--muted-foreground)' }}
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* New Chat button */}
      <div className="px-3 pt-3 pb-2">
        {collapsed ? (
          <Link href="/" onClick={handleNavClick}>
            <button
              className="w-full flex items-center justify-center p-2.5 rounded-lg transition-all duration-150 active:scale-95"
              style={{ background: 'var(--primary)', color: 'white' }}
              title="New Chat"
            >
              <Plus size={16} />
            </button>
          </Link>
        ) : (
          <Link href="/" onClick={handleNavClick}>
            <button className="btn-primary w-full text-xs py-2">
              <Plus size={14} />
              New Chat
            </button>
          </Link>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto scrollbar-thin">
        {!collapsed && (
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>
            Navigation
          </p>
        )}
        {navItems.map((item) => {
          const NavIcon = item.icon;
          const active = isActive(item.href);

          if (collapsed) {
            return (
              <Link key={item.key} href={item.href} title={item.label} onClick={handleNavClick}>
                <div
                  className={`flex items-center justify-center p-2.5 rounded-lg transition-all duration-150 cursor-pointer mb-0.5 ${
                    active ? 'active' : ''
                  } nav-item`}
                  style={
                    active
                      ? {
                          background: 'rgba(124, 58, 237, 0.15)',
                          color: '#a78bfa',
                        }
                      : {}
                  }
                >
                  <NavIcon size={18} />
                </div>
              </Link>
            );
          }

          return (
            <Link key={item.key} href={item.href} onClick={handleNavClick}>
              <div
                className={`nav-item ${active ? 'active' : ''}`}
                style={
                  active
                    ? {
                        background: 'rgba(124, 58, 237, 0.15)',
                        color: '#a78bfa',
                        borderLeft: '2px solid var(--primary)',
                      }
                    : {}
                }
              >
                <NavIcon size={16} />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full font-mono"
                    style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          );
        })}

        {/* Admin section — always visible to admins, no toggle needed on mobile */}
        {user && isAdmin && isAdmin() && (
          <div className="mt-2">
            {!collapsed && (
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-widest" style={{ color: '#a78bfa' }}>
                Admin
              </p>
            )}
            <div className="space-y-0.5">
              <Link href="/admin/api-usage" onClick={handleNavClick}>
                <div
                  className={`nav-item ${isActive('/admin/api-usage') ? 'active' : ''}`}
                  style={
                    isActive('/admin/api-usage')
                      ? { background: 'rgba(124,58,237,0.15)', color: '#a78bfa', borderLeft: '2px solid var(--primary)' }
                      : { color: '#a78bfa' }
                  }
                >
                  {collapsed ? <Gauge size={18} /> : (
                    <>
                      <Gauge size={14} />
                      <span className="flex-1 text-xs">API Monitor</span>
                      <span
                        className="text-xs px-1 py-0.5 rounded font-mono"
                        style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', fontSize: '9px' }}
                      >
                        LIVE
                      </span>
                    </>
                  )}
                </div>
              </Link>
              <Link href="/admin/event-log" onClick={handleNavClick}>
                <div
                  className={`nav-item ${isActive('/admin/event-log') ? 'active' : ''}`}
                  style={
                    isActive('/admin/event-log')
                      ? { background: 'rgba(124,58,237,0.15)', color: '#a78bfa', borderLeft: '2px solid var(--primary)' }
                      : { color: '#a78bfa' }
                  }
                >
                  {collapsed ? <ScrollText size={18} /> : (
                    <>
                      <ScrollText size={14} />
                      <span className="flex-1 text-xs">Event Log</span>
                    </>
                  )}
                </div>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Model status + token usage */}
      {!collapsed && (
        <div className="px-3 py-3 border-t space-y-3" style={{ borderColor: 'var(--border)' }}>
          {/* Active model */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: 'var(--muted)' }}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: model.color, boxShadow: `0 0 6px ${model.color}` }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium truncate" style={{ color: 'var(--foreground)' }}>
                {model.label}
              </p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                Active model
              </p>
            </div>
            <Zap size={12} style={{ color: model.color }} />
          </div>

          {/* Token usage */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                Tokens this month
              </span>
              <span className="text-xs token-count" style={{ color: 'var(--muted-foreground)' }}>
                {(tokenUsed / 1000).toFixed(0)}k / {(tokenLimit / 1000).toFixed(0)}k
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${tokenPct}%`,
                  background: tokenPct > 80 ? 'var(--red)' : tokenPct > 60 ? 'var(--amber)' : 'var(--primary)',
                }}
              />
            </div>
            <p className="text-xs mt-1 text-right token-count" style={{ color: tokenPct > 80 ? 'var(--red)' : 'var(--muted-foreground)' }}>
              {tokenPct}% used
            </p>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-2">
            <Activity size={12} className="color-cycle" />
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Live · Last updated just now
            </span>
          </div>

          {/* User info + sign out */}
          {user && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium truncate" style={{ color: 'var(--foreground)' }}>
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>
                  {user?.email}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="p-1.5 rounded-lg transition-colors flex-shrink-0"
                style={{ color: 'var(--muted-foreground)' }}
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}

          {/* Admin badge — desktop only toggle */}
          {user && isAdmin && isAdmin() && (
            <div
              className="hidden lg:flex items-center justify-between px-3 py-2 rounded-lg"
              style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={12} style={{ color: '#a78bfa' }} />
                <span className="text-xs font-medium" style={{ color: '#a78bfa' }}>Admin Mode</span>
              </div>
              <span
                className="text-xs px-1.5 py-0.5 rounded font-mono"
                style={{ background: 'rgba(124,58,237,0.2)', color: '#a78bfa' }}
              >
                ON
              </span>
            </div>
          )}
        </div>
      )}

      {/* Collapsed: sign out button */}
      {collapsed && user && (
        <div className="px-2 py-2 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center p-2 rounded-lg transition-colors"
            style={{ color: 'var(--muted-foreground)' }}
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      )}

      {/* Expand button when collapsed */}
      {collapsed && (
        <div className="px-2 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center p-2 rounded-lg transition-colors"
            style={{ color: 'var(--muted-foreground)' }}
            aria-label="Expand sidebar"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0 border-r sidebar-transition overflow-hidden"
        style={{
          width: collapsed ? '64px' : '240px',
          background: 'var(--card)',
          borderColor: 'var(--border)',
        }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-72 border-r lg:hidden sidebar-transition ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        {/* Mobile drawer header with close button */}
        <div className="flex items-center justify-between px-3 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <AppLogo size={28} />
            <span className="font-bold text-base gradient-text">CodePilot</span>
          </div>
          <button
            onClick={onMobileClose}
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--muted-foreground)', background: 'var(--muted)' }}
            aria-label="Close navigation"
          >
            <X size={16} />
          </button>
        </div>
        {sidebarContent}
      </aside>
    </>
  );
}