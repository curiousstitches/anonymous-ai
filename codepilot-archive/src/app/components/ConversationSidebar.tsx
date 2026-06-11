'use client';

import React, { useState } from 'react';
import { Search, MessageSquare, Trash2, Plus, Clock, Archive } from 'lucide-react';
import { Conversation } from '@/lib/services/conversationService';

const langColors: Record<string, string> = {
  TypeScript: '#06b6d4',
  Python: '#10b981',
  JavaScript: '#f59e0b',
  SQL: '#a78bfa',
  Rust: '#ef4444',
  Dockerfile: '#64748b',
  YAML: '#f59e0b',
  'Auto-detect': '#94a3b8',
  Go: '#06b6d4',
  Java: '#f59e0b',
  Bash: '#10b981',
};

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface ConversationSidebarProps {
  open: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (conv: Conversation) => void;
  onDeleteConversation: (id: string) => void;
  onNewConversation: () => void;
}

export default function ConversationSidebar({
  open,
  onClose,
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  onNewConversation,
}: ConversationSidebarProps) {
  const [search, setSearch] = useState('');
  const [hoveredConv, setHoveredConv] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.language.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await onDeleteConversation(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      className={`flex flex-col border-b md:border-b-0 md:border-r sidebar-transition overflow-hidden ${
        open
          ? 'h-48 md:h-full md:w-72 w-full' :'h-0 md:h-full md:w-0 w-full'
      }`}
      style={{ borderColor: 'var(--border)', background: 'var(--muted)', flexShrink: 0 }}
    >
      {open && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2">
              <Archive size={14} style={{ color: 'var(--primary)' }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                Archives
              </span>
              <span
                className="text-xs px-1.5 py-0.5 rounded-full font-mono"
                style={{ background: 'var(--border)', color: 'var(--muted-foreground)' }}
              >
                {conversations.length}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={onNewConversation}
                className="p-1.5 rounded-md transition-colors"
                style={{ color: 'var(--primary)' }}
                aria-label="New conversation"
                title="New conversation"
              >
                <Plus size={14} />
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded-md transition-colors"
                style={{ color: 'var(--muted-foreground)' }}
                aria-label="Close conversation list"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="px-3 py-2">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-base pl-8 text-xs py-2"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto scrollbar-thin px-2 space-y-0.5 pb-4">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <MessageSquare size={28} style={{ color: 'var(--muted-foreground)' }} />
                <p className="mt-2 text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                  No conversations yet
                </p>
                <p className="mt-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  Start a new chat to see your history here
                </p>
                <button
                  onClick={onNewConversation}
                  className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 active:scale-95"
                  style={{ background: 'rgba(124,58,237,0.15)', color: 'var(--primary)', border: '1px solid rgba(124,58,237,0.25)' }}
                >
                  <Plus size={12} />
                  New Conversation
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageSquare size={28} style={{ color: 'var(--muted-foreground)' }} />
                <p className="mt-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  No conversations found
                </p>
              </div>
            ) : (
              filtered.map((conv) => (
                <div
                  key={conv.id}
                  className="relative group px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150"
                  style={{
                    background: activeConversationId === conv.id
                      ? 'rgba(124, 58, 237, 0.12)'
                      : hoveredConv === conv.id
                      ? 'var(--border)'
                      : 'transparent',
                    borderLeft: activeConversationId === conv.id ? '2px solid var(--primary)' : '2px solid transparent',
                    opacity: deletingId === conv.id ? 0.5 : 1,
                  }}
                  onClick={() => onSelectConversation(conv)}
                  onMouseEnter={() => setHoveredConv(conv.id)}
                  onMouseLeave={() => setHoveredConv(null)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className="text-xs font-medium leading-snug truncate flex-1"
                      style={{ color: activeConversationId === conv.id ? '#a78bfa' : 'var(--foreground)' }}
                    >
                      {conv.title}
                    </p>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 flex-shrink-0">
                      <button
                        onClick={(e) => handleDelete(e, conv.id)}
                        className="p-0.5 rounded transition-colors hover:text-red-400"
                        style={{ color: 'var(--muted-foreground)' }}
                        aria-label="Delete conversation"
                        disabled={deletingId === conv.id}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span
                      className="text-xs px-1.5 py-0.5 rounded font-mono"
                      style={{
                        background: `${langColors[conv.language] || '#64748b'}18`,
                        color: langColors[conv.language] || '#64748b',
                        border: `1px solid ${langColors[conv.language] || '#64748b'}30`,
                      }}
                    >
                      {conv.language}
                    </span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      <Clock size={10} />
                      {formatRelativeTime(conv.updatedAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}