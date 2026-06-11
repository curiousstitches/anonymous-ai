'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  RefreshCw,
  Activity,
  AlertTriangle,
  AlertOctagon,
  CheckCircle,
  Info,
  LogIn,
  Zap,
  BarChart2,
  Server,
  MessageSquare,
  Filter,
  Trash2,
  Download,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getEvents, clearEvents, logEvent, type PlatformEvent, type EventCategory, type EventSeverity } from '@/lib/eventLog';

const CATEGORY_LABELS: Record<EventCategory, string> = {
  auth: 'Auth',
  api: 'API',
  usage: 'Usage',
  system: 'System',
  chat: 'Chat',
};

const CATEGORY_ICONS: Record<EventCategory, React.ReactNode> = {
  auth: <LogIn size={13} />,
  api: <Zap size={13} />,
  usage: <BarChart2 size={13} />,
  system: <Server size={13} />,
  chat: <MessageSquare size={13} />,
};

const CATEGORY_COLORS: Record<EventCategory, string> = {
  auth: '#a78bfa',
  api: '#06b6d4',
  usage: '#f59e0b',
  system: '#6b7280',
  chat: '#10b981',
};

const SEVERITY_COLORS: Record<EventSeverity, string> = {
  info: '#6b7280',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

function SeverityIcon({ severity }: { severity: EventSeverity }) {
  const color = SEVERITY_COLORS[severity];
  switch (severity) {
    case 'error': return <AlertOctagon size={13} style={{ color }} />;
    case 'warning': return <AlertTriangle size={13} style={{ color }} />;
    case 'success': return <CheckCircle size={13} style={{ color }} />;
    default: return <Info size={13} style={{ color }} />;
  }
}

function formatTimestamp(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  const s = date.getSeconds().toString().padStart(2, '0');
  const mo = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${mo}/${d} ${h}:${m}:${s}`;
}

function timeAgo(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  return `${diffHr}h ago`;
}

function EventRow({ event }: { event: PlatformEvent }) {
  const [expanded, setExpanded] = useState(false);
  const catColor = CATEGORY_COLORS[event.category];

  return (
    <div
      className="border-b last:border-b-0 transition-colors cursor-pointer"
      style={{ borderColor: 'var(--border)' }}
      onClick={() => setExpanded((v) => !v)}
    >
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02]">
        {/* Severity dot */}
        <div className="flex-shrink-0">
          <SeverityIcon severity={event.severity} />
        </div>

        {/* Category badge */}
        <span
          className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
          style={{ background: `${catColor}15`, color: catColor, border: `1px solid ${catColor}30` }}
        >
          {CATEGORY_ICONS[event.category]}
          {CATEGORY_LABELS[event.category]}
        </span>

        {/* Title */}
        <span className="flex-1 text-xs font-medium truncate" style={{ color: 'var(--foreground)' }}>
          {event.title}
        </span>

        {/* User */}
        {event.user && (
          <span className="text-xs font-mono truncate max-w-[120px] hidden sm:block" style={{ color: 'var(--muted-foreground)' }}>
            {event.user}
          </span>
        )}

        {/* Timestamp */}
        <span className="text-xs font-mono flex-shrink-0" style={{ color: 'var(--muted-foreground)' }}>
          {timeAgo(event.timestamp)}
        </span>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div
          className="px-4 pb-3 ml-6 space-y-2"
          style={{ borderLeft: `2px solid ${catColor}40`, marginLeft: '2.5rem' }}
        >
          <p className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
            {formatTimestamp(event.timestamp)} · ID: {event.id}
          </p>
          {event.detail && (
            <p className="text-xs" style={{ color: 'var(--foreground)' }}>{event.detail}</p>
          )}
          {event.provider && (
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Provider: <span style={{ color: 'var(--foreground)' }}>{event.provider}</span>
            </p>
          )}
          {event.meta && Object.keys(event.meta).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(event.meta).map(([k, v]) => (
                <span
                  key={k}
                  className="text-xs font-mono px-2 py-0.5 rounded"
                  style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}
                >
                  {k}: {String(v)}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminEventLog() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<PlatformEvent[]>([]);
  const [filterCategory, setFilterCategory] = useState<EventCategory | 'all'>('all');
  const [filterSeverity, setFilterSeverity] = useState<EventSeverity | 'all'>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState('');

  const refresh = useCallback(() => {
    const cat = filterCategory === 'all' ? undefined : filterCategory;
    const raw = getEvents(200, cat);
    const filtered = filterSeverity === 'all' ? raw : raw.filter((e) => e.severity === filterSeverity);
    setEvents(filtered);
    setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  }, [filterCategory, filterSeverity]);

  useEffect(() => {
    if (!isAdmin || !isAdmin()) {
      router.replace('/');
      return;
    }
    logEvent('system', 'info', 'Admin viewed event log');
    refresh();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, refresh]);

  const handleClear = () => {
    clearEvents();
    logEvent('system', 'warning', 'Admin cleared event log');
    refresh();
  };

  const handleExport = () => {
    const data = events.map((e) => ({
      id: e.id,
      timestamp: e.timestamp.toISOString(),
      category: e.category,
      severity: e.severity,
      title: e.title,
      detail: e.detail || '',
      user: e.user || '',
      provider: e.provider || '',
      ...e.meta,
    }));
    const csv = [
      Object.keys(data[0] || {}).join(','),
      ...data.map((row) => Object.values(row).map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codepilot-events-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Summary counts
  const errorCount = events.filter((e) => e.severity === 'error').length;
  const warningCount = events.filter((e) => e.severity === 'warning').length;
  const successCount = events.filter((e) => e.severity === 'success').length;

  const categories: EventCategory[] = ['auth', 'api', 'usage', 'system', 'chat'];
  const severities: EventSeverity[] = ['info', 'success', 'warning', 'error'];

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="max-w-screen-xl px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(124,58,237,0.12)', color: '#a78bfa' }}
            >
              <ShieldCheck size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>
                Admin · Event Log
              </h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                Real-time platform activity — auth, API calls, usage alerts &amp; system events
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Auto-refresh toggle */}
            <button
              onClick={() => setAutoRefresh((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: autoRefresh ? 'rgba(16,185,129,0.1)' : 'var(--muted)',
                color: autoRefresh ? '#10b981' : 'var(--muted-foreground)',
                border: `1px solid ${autoRefresh ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`,
              }}
            >
              <Activity size={11} />
              {autoRefresh ? 'Live' : 'Paused'}
            </button>

            <button
              onClick={refresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }}
            >
              <RefreshCw size={11} />
              Refresh
            </button>

            <button
              onClick={handleExport}
              disabled={events.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }}
            >
              <Download size={11} />
              Export CSV
            </button>

            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' }}
            >
              <Trash2 size={11} />
              Clear Log
            </button>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl p-4 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <p className="text-2xl font-bold font-mono" style={{ color: 'var(--foreground)' }}>{events.length}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Total events</p>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ background: 'var(--card)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <p className="text-2xl font-bold font-mono" style={{ color: errorCount > 0 ? '#ef4444' : 'var(--foreground)' }}>{errorCount}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Errors</p>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ background: 'var(--card)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <p className="text-2xl font-bold font-mono" style={{ color: warningCount > 0 ? '#f59e0b' : 'var(--foreground)' }}>{warningCount}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Warnings</p>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ background: 'var(--card)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <p className="text-2xl font-bold font-mono" style={{ color: '#10b981' }}>{successCount}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Successes</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5" style={{ color: 'var(--muted-foreground)' }}>
            <Filter size={13} />
            <span className="text-xs">Filter:</span>
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-1 flex-wrap">
            <button
              onClick={() => setFilterCategory('all')}
              className="text-xs px-2.5 py-1 rounded-full font-medium transition-all"
              style={{
                background: filterCategory === 'all' ? 'rgba(124,58,237,0.15)' : 'var(--muted)',
                color: filterCategory === 'all' ? '#a78bfa' : 'var(--muted-foreground)',
                border: `1px solid ${filterCategory === 'all' ? 'rgba(124,58,237,0.3)' : 'var(--border)'}`,
              }}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium transition-all"
                style={{
                  background: filterCategory === cat ? `${CATEGORY_COLORS[cat]}15` : 'var(--muted)',
                  color: filterCategory === cat ? CATEGORY_COLORS[cat] : 'var(--muted-foreground)',
                  border: `1px solid ${filterCategory === cat ? CATEGORY_COLORS[cat] + '40' : 'var(--border)'}`,
                }}
              >
                {CATEGORY_ICONS[cat]}
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          <div className="w-px h-4" style={{ background: 'var(--border)' }} />

          {/* Severity filter */}
          <div className="flex items-center gap-1 flex-wrap">
            <button
              onClick={() => setFilterSeverity('all')}
              className="text-xs px-2.5 py-1 rounded-full font-medium transition-all"
              style={{
                background: filterSeverity === 'all' ? 'rgba(124,58,237,0.15)' : 'var(--muted)',
                color: filterSeverity === 'all' ? '#a78bfa' : 'var(--muted-foreground)',
                border: `1px solid ${filterSeverity === 'all' ? 'rgba(124,58,237,0.3)' : 'var(--border)'}`,
              }}
            >
              All severity
            </button>
            {severities.map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium capitalize transition-all"
                style={{
                  background: filterSeverity === sev ? `${SEVERITY_COLORS[sev]}15` : 'var(--muted)',
                  color: filterSeverity === sev ? SEVERITY_COLORS[sev] : 'var(--muted-foreground)',
                  border: `1px solid ${filterSeverity === sev ? SEVERITY_COLORS[sev] + '40' : 'var(--border)'}`,
                }}
              >
                <SeverityIcon severity={sev} />
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2">
          <Activity size={12} style={{ color: autoRefresh ? '#10b981' : 'var(--muted-foreground)' }} />
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {autoRefresh ? 'Auto-refreshes every 5s' : 'Paused'}{lastRefreshed ? ` · Last updated ${lastRefreshed}` : ''}
          </span>
        </div>

        {/* Event list */}
        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3" style={{ color: 'var(--muted-foreground)' }}>
              <Activity size={28} style={{ opacity: 0.3 }} />
              <p className="text-sm">No events recorded yet</p>
              <p className="text-xs">Events will appear here as users interact with the platform</p>
            </div>
          ) : (
            <div>
              {events.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>

        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          Events are stored in-memory and reset on server restart. Up to 500 events are retained.
        </p>
      </div>
    </div>
  );
}
