'use client';

import React, { useState, useCallback } from 'react';
import {
  ThumbsUp,
  ThumbsDown,
  Copy,
  RotateCcw,
  User,
  Zap,
  ChevronDown,
  ChevronRight,
  Code2,
  FileText,
  Info,
  GitCommit,
  Check,
  Paperclip,
  Image as ImageIcon,
} from 'lucide-react';
import CodeBlock from './CodeBlock';

interface AttachedFileInfo {
  name: string;
  type: string;
  size?: number;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  codeBlocks?: { language: string; code: string; filename?: string }[];
  model?: string;
  tokens?: number;
  latency?: number;
  timestamp: string;
  streaming?: boolean;
  attachedFiles?: AttachedFileInfo[];
}

interface ChatMessageProps {
  message: Message;
}

interface ParsedSection {
  type: 'text' | 'code' | 'changes' | 'info';
  label: string;
  content: string;
  language?: string;
  filename?: string;
}

const modelColors: Record<string, string> = {
  'Ollama': '#10b981',
  'GPT-4o': '#06b6d4',
  'Claude 3.5': '#a78bfa',
  'Gemini 1.5': '#f59e0b',
  'GPT-5.4': '#06b6d4',
};

function parseResponseSections(content: string): ParsedSection[] {
  const sections: ParsedSection[] = [];
  const codeBlockRegex = /```(\w+)?(?:\s+([^\n]+))?\n([\s\S]*?)```/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Text before this code block
    const textBefore = content.slice(lastIndex, match.index).trim();
    if (textBefore) {
      // Check if it looks like a "changes" section (bullet points with +/- or "changed"/"updated"/"added"/"removed")
      const isChangesList = /^[-*]\s+.*(changed|updated|added|removed|fixed|modified|created|deleted)/im.test(textBefore)
        || /^[+-]\s+/m.test(textBefore);

      sections.push({
        type: isChangesList ? 'changes' : 'text',
        label: isChangesList ? 'Changes' : 'Explanation',
        content: textBefore,
      });
    }

    const lang = match[1] || 'text';
    const filename = match[2] || undefined;
    const code = match[3];

    sections.push({
      type: 'code',
      label: filename ? `Code — ${filename}` : `Code (${lang})`,
      content: code,
      language: lang,
      filename,
    });

    lastIndex = match.index + match[0].length;
  }

  // Remaining text after last code block
  const remaining = content.slice(lastIndex).trim();
  if (remaining) {
    const isInfo = /^(note|tip|warning|important|info):/i.test(remaining)
      || remaining.startsWith('>')
      || /\b(note that|keep in mind|remember|important)\b/i.test(remaining);

    sections.push({
      type: isInfo ? 'info' : 'text',
      label: isInfo ? 'Info' : 'Explanation',
      content: remaining,
    });
  }

  // If no sections were created, just return the whole content as text
  if (sections.length === 0 && content.trim()) {
    sections.push({ type: 'text', label: 'Response', content: content.trim() });
  }

  return sections;
}

function SectionIcon({ type }: { type: ParsedSection['type'] }) {
  switch (type) {
    case 'code': return <Code2 size={13} style={{ color: '#06b6d4' }} />;
    case 'changes': return <GitCommit size={13} style={{ color: '#10b981' }} />;
    case 'info': return <Info size={13} style={{ color: '#f59e0b' }} />;
    default: return <FileText size={13} style={{ color: '#a78bfa' }} />;
  }
}

function sectionBorderColor(type: ParsedSection['type']): string {
  switch (type) {
    case 'code': return 'rgba(6,182,212,0.25)';
    case 'changes': return 'rgba(16,185,129,0.25)';
    case 'info': return 'rgba(245,158,11,0.25)';
    default: return 'var(--border)';
  }
}

function sectionHeaderBg(type: ParsedSection['type']): string {
  switch (type) {
    case 'code': return 'rgba(6,182,212,0.08)';
    case 'changes': return 'rgba(16,185,129,0.08)';
    case 'info': return 'rgba(245,158,11,0.08)';
    default: return 'rgba(124,58,237,0.06)';
  }
}

function CollapsibleSection({ section, defaultOpen }: { section: ParsedSection; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className="rounded-xl overflow-hidden mb-2"
      style={{ border: `1px solid ${sectionBorderColor(section.type)}` }}
    >
      {/* Header / toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors"
        style={{ background: sectionHeaderBg(section.type), color: 'var(--foreground)' }}
      >
        <div className="flex items-center gap-2">
          <SectionIcon type={section.type} />
          <span>{section.label}</span>
        </div>
        {open ? (
          <ChevronDown size={13} style={{ color: 'var(--muted-foreground)' }} />
        ) : (
          <ChevronRight size={13} style={{ color: 'var(--muted-foreground)' }} />
        )}
      </button>

      {/* Content */}
      {open && (
        <div style={{ background: 'var(--card)' }}>
          {section.type === 'code' ? (
            <CodeBlock
              code={section.content}
              language={section.language || 'text'}
              filename={section.filename}
            />
          ) : (
            <div
              className="px-4 py-3 text-sm leading-relaxed"
              style={{ color: 'var(--foreground)', whiteSpace: 'pre-wrap', lineHeight: '1.7' }}
            >
              {section.content}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return '';
  if (bytes < 1024) return ` ${bytes}B`;
  if (bytes < 1024 * 1024) return ` ${(bytes / 1024).toFixed(1)}KB`;
  return ` ${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [liked, setLiked] = useState<'up' | 'down' | null>(null);
  const [copied, setCopied] = useState(false);

  const isUser = message.role === 'user';
  const modelColor = message.model ? (modelColors[message.model] || '#94a3b8') : '#94a3b8';

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [message.content]);

  // Parse assistant response into sections
  const sections = !isUser && !message.streaming
    ? parseResponseSections(message.content)
    : [];

  const hasMultipleSections = sections.length > 1;

  return (
    <div className={`group flex gap-3 px-4 py-4 fade-in ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
        style={
          isUser
            ? { background: 'rgba(124, 58, 237, 0.2)', color: '#a78bfa' }
            : { background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }
        }
      >
        {isUser ? <User size={14} /> : <Zap size={14} />}
      </div>

      {/* Content */}
      <div className={`flex-1 min-w-0 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Header */}
        <div className={`flex items-center gap-2 mb-1.5 ${isUser ? 'flex-row-reverse' : ''}`}>
          <span className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>
            {isUser ? 'You' : 'CodePilot'}
          </span>
          {!isUser && message.model && (
            <span
              className="text-xs px-1.5 py-0.5 rounded font-mono"
              style={{
                background: `${modelColor}15`,
                color: modelColor,
                border: `1px solid ${modelColor}25`,
              }}
            >
              {message.model}
            </span>
          )}
          {!isUser && message.tokens && (
            <span className="text-xs token-count" style={{ color: 'var(--muted-foreground)' }}>
              {message.tokens.toLocaleString()} tokens
            </span>
          )}
          {!isUser && message.latency && (
            <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
              {message.latency}ms
            </span>
          )}
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {message.timestamp}
          </span>
        </div>

        {/* User message bubble */}
        {isUser && (
          <div
            className="rounded-xl rounded-tr-sm px-4 py-3 max-w-[85%] text-sm leading-relaxed"
            style={{
              background: 'rgba(124, 58, 237, 0.15)',
              border: '1px solid rgba(124, 58, 237, 0.25)',
              color: 'var(--foreground)',
            }}
          >
            {/* Attached file chips */}
            {message.attachedFiles && message.attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {message.attachedFiles.map((f, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono"
                    style={{
                      background: 'rgba(124,58,237,0.15)',
                      border: '1px solid rgba(124,58,237,0.3)',
                      color: '#a78bfa',
                    }}
                  >
                    {f.type.startsWith('image/') ? <ImageIcon size={10} /> : <Paperclip size={10} />}
                    {f.name}{formatFileSize(f.size)}
                  </span>
                ))}
              </div>
            )}
            <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7' }}>{message.content}</p>
          </div>
        )}

        {/* Assistant streaming bubble */}
        {!isUser && message.streaming && (
          <div
            className="rounded-xl rounded-tl-sm px-4 py-3 max-w-[85%] text-sm leading-relaxed"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
            }}
          >
            <span className="streaming-cursor">{message.content}</span>
          </div>
        )}

        {/* Assistant response — collapsible sections */}
        {!isUser && !message.streaming && sections.length > 0 && (
          <div className="w-full max-w-[90%]">
            {sections.map((section, idx) => (
              <CollapsibleSection
                key={idx}
                section={section}
                defaultOpen={!hasMultipleSections || section.type !== 'text' || idx === 0}
              />
            ))}
          </div>
        )}

        {/* Actions (assistant only) */}
        {!isUser && !message.streaming && (
          <div className="flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setLiked(liked === 'up' ? null : 'up')}
              className="p-1.5 rounded-md transition-all duration-150 active:scale-95"
              style={{ color: liked === 'up' ? '#10b981' : 'var(--muted-foreground)' }}
              title="Good response"
            >
              <ThumbsUp size={13} />
            </button>
            <button
              onClick={() => setLiked(liked === 'down' ? null : 'down')}
              className="p-1.5 rounded-md transition-all duration-150 active:scale-95"
              style={{ color: liked === 'down' ? '#ef4444' : 'var(--muted-foreground)' }}
              title="Bad response"
            >
              <ThumbsDown size={13} />
            </button>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-md transition-all duration-150 active:scale-95"
              style={{ color: copied ? '#10b981' : 'var(--muted-foreground)' }}
              title="Copy message"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
            </button>
            <button
              className="p-1.5 rounded-md transition-all duration-150 active:scale-95"
              style={{ color: 'var(--muted-foreground)' }}
              title="Regenerate response"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}