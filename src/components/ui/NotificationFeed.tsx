'use client';

import React, { useState, useCallback } from 'react';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  Bell,
  Zap,
  MessageSquare,
  X,
  ChevronRight,
  RefreshCw,
  Eye,
  Trash2,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


export type NotificationType = 'success' | 'warning' | 'error' | 'info' | 'update' | 'chat' | 'usage';

export interface NotificationAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read?: boolean;
  actions?: NotificationAction[];
}

interface NotificationCardProps {
  notification: NotificationItem;
  onDismiss: (id: string) => void;
  onMarkRead: (id: string) => void;
  index: number;
}

const typeConfig: Record<
  NotificationType,
  { icon: React.ElementType; color: string; bg: string; border: string; glow: string }
> = {
  success: {
    icon: CheckCircle,
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.25)',
    glow: 'rgba(16,185,129,0.15)',
  },
  warning: {
    icon: AlertTriangle,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.25)',
    glow: 'rgba(245,158,11,0.15)',
  },
  error: {
    icon: XCircle,
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.25)',
    glow: 'rgba(239,68,68,0.15)',
  },
  info: {
    icon: Info,
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.08)',
    border: 'rgba(6,182,212,0.25)',
    glow: 'rgba(6,182,212,0.15)',
  },
  update: {
    icon: Zap,
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.08)',
    border: 'rgba(167,139,250,0.25)',
    glow: 'rgba(167,139,250,0.15)',
  },
  chat: {
    icon: MessageSquare,
    color: '#22d3ee',
    bg: 'rgba(34,211,238,0.08)',
    border: 'rgba(34,211,238,0.25)',
    glow: 'rgba(34,211,238,0.15)',
  },
  usage: {
    icon: Bell,
    color: '#fb923c',
    bg: 'rgba(251,146,60,0.08)',
    border: 'rgba(251,146,60,0.25)',
    glow: 'rgba(251,146,60,0.15)',
  },
};

const actionVariantStyle: Record<string, React.CSSProperties> = {
  primary: { background: 'var(--primary)', color: 'var(--primary-foreground)' },
  secondary: { background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' },
  danger: { background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' },
};

function NotificationCard({ notification, onDismiss, onMarkRead, index }: NotificationCardProps) {
  const [exiting, setExiting] = useState(false);
  const cfg = typeConfig[notification.type];
  const Icon = cfg.icon;

  const handleDismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => onDismiss(notification.id), 320);
  }, [notification.id, onDismiss]);

  const handleMarkRead = useCallback(() => {
    onMarkRead(notification.id);
  }, [notification.id, onMarkRead]);

  return (
    <div
      style={{
        animationDelay: `${index * 60}ms`,
        animationFillMode: 'both',
      }}
      className={exiting ? 'notif-exit' : 'notif-enter'}
    >
      <div
        className="relative rounded-xl overflow-hidden transition-all duration-200 hover:scale-[1.01]"
        style={{
          background: `linear-gradient(135deg, var(--card) 0%, ${cfg.bg} 100%)`,
          border: `1px solid ${notification.read ? 'var(--border)' : cfg.border}`,
          boxShadow: notification.read ? 'none' : `0 0 16px ${cfg.glow}, 0 2px 8px rgba(0,0,0,0.2)`,
        }}
      >
        {/* Unread indicator bar */}
        {!notification.read && (
          <div
            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
            style={{ background: cfg.color }}
          />
        )}

        <div className="px-4 py-3 pl-5">
          {/* Header row */}
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
              style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
            >
              <Icon size={15} style={{ color: cfg.color }} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p
                  className="text-sm font-semibold leading-tight truncate"
                  style={{ color: 'var(--foreground)' }}
                >
                  {notification.title}
                </p>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!notification.read && (
                    <button
                      onClick={handleMarkRead}
                      title="Mark as read"
                      className="w-6 h-6 rounded-md flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      <Eye size={12} />
                    </button>
                  )}
                  <button
                    onClick={handleDismiss}
                    title="Dismiss"
                    className="w-6 h-6 rounded-md flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity hover:bg-red-500/10"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>

              <p
                className="text-xs mt-0.5 leading-relaxed"
                style={{ color: 'var(--muted-foreground)' }}
              >
                {notification.message}
              </p>

              <p className="text-xs mt-1.5" style={{ color: cfg.color, opacity: 0.7 }}>
                {notification.timestamp}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          {notification.actions && notification.actions.length > 0 && (
            <div className="flex items-center gap-2 mt-3 ml-11 flex-wrap">
              {notification.actions.map((action, i) => (
                <button
                  key={i}
                  onClick={action.onClick}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 active:scale-95 hover:brightness-110"
                  style={actionVariantStyle[action.variant ?? 'secondary']}
                >
                  {action.label}
                  {action.variant === 'primary' && <ChevronRight size={11} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface NotificationFeedProps {
  notifications: NotificationItem[];
  onDismiss: (id: string) => void;
  onDismissAll: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  className?: string;
}

export default function NotificationFeed({
  notifications,
  onDismiss,
  onDismissAll,
  onMarkRead,
  onMarkAllRead,
  className = '',
}: NotificationFeedProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  if (notifications.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center py-14 rounded-xl ${className}`}
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
          style={{ background: 'var(--muted)' }}
        >
          <Bell size={20} style={{ color: 'var(--muted-foreground)' }} />
        </div>
        <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
          All caught up!
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
          No notifications right now.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bell size={15} style={{ color: 'var(--foreground)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
            Notifications
          </span>
          {unreadCount > 0 && (
            <span
              className="px-1.5 py-0.5 rounded-full text-xs font-bold"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
            >
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-all duration-150 hover:brightness-110"
              style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }}
            >
              <Eye size={11} />
              Mark all read
            </button>
          )}
          <button
            onClick={onDismissAll}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-all duration-150 hover:brightness-110"
            style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <Trash2 size={11} />
            Clear all
          </button>
        </div>
      </div>

      {/* Stacked feed */}
      <div className="space-y-2.5">
        {notifications.map((n, i) => (
          <NotificationCard
            key={n.id}
            notification={n}
            onDismiss={onDismiss}
            onMarkRead={onMarkRead}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Demo / standalone usage helper ─────────────────────────────────────── */
export function NotificationFeedDemo() {
  const [items, setItems] = useState<NotificationItem[]>([
    {
      id: 'n1',
      type: 'success',
      title: 'Response Complete',
      message: 'Your GPT-4o request finished in 1.4 s — 312 tokens used.',
      timestamp: 'Just now',
      read: false,
      actions: [
        { label: 'View Chat', onClick: () => {}, variant: 'primary' },
        { label: 'Dismiss', onClick: () => {}, variant: 'secondary' },
      ],
    },
    {
      id: 'n2',
      type: 'warning',
      title: 'Token Budget Warning',
      message: 'You have used 80% of your monthly token budget (80,000 / 100,000).',
      timestamp: '2 min ago',
      read: false,
      actions: [
        { label: 'View Usage', onClick: () => {}, variant: 'primary' },
        { label: 'Upgrade Plan', onClick: () => {}, variant: 'secondary' },
      ],
    },
    {
      id: 'n3',
      type: 'error',
      title: 'Model Error',
      message: 'Ollama backend returned a 503 — the local server may be offline.',
      timestamp: '5 min ago',
      read: false,
      actions: [
        { label: 'Retry', onClick: () => {}, variant: 'danger' },
        { label: 'Switch Model', onClick: () => {}, variant: 'secondary' },
      ],
    },
    {
      id: 'n4',
      type: 'update',
      title: 'CodePilot v2.4 Available',
      message: 'New: multi-file context, improved streaming, and 3 new themes.',
      timestamp: '1 hr ago',
      read: true,
      actions: [
        { label: "What's New", onClick: () => {}, variant: 'primary' },
      ],
    },
    {
      id: 'n5',
      type: 'info',
      title: 'Context Window Optimised',
      message: 'Older messages were summarised to keep your conversation within limits.',
      timestamp: '3 hr ago',
      read: true,
    },
    {
      id: 'n6',
      type: 'chat',
      title: 'Conversation Saved',
      message: '"React hooks deep-dive" was saved to your project context.',
      timestamp: 'Yesterday',
      read: true,
    },
  ]);

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const dismissAll = useCallback(() => setItems([]), []);

  const markRead = useCallback((id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const refresh = useCallback(() => {
    setItems((prev) => [
      {
        id: `n-${Date.now()}`,
        type: 'info',
        title: 'Refreshed',
        message: 'Notification feed refreshed successfully.',
        timestamp: 'Just now',
        read: false,
      },
      ...prev,
    ]);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
            Notifications
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Stay informed about activity, errors, and updates.
          </p>
        </div>
        <button
          onClick={refresh}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all duration-150 hover:brightness-110"
          style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }}
        >
          <RefreshCw size={12} />
          Refresh
        </button>
      </div>

      <NotificationFeed
        notifications={items}
        onDismiss={dismiss}
        onDismissAll={dismissAll}
        onMarkRead={markRead}
        onMarkAllRead={markAllRead}
      />
    </div>
  );
}
