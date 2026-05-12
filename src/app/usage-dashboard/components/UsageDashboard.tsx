'use client';

import React, { useState } from 'react';
import {
  Zap,
  Activity,
  Clock,
  AlertTriangle,
  DollarSign,
  Code2,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  RefreshCw,
} from 'lucide-react';
import { TokenUsageChart, RequestsByModelChart, LanguageDistributionChart } from './UsageCharts';

const dailyRows = [
  { id: 'day-001', date: 'May 11, 2026', requests: 71, tokens: 28600, model: 'Ollama', avgLatency: 284, cost: '$0.00', topLang: 'TypeScript' },
  { id: 'day-002', date: 'May 10, 2026', requests: 108, tokens: 43100, model: 'Ollama', avgLatency: 301, cost: '$0.00', topLang: 'Python' },
  { id: 'day-003', date: 'May 09, 2026', requests: 99, tokens: 39700, model: 'Claude', avgLatency: 892, cost: '$1.24', topLang: 'TypeScript' },
  { id: 'day-004', date: 'May 08, 2026', requests: 120, tokens: 48200, model: 'Ollama', avgLatency: 318, cost: '$0.00', topLang: 'Rust' },
  { id: 'day-005', date: 'May 07, 2026', requests: 79, tokens: 31600, model: 'Ollama', avgLatency: 267, cost: '$0.00', topLang: 'Python' },
  { id: 'day-006', date: 'May 06, 2026', requests: 93, tokens: 37300, model: 'GPT-4o', avgLatency: 1140, cost: '$2.87', topLang: 'TypeScript' },
  { id: 'day-007', date: 'May 05, 2026', requests: 112, tokens: 44800, model: 'Ollama', avgLatency: 295, cost: '$0.00', topLang: 'JavaScript' },
  { id: 'day-008', date: 'May 04, 2026', requests: 48, tokens: 19200, model: 'Ollama', avgLatency: 271, cost: '$0.00', topLang: 'SQL' },
  { id: 'day-009', date: 'May 03, 2026', requests: 71, tokens: 28400, model: 'Claude', avgLatency: 847, cost: '$0.89', topLang: 'Python' },
  { id: 'day-010', date: 'May 02, 2026', requests: 84, tokens: 33700, model: 'Ollama', avgLatency: 288, cost: '$0.00', topLang: 'TypeScript' },
  { id: 'day-011', date: 'May 01, 2026', requests: 103, tokens: 41200, model: 'Ollama', avgLatency: 312, cost: '$0.00', topLang: 'JavaScript' },
];

const modelColors: Record<string, string> = {
  Ollama: '#10b981',
  Claude: '#a78bfa',
  'GPT-4o': '#06b6d4',
  Gemini: '#f59e0b',
};

interface KpiCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend?: { direction: 'up' | 'down'; value: string; positive: boolean };
  alert?: boolean;
  accent?: string;
}

function KpiCard({ title, value, subtitle, icon, trend, alert, accent }: KpiCardProps) {
  return (
    <div
      className="card-base p-5 flex flex-col gap-3 card-glow"
      style={
        alert
          ? { borderColor: 'rgba(245,158,11,0.4)', background: 'rgba(245,158,11,0.05)' }
          : {}
      }
    >
      <div className="flex items-center justify-between">
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--muted-foreground)', letterSpacing: '0.06em' }}
        >
          {title}
        </p>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: accent ? `${accent}18` : 'var(--muted)', color: accent || 'var(--muted-foreground)' }}
        >
          {icon}
        </div>
      </div>
      <div>
        <p
          className="text-3xl font-bold token-count leading-none"
          style={{ color: alert ? '#f59e0b' : 'var(--foreground)' }}
        >
          {value}
        </p>
        <p className="text-xs mt-1.5" style={{ color: 'var(--muted-foreground)' }}>
          {subtitle}
        </p>
      </div>
      {trend && (
        <div className="flex items-center gap-1.5">
          {trend.direction === 'up' ? (
            <TrendingUp size={13} style={{ color: trend.positive ? '#10b981' : '#ef4444' }} />
          ) : (
            <TrendingDown size={13} style={{ color: trend.positive ? '#10b981' : '#ef4444' }} />
          )}
          <span
            className="text-xs font-medium"
            style={{ color: trend.positive ? '#10b981' : '#ef4444' }}
          >
            {trend.value}
          </span>
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            vs yesterday
          </span>
        </div>
      )}
    </div>
  );
}

export default function UsageDashboard() {
  const [dateRange, setDateRange] = useState('30d');
  const [page, setPage] = useState(1);
  const rowsPerPage = 7;
  const totalPages = Math.ceil(dailyRows.length / rowsPerPage);
  const visibleRows = dailyRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="max-w-screen-2xl px-6 lg:px-8 xl:px-10 2xl:px-16 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>
              Usage Dashboard
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
              Token consumption, request rates, and model performance across all sessions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="flex rounded-lg p-0.5"
              style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
            >
              {['7d', '30d', '90d'].map((r) => (
                <button
                  key={`range-${r}`}
                  onClick={() => setDateRange(r)}
                  className="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150"
                  style={
                    dateRange === r
                      ? { background: 'var(--card)', color: 'var(--foreground)' }
                      : { color: 'var(--muted-foreground)' }
                  }
                >
                  {r}
                </button>
              ))}
            </div>
            <button className="btn-ghost text-xs gap-1.5">
              <RefreshCw size={13} />
              Refresh
            </button>
            <button className="btn-ghost text-xs gap-1.5">
              <Download size={13} />
              Export CSV
            </button>
          </div>
        </div>

        {/* KPI Bento Grid — 3+3 layout */}
        {/* Plan: 6 cards → grid-cols-3 → 2 rows of 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
          <KpiCard
            title="Tokens This Month"
            value="847.2k"
            subtitle="of 2M limit — 42% used"
            icon={<Zap size={16} />}
            accent="#7c3aed"
            trend={{ direction: 'up', value: '+12.4%', positive: false }}
          />
          <KpiCard
            title="Requests Today"
            value="71"
            subtitle="28,600 tokens in 71 calls"
            icon={<Activity size={16} />}
            accent="#06b6d4"
            trend={{ direction: 'down', value: '-34.3%', positive: true }}
          />
          <KpiCard
            title="Avg Response Time"
            value="312ms"
            subtitle="Ollama self-hosted · p95: 890ms"
            icon={<Clock size={16} />}
            accent="#10b981"
            trend={{ direction: 'up', value: '+18ms', positive: false }}
          />
          <KpiCard
            title="Context Tokens"
            value="12.4k"
            subtitle="Active in current conversation"
            icon={<Code2 size={16} />}
            accent="#a78bfa"
            alert={false}
            trend={{ direction: 'up', value: '+3.1k', positive: false }}
          />
          <KpiCard
            title="Est. BYOK Cost"
            value="$5.00"
            subtitle="Claude + GPT-4o sessions only"
            icon={<DollarSign size={16} />}
            accent="#f59e0b"
            alert={false}
            trend={{ direction: 'up', value: '+$1.24', positive: false }}
          />
          <KpiCard
            title="Context Window"
            value="78%"
            subtitle="Warning: approaching limit — clear old messages"
            icon={<AlertTriangle size={16} />}
            accent="#f59e0b"
            alert={true}
            trend={{ direction: 'up', value: '+14%', positive: false }}
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
          {/* Token usage over time — spans 2 cols */}
          <div className="card-base p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                  Token Usage — Last 30 Days
                </h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                  Daily token consumption across all models
                </p>
              </div>
              <span className="badge-purple">847.2k total</span>
            </div>
            <TokenUsageChart />
          </div>

          {/* Language distribution */}
          <div className="card-base p-5">
            <div className="mb-4">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                Languages Asked About
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                Detected from conversation context
              </p>
            </div>
            <LanguageDistributionChart />
          </div>
        </div>

        {/* Requests by model chart */}
        <div className="card-base p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                Requests by Model
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                Total requests routed to each AI backend this month
              </p>
            </div>
            <div className="flex items-center gap-2">
              {[
                { key: 'legend-ollama', label: 'Ollama', color: '#10b981' },
                { key: 'legend-claude', label: 'Claude', color: '#a78bfa' },
                { key: 'legend-gpt', label: 'GPT-4o', color: '#06b6d4' },
                { key: 'legend-gemini', label: 'Gemini', color: '#f59e0b' },
              ].map((l) => (
                <div key={l.key} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <RequestsByModelChart />
        </div>

        {/* Daily breakdown table */}
        <div className="card-base overflow-hidden">
          <div
            className="flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: 'var(--border)' }}
          >
            <div>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                Daily Breakdown
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                Per-day usage metrics — {dailyRows.length} days recorded
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} style={{ color: 'var(--muted-foreground)' }} />
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                May 2026
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Date', 'Requests', 'Tokens', 'Primary Model', 'Avg Latency', 'Top Language', 'Est. Cost'].map((h) => (
                    <th
                      key={`th-${h}`}
                      className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide"
                      style={{ color: 'var(--muted-foreground)', letterSpacing: '0.05em' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row, i) => (
                  <tr
                    key={row.id}
                    className="transition-colors"
                    style={{
                      borderBottom: '1px solid var(--border)',
                      background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(124,58,237,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background =
                        i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)';
                    }}
                  >
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--foreground)' }}>
                      {row.date}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono token-count" style={{ color: 'var(--foreground)' }}>
                      {row.requests}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono token-count" style={{ color: 'var(--foreground)' }}>
                      {(row.tokens / 1000).toFixed(1)}k
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-mono"
                        style={{
                          background: `${modelColors[row.model] || '#64748b'}18`,
                          color: modelColors[row.model] || '#64748b',
                          border: `1px solid ${modelColors[row.model] || '#64748b'}30`,
                        }}
                      >
                        {row.model}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono token-count" style={{ color: 'var(--foreground)' }}>
                      {row.avgLatency}ms
                    </td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
                      {row.topLang}
                    </td>
                    <td
                      className="px-4 py-3 text-xs font-mono token-count"
                      style={{ color: row.cost === '$0.00' ? 'var(--muted-foreground)' : '#10b981' }}
                    >
                      {row.cost}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div
            className="flex items-center justify-between px-5 py-3 border-t"
            style={{ borderColor: 'var(--border)' }}
          >
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Showing {(page - 1) * rowsPerPage + 1}–{Math.min(page * rowsPerPage, dailyRows.length)} of {dailyRows.length} days
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-2.5 py-1.5 rounded-lg text-xs transition-all duration-150 active:scale-95"
                style={
                  page === 1
                    ? { color: 'var(--muted-foreground)', cursor: 'not-allowed' }
                    : { color: 'var(--foreground)', background: 'var(--muted)' }
                }
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={`page-${i + 1}`}
                  onClick={() => setPage(i + 1)}
                  className="w-7 h-7 rounded-lg text-xs font-mono transition-all duration-150 active:scale-95"
                  style={
                    page === i + 1
                      ? { background: 'var(--primary)', color: 'white' }
                      : { color: 'var(--muted-foreground)', background: 'transparent' }
                  }
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-2.5 py-1.5 rounded-lg text-xs transition-all duration-150 active:scale-95"
                style={
                  page === totalPages
                    ? { color: 'var(--muted-foreground)', cursor: 'not-allowed' }
                    : { color: 'var(--foreground)', background: 'var(--muted)' }
                }
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}