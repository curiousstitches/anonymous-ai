'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PanelLeft, Zap, AlertTriangle, BarChart3, Plus, Bell, X, Hammer, FolderOpen } from 'lucide-react';
import { useChat } from '@/lib/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import { conversationService, Conversation } from '@/lib/services/conversationService';
import ConversationSidebar from './ConversationSidebar';
import ChatMessage from './ChatMessage';
import ChatInputBar, { AttachedFile } from './ChatInputBar';
import BuilderPanel from './BuilderPanel';
import { getPuterStreamingCompletion, PuterMessage } from '@/lib/ai/puterClient';
import { logEvent } from '@/lib/eventLog';
import toast from 'react-hot-toast';

interface ChatMsg {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  model?: string;
  tokens?: number;
  latency?: number;
  streaming?: boolean;
  codeBlocks?: { language: string; code: string; filename?: string }[];
  attachedFiles?: { name: string; type: string; size?: number }[];
}

// Usage alert thresholds
const USAGE_WARN_THRESHOLD  = 50_000;
const USAGE_ALERT_THRESHOLD = 80_000;
const USAGE_LIMIT           = 100_000;

interface UsageAlert {
  id: string;
  level: 'warning' | 'critical';
  message: string;
}

// ─── System prompts ───────────────────────────────────────────────────────────

/** Chat mode — helpful coding assistant, still generates real code */
const CHAT_SYSTEM_MESSAGE = {
  role: 'system' as const,
  content: `You are CodePilot, an expert AI software engineer and code builder.
Your primary job is to WRITE COMPLETE, RUNNABLE CODE — not to explain how to write it.

Rules:
1. Always output full file contents, never partial snippets or pseudo-code.
2. Every code block MUST include a filename comment on the first line (e.g. // src/index.ts or # main.py).
3. Use proper markdown fenced code blocks with the correct language identifier.
4. Organize the response clearly with code blocks first, then a changes summary, then a detailed final explanation of the operation.
5. If the user asks a question rather than a build request, answer concisely then offer to build a working example.
6. Prefer TypeScript over JavaScript unless told otherwise.
7. Include all imports, exports, and boilerplate — the code must run as-is.`,
};

/** Builder mode — full project scaffold generator */
const BUILDER_SYSTEM_MESSAGE = {
  role: 'system' as const,
  content: `You are CodePilot Builder, an expert AI software engineer that generates complete, production-ready project scaffolds.

When the user describes an app or feature, you MUST:
1. Output a file tree first using a \`\`\`filetree block showing every file you will create.
2. Then output EVERY file in full, one fenced code block per file.
3. Each code block header must be: \`\`\`<language> <filepath>  (e.g. \`\`\`typescript src/index.ts)
4. Include ALL boilerplate: package.json / requirements.txt / Makefile / README.md as appropriate.
5. All code must be complete and runnable — no TODOs, no placeholders, no "add your logic here".
6. After all files, add a concise changes section and then a detailed end-of-operation explanation.
7. If the request is ambiguous, make reasonable assumptions and state them briefly before the file tree.

You are a builder, not an advisor. Generate code, not instructions.`,
};

function formatTime(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

function generateTitle(content: string): string {
  const trimmed = content.trim();
  if (trimmed.length <= 50) return trimmed;
  return trimmed.substring(0, 47) + '...';
}

function buildUserMessageContent(
  text: string,
  files?: AttachedFile[]
): string | { type: string; [key: string]: unknown }[] {
  if (!files || files.length === 0) return text;
  const parts: { type: string; [key: string]: unknown }[] = [];
  if (text) parts.push({ type: 'text', text });
  for (const file of files) {
    if (file.type.startsWith('image/')) {
      parts.push({ type: 'image_url', image_url: { url: file.dataUri, detail: 'auto' } });
    } else if (file.type === 'application/pdf') {
      parts.push({ type: 'file', file: { file_data: file.dataUri, filename: file.name } });
    } else {
      try {
        const base64 = file.dataUri.split(',')[1];
        const decoded = atob(base64);
        parts.push({ type: 'text', text: `\n\n--- File: ${file.name} ---\n${decoded}\n--- End of ${file.name} ---` });
      } catch { /* skip */ }
    }
  }
  return parts.length === 1 && parts[0].type === 'text' ? (parts[0].text as string) : parts;
}

/** Map a Puter model label to the actual model ID Puter expects */
function resolvePuterModelId(label: string): string {
  if (label.includes('GPT-4o Mini')) return 'gpt-4o-mini';
  if (label.includes('Claude'))      return 'claude-3-5-sonnet';
  return 'gpt-4o';
}

export default function ChatInterface() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [convSidebarOpen, setConvSidebarOpen] = useState(true);
  const [tokenCount, setTokenCount] = useState(0);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingConversation, setLoadingConversation] = useState(false);
  // Default to Puter GPT-4o
  const [selectedModel, setSelectedModel] = useState('GPT-4o (Puter)');
  const [selectedLanguage, setSelectedLanguage] = useState('Auto-detect');
  const [isPuterStreaming, setIsPuterStreaming] = useState(false);
  const [usageAlerts, setUsageAlerts] = useState<UsageAlert[]>([]);
  const [builderMode, setBuilderMode] = useState(false);
  const [showBuilderPanel, setShowBuilderPanel] = useState(false);
  const alertedThresholdsRef = useRef<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingMsgIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(0);
  const conversationHistoryRef = useRef<{ role: 'user' | 'assistant'; content: string | { type: string; [key: string]: unknown }[] }[]>([]);

  // Puter is the default — any model with "(Puter)" routes through puterClient
  const isPuterModel = selectedModel.includes('(Puter)') || !selectedModel.includes('(');

  const { response, fullResponse, isLoading, error, sendMessage } = useChat(
    'OPEN_AI',
    'gpt-4o',
    true
  );

  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  const dismissAlert = useCallback((id: string) => {
    setUsageAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  useEffect(() => {
    const pct = (tokenCount / USAGE_LIMIT) * 100;
    if (pct >= 100 && !alertedThresholdsRef.current.has('limit')) {
      alertedThresholdsRef.current.add('limit');
      setUsageAlerts((prev) => [...prev.filter((a) => a.id !== 'limit'), {
        id: 'limit', level: 'critical',
        message: `Token limit reached (${tokenCount.toLocaleString()} / ${USAGE_LIMIT.toLocaleString()}). Responses may be cut short.`,
      }]);
      logEvent('usage', 'error', 'Token limit reached', { user: user?.email, detail: `${tokenCount} tokens used`, meta: { tokenCount, limit: USAGE_LIMIT } });
    } else if (tokenCount >= USAGE_ALERT_THRESHOLD && !alertedThresholdsRef.current.has('alert')) {
      alertedThresholdsRef.current.add('alert');
      setUsageAlerts((prev) => [...prev.filter((a) => a.id !== 'alert'), {
        id: 'alert', level: 'critical',
        message: `High token usage (${tokenCount.toLocaleString()} / ${USAGE_LIMIT.toLocaleString()} — ${pct.toFixed(0)}%). Consider starting a new conversation.`,
      }]);
    } else if (tokenCount >= USAGE_WARN_THRESHOLD && !alertedThresholdsRef.current.has('warn')) {
      alertedThresholdsRef.current.add('warn');
      setUsageAlerts((prev) => [...prev.filter((a) => a.id !== 'warn'), {
        id: 'warn', level: 'warning',
        message: `Approaching token limit (${tokenCount.toLocaleString()} / ${USAGE_LIMIT.toLocaleString()}).`,
      }]);
    }
  }, [tokenCount, user?.email]);

  // Handle streaming response updates (for non-Puter providers)
  useEffect(() => {
    if (!streamingMsgIdRef.current) return;
    const msgId = streamingMsgIdRef.current;
    if (response) {
      setMessages((prev) =>
        prev.map((m) => m.id === msgId ? { ...m, content: response, streaming: true } : m)
      );
    }
    if (!isLoading && fullResponse) {
      const elapsed = Date.now() - startTimeRef.current;
      const content = typeof response === 'string' ? response : '';
      const tokens = fullResponse?.[fullResponse.length - 1]?.usage?.total_tokens;
      if (tokens) setTokenCount((prev) => prev + tokens);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msgId ? { ...m, content, streaming: false, latency: elapsed, tokens } : m
        )
      );
      conversationHistoryRef.current = [
        ...conversationHistoryRef.current,
        { role: 'assistant', content },
      ];
      streamingMsgIdRef.current = null;
    }
  }, [response, isLoading, fullResponse]);

  const loadConversations = useCallback(async () => {
    if (!user) return;
    const convs = await conversationService.getAll();
    if (convs) setConversations(convs);
  }, [user]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const handleSend = useCallback(
    async (content: string, files?: AttachedFile[]) => {
      if (!content.trim() && (!files || files.length === 0)) return;
      if (!user) {
        toast.error('Please sign in to chat');
        return;
      }
      const now = new Date();
      const userMsgId = `msg-${Date.now()}-user`;
      const assistantMsgId = `msg-${Date.now()}-assistant`;

      const userMsg: ChatMsg = {
        id: userMsgId,
        role: 'user',
        content,
        timestamp: formatTime(now),
        attachedFiles: files?.map((f) => ({ name: f.name, type: f.type, size: f.size })),
      };
      setMessages((prev) => [...prev, userMsg]);

      let convId = activeConversationId;
      if (!convId) {
        const title = generateTitle(content || (files?.[0]?.name ?? 'File upload'));
        const conv = await conversationService.create(title, selectedModel, selectedLanguage);
        if (conv) {
          convId = conv.id;
          setActiveConversationId(conv.id);
          setConversations((prev) => [conv, ...prev]);
        }
      }
      if (convId) await conversationService.addMessage(convId, 'user', content);

      const modelLabel = selectedModel;
      const assistantMsg: ChatMsg = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        timestamp: formatTime(now),
        model: modelLabel,
        streaming: true,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      startTimeRef.current = Date.now();

      const userContent = buildUserMessageContent(content, files);
      const updatedHistory = [
        ...conversationHistoryRef.current,
        { role: 'user' as const, content: userContent },
      ];
      conversationHistoryRef.current = updatedHistory;

      // Choose system message based on mode
      const systemMessage = builderMode ? BUILDER_SYSTEM_MESSAGE : CHAT_SYSTEM_MESSAGE;

      if (isPuterModel) {
        const puterModelId = resolvePuterModelId(selectedModel);
        const puterMessages: PuterMessage[] = [
          systemMessage,
          ...updatedHistory.map((m) => ({
            role: m.role as 'system' | 'user' | 'assistant',
            content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
          })),
        ];
        setIsPuterStreaming(true);
        let accumulated = '';
        await getPuterStreamingCompletion(
          puterModelId,
          puterMessages,
          (chunk) => {
            accumulated += chunk;
            setMessages((prev) =>
              prev.map((m) => m.id === assistantMsgId ? { ...m, content: accumulated, streaming: true } : m)
            );
          },
          async (fullText) => {
            const elapsed = Date.now() - startTimeRef.current;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsgId ? { ...m, content: fullText, streaming: false, latency: elapsed } : m
              )
            );
            setIsPuterStreaming(false);
            conversationHistoryRef.current = [...updatedHistory, { role: 'assistant', content: fullText }];
            if (convId) {
              await conversationService.addMessage(convId, 'assistant', fullText, selectedModel, undefined, elapsed);
              loadConversations();
            }
          },
          (err) => {
            setIsPuterStreaming(false);
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsgId ? { ...m, content: `Error: ${err.message}`, streaming: false } : m
              )
            );
            toast.error(`Puter error: ${err.message}`);
          }
        );
      } else {
        streamingMsgIdRef.current = assistantMsgId;
        const apiMessages = [systemMessage, ...updatedHistory];
        sendMessage(apiMessages, { max_completion_tokens: 4096 });
      }
    },
    [user, activeConversationId, selectedModel, selectedLanguage, isPuterModel, builderMode, sendMessage, loadConversations]
  );

  const handleStop = () => {
    streamingMsgIdRef.current = null;
    setIsPuterStreaming(false);
  };

  const handleNewConversation = () => {
    setMessages([]);
    setActiveConversationId(null);
    setTokenCount(0);
    alertedThresholdsRef.current.clear();
    setUsageAlerts([]);
    conversationHistoryRef.current = [];
  };

  const handleSelectConversation = useCallback(async (conv: Conversation) => {
    if (conv.id === activeConversationId) return;
    setLoadingConversation(true);
    setActiveConversationId(conv.id);
    setMessages([]);
    conversationHistoryRef.current = [];
    try {
      const msgs = await conversationService.getMessages(conv.id);
      if (msgs) {
        const chatMsgs: ChatMsg[] = msgs.map((m) => ({
          id: m.id,
          role: m.role as 'user' | 'assistant',
          content: m.content,
          timestamp: formatTime(new Date(m.createdAt)),
          model: m.model || undefined,
          tokens: m.tokens || undefined,
          latency: m.latency || undefined,
        }));
        setMessages(chatMsgs);
        conversationHistoryRef.current = msgs.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));
      }
    } finally {
      setLoadingConversation(false);
    }
  }, [activeConversationId]);

  const handleDeleteConversation = useCallback(async (id: string) => {
    await conversationService.delete(id);
    if (activeConversationId === id) handleNewConversation();
    setConversations((prev) => prev.filter((c) => c.id !== id));
  }, [activeConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isGenerating = isLoading || isPuterStreaming;

  return (
    <div className="flex h-full overflow-hidden">
      {/* Conversation sidebar */}
      <ConversationSidebar
        open={convSidebarOpen}
        onClose={() => setConvSidebarOpen(false)}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
      />

      {/* Main chat area */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        {/* Top bar */}
        <div
          className="flex-shrink-0 flex items-center gap-2 px-3 py-2 border-b"
          style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
        >
          <button
            onClick={() => setConvSidebarOpen(!convSidebarOpen)}
            className="p-1.5 rounded-lg transition-all duration-150 active:scale-95"
            style={{ color: 'var(--muted-foreground)' }}
            title="Toggle sidebar"
          >
            <PanelLeft size={16} />
          </button>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>CodePilot</span>
            <span
              className="text-xs px-1.5 py-0.5 rounded font-mono"
              style={{ background: 'rgba(34,211,238,0.12)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.25)' }}
            >
              Puter · Free
            </span>
            {builderMode && (
              <span
                className="text-xs px-1.5 py-0.5 rounded font-mono flex items-center gap-1"
                style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)' }}
              >
                <Hammer size={10} /> Builder
              </span>
            )}
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-1">
            {/* Builder panel toggle */}
            <button
              onClick={() => setShowBuilderPanel(!showBuilderPanel)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 active:scale-95"
              style={
                showBuilderPanel
                  ? { background: 'rgba(124,58,237,0.18)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.4)' }
                  : { color: 'var(--muted-foreground)' }
              }
              title="Open Builder Panel — generate a full project scaffold"
            >
              <FolderOpen size={14} />
              <span className="hidden lg:inline">Project</span>
            </button>
            <button
              onClick={handleNewConversation}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 active:scale-95"
              style={{ color: 'var(--muted-foreground)' }}
              title="New conversation"
            >
              <Plus size={14} />
              <span className="hidden lg:inline">New</span>
            </button>
            <button
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 active:scale-95"
              style={{ color: 'var(--muted-foreground)' }}
              title="Usage stats"
            >
              <BarChart3 size={14} />
              <span className="hidden lg:inline">Stats</span>
            </button>
          </div>
        </div>

        {/* Usage alert banners */}
        {usageAlerts.length > 0 && (
          <div className="flex-shrink-0 px-3 pt-2 space-y-1.5">
            {usageAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-2 px-3 py-2 rounded-xl text-sm"
                style={{
                  background: alert.level === 'critical' ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
                  border: `1px solid ${alert.level === 'critical' ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}`,
                }}
              >
                <Bell size={13} style={{ color: alert.level === 'critical' ? '#ef4444' : '#f59e0b', flexShrink: 0, marginTop: 1 }} />
                <span className="flex-1 text-xs" style={{ color: 'var(--foreground)' }}>{alert.message}</span>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="p-0.5 rounded transition-colors flex-shrink-0"
                  style={{ color: 'var(--muted-foreground)' }}
                  aria-label="Dismiss alert"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Content area: chat or builder panel */}
        <div className="flex flex-1 overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <div className="max-w-4xl mx-auto pb-4">
              {messages.length === 0 && !loadingConversation && (
                <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.25)' }}
                  >
                    {builderMode ? <Hammer size={20} style={{ color: '#22d3ee' }} /> : <Zap size={20} style={{ color: '#22d3ee' }} />}
                  </div>
                  <h2 className="text-base font-semibold mb-1" style={{ color: 'var(--foreground)' }}>
                    {builderMode ? 'What do you want to build?' : 'Ask CodePilot to build something'}
                  </h2>
                  <p className="text-sm max-w-sm" style={{ color: 'var(--muted-foreground)' }}>
                    {builderMode
                      ? 'Describe your app or feature and CodePilot will generate every file — complete and ready to run.'
                      : 'Describe a feature, paste code to refactor, or ask a question. CodePilot writes real code, not advice.'}
                  </p>
                  {!builderMode && (
                    <button
                      onClick={() => setBuilderMode(true)}
                      className="mt-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 active:scale-95"
                      style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)' }}
                    >
                      <Hammer size={12} /> Switch to Builder Mode
                    </button>
                  )}
                </div>
              )}
              {loadingConversation && (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-2" style={{ color: 'var(--muted-foreground)' }}>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Loading conversation…</span>
                  </div>
                </div>
              )}
              {!loadingConversation && messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isGenerating && !streamingMsgIdRef.current && (
                <div className="flex gap-3 px-4 py-4 fade-in">
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(34,211,238,0.12)', color: '#22d3ee' }}
                  >
                    {builderMode ? <Hammer size={14} /> : <Zap size={14} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>CodePilot</span>
                      <span className="badge-green text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        {builderMode ? 'Building…' : 'Generating…'}
                      </span>
                    </div>
                    <div
                      className="rounded-xl rounded-tl-sm px-4 py-3 text-sm"
                      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                    >
                      <span className="streaming-cursor" style={{ color: 'var(--foreground)' }}>
                        {builderMode ? 'Scaffolding your project' : 'Writing code'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Builder Panel (right side panel) */}
          {showBuilderPanel && (
            <BuilderPanel
              onClose={() => setShowBuilderPanel(false)}
              onBuild={(prompt) => {
                setBuilderMode(true);
                setShowBuilderPanel(false);
                handleSend(prompt);
              }}
              isGenerating={isGenerating}
            />
          )}
        </div>

        {/* Input bar */}
        <div className="flex-shrink-0">
          <ChatInputBar
            onSend={handleSend}
            isStreaming={isGenerating}
            onStop={handleStop}
            onModelChange={setSelectedModel}
            onLanguageChange={setSelectedLanguage}
            builderMode={builderMode}
            onBuilderModeChange={setBuilderMode}
          />
        </div>
      </div>
    </div>
  );
}
