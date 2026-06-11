'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const tokenData = [
  { day: 'Apr 12', tokens: 14200, requests: 38 },
  { day: 'Apr 13', tokens: 8900, requests: 22 },
  { day: 'Apr 14', tokens: 21300, requests: 54 },
  { day: 'Apr 15', tokens: 18700, requests: 47 },
  { day: 'Apr 16', tokens: 32100, requests: 81 },
  { day: 'Apr 17', tokens: 9400, requests: 24 },
  { day: 'Apr 18', tokens: 11200, requests: 29 },
  { day: 'Apr 19', tokens: 24800, requests: 62 },
  { day: 'Apr 20', tokens: 19600, requests: 49 },
  { day: 'Apr 21', tokens: 38400, requests: 96 },
  { day: 'Apr 22', tokens: 27300, requests: 68 },
  { day: 'Apr 23', tokens: 16100, requests: 41 },
  { day: 'Apr 24', tokens: 42700, requests: 107 },
  { day: 'Apr 25', tokens: 31200, requests: 78 },
  { day: 'Apr 26', tokens: 22900, requests: 57 },
  { day: 'Apr 27', tokens: 18300, requests: 46 },
  { day: 'Apr 28', tokens: 29600, requests: 74 },
  { day: 'Apr 29', tokens: 34100, requests: 85 },
  { day: 'Apr 30', tokens: 26800, requests: 67 },
  { day: 'May 01', tokens: 41200, requests: 103 },
  { day: 'May 02', tokens: 33700, requests: 84 },
  { day: 'May 03', tokens: 28400, requests: 71 },
  { day: 'May 04', tokens: 19200, requests: 48 },
  { day: 'May 05', tokens: 44800, requests: 112 },
  { day: 'May 06', tokens: 37300, requests: 93 },
  { day: 'May 07', tokens: 31600, requests: 79 },
  { day: 'May 08', tokens: 48200, requests: 120 },
  { day: 'May 09', tokens: 39700, requests: 99 },
  { day: 'May 10', tokens: 43100, requests: 108 },
  { day: 'May 11', tokens: 28600, requests: 71 },
];

const modelData = [
  { model: 'Ollama', requests: 612, tokens: 487300 },
  { model: 'Claude', requests: 187, tokens: 241800 },
  { model: 'GPT-4o', requests: 94, tokens: 118200 },
  { model: 'Gemini', requests: 43, tokens: 52400 },
];

const langData = [
  { name: 'TypeScript', value: 34, color: '#06b6d4' },
  { name: 'Python', value: 28, color: '#10b981' },
  { name: 'JavaScript', value: 18, color: '#f59e0b' },
  { name: 'Rust', value: 8, color: '#ef4444' },
  { name: 'SQL', value: 7, color: '#a78bfa' },
  { name: 'Other', value: 5, color: '#64748b' },
];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      className="rounded-xl px-3 py-2.5 text-xs card-glow"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <p className="font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{label}</p>
      {payload.map((p) => (
        <p key={`tooltip-${p.name}`} className="font-mono" style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' && p.value > 999 ? `${(p.value / 1000).toFixed(1)}k` : p.value}
        </p>
      ))}
    </div>
  );
}

export function TokenUsageChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={tokenData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="tokenGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
          tickLine={false}
          axisLine={false}
          interval={4}
        />
        <YAxis
          tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="tokens"
          name="Tokens"
          stroke="var(--primary)"
          strokeWidth={2}
          fill="url(#tokenGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function RequestsByModelChart() {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={modelData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="model"
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="requests" name="Requests" radius={[4, 4, 0, 0]}>
          {modelData.map((entry, index) => {
            const colors = ['#10b981', '#a78bfa', '#06b6d4', '#f59e0b'];
            return <Cell key={`cell-model-${index}`} fill={colors[index % colors.length]} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function LanguageDistributionChart() {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie
          data={langData}
          cx="50%"
          cy="50%"
          innerRadius={48}
          outerRadius={72}
          paddingAngle={3}
          dataKey="value"
        >
          {langData.map((entry) => (
            <Cell key={`cell-lang-${entry.name}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload;
            return (
              <div
                className="rounded-xl px-3 py-2 text-xs card-glow"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <p style={{ color: d.color }} className="font-semibold">{d.name}</p>
                <p style={{ color: 'var(--muted-foreground)' }}>{d.value}% of sessions</p>
              </div>
            );
          }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span style={{ color: 'var(--muted-foreground)', fontSize: '11px' }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}