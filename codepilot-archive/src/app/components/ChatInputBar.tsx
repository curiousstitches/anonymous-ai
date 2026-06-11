'use client';
import React, { useState, useRef, useCallback } from 'react';
import {
  Send,
  Paperclip,
  Code2,
  ChevronDown,
  Zap,
  Globe,
  Cpu,
  Brain,
  Mic,
  StopCircle,
  X,
  FileText,
  Image as ImageIcon,
  Hammer,
} from 'lucide-react';

// Puter GPT-4o is first — it becomes the auto-start default
const models = [
  { id: 'model-puter-gpt4o',     label: 'GPT-4o (Puter)',            icon: Zap,   color: '#22d3ee', provider: 'Puter · Free' },
  { id: 'model-puter-gpt4omini', label: 'GPT-4o Mini (Puter)',       icon: Zap,   color: '#22d3ee', provider: 'Puter · Free' },
  { id: 'model-puter-claude',    label: 'Claude 3.5 Sonnet (Puter)', icon: Brain, color: '#22d3ee', provider: 'Puter · Free' },
  { id: 'model-gpt4o',           label: 'GPT-4o',                    icon: Brain, color: '#06b6d4', provider: 'OpenAI' },
  { id: 'model-claude',          label: 'Claude 3.5 Sonnet',         icon: Zap,   color: '#a78bfa', provider: 'Anthropic' },
  { id: 'model-gemini',          label: 'Gemini 1.5 Pro',            icon: Globe, color: '#f59e0b', provider: 'Google' },
  { id: 'model-ollama',          label: 'Ollama / LLaMA 3',          icon: Cpu,   color: '#10b981', provider: 'Self-hosted' },
];

const languages = [
  { id: 'lang-auto',       label: 'Auto-detect' },
  { id: 'lang-typescript', label: 'TypeScript' },
  { id: 'lang-javascript', label: 'JavaScript' },
  { id: 'lang-python',     label: 'Python' },
  { id: 'lang-rust',       label: 'Rust' },
  { id: 'lang-go',         label: 'Go' },
  { id: 'lang-java',       label: 'Java' },
  { id: 'lang-sql',        label: 'SQL' },
  { id: 'lang-bash',       label: 'Bash' },
];

export interface AttachedFile {
  name: string;
  type: string;
  dataUri: string;
  size: number;
}

interface ChatInputBarProps {
  onSend: (message: string, files?: AttachedFile[]) => void;
  isStreaming: boolean;
  onStop: () => void;
  onModelChange?: (model: string) => void;
  onLanguageChange?: (language: string) => void;
  builderMode?: boolean;
  onBuilderModeChange?: (enabled: boolean) => void;
}

async function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export default function ChatInputBar({
  onSend,
  isStreaming,
  onStop,
  onModelChange,
  onLanguageChange,
  builderMode = false,
  onBuilderModeChange,
}: ChatInputBarProps) {
  const [input, setInput] = useState('');
  // Default to first model in list — Puter GPT-4o
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(() => {
    if ((!input.trim() && attachedFiles.length === 0) || isStreaming) return;
    onSend(input.trim(), attachedFiles.length > 0 ? attachedFiles : undefined);
    setInput('');
    setAttachedFiles([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [input, isStreaming, onSend, attachedFiles]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const validTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'text/plain', 'text/markdown', 'text/javascript', 'text/typescript',
      'application/json',
    ];
    const validFiles = files.filter(f =>
      validTypes.includes(f.type) ||
      f.name.match(/\.(ts|tsx|js|jsx|py|go|rs|java|sql|sh|md|txt|json|yaml|yml|env|config)$/i)
    );
    if (!validFiles.length) return;
    setIsProcessingFile(true);
    try {
      const processed: AttachedFile[] = await Promise.all(
        validFiles.map(async (file) => ({
          name: file.name,
          type: file.type || 'text/plain',
          dataUri: await fileToDataUri(file),
          size: file.size,
        }))
      );
      setAttachedFiles(prev => [...prev, ...processed]);
    } finally {
      setIsProcessingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const isImage = (type: string) => type.startsWith('image/');

  const placeholder = builderMode
    ? 'Describe the app or feature to build (e.g. "a REST API with Express + TypeScript for a todo app")…'
    : 'Ask a coding question, paste code to review, or describe what you want to build…';

  return (
    <div
      className="border-t px-4 py-3"
      style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
    >
      {/* Toolbar: Model + Language + Builder Mode */}
      <div className="flex items-center gap-2 mb-2.5 flex-wrap">
        {/* Model selector */}
        <div className="relative">
          <button
            onClick={() => { setShowModelDropdown(!showModelDropdown); setShowLangDropdown(false); }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 active:scale-95"
            style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: selectedModel.color, boxShadow: `0 0 4px ${selectedModel.color}` }}
            />
            {selectedModel.label}
            <ChevronDown size={12} style={{ color: 'var(--muted-foreground)' }} />
          </button>
          {showModelDropdown && (
            <div
              className="absolute bottom-full left-0 mb-2 w-60 rounded-xl border py-1 z-50 card-glow"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <p className="px-3 pt-1.5 pb-0.5 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>
                Free — no API key
              </p>
              {models.filter(m => m.provider.startsWith('Puter')).map((m) => {
                const MIcon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedModel(m); setShowModelDropdown(false); onModelChange?.(m.label); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors"
                    style={{
                      color: selectedModel.id === m.id ? m.color : 'var(--foreground)',
                      background: selectedModel.id === m.id ? `${m.color}12` : 'transparent',
                    }}
                  >
                    <MIcon size={13} style={{ color: m.color }} />
                    <div className="text-left">
                      <p className="font-medium">{m.label}</p>
                      <p style={{ color: 'var(--muted-foreground)' }}>{m.provider}</p>
                    </div>
                    {selectedModel.id === m.id && (
                      <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${m.color}20`, color: m.color }}>Active</span>
                    )}
                  </button>
                );
              })}
              <div className="border-t my-1" style={{ borderColor: 'var(--border)' }} />
              <p className="px-3 pt-1 pb-0.5 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>
                API key required
              </p>
              {models.filter(m => !m.provider.startsWith('Puter')).map((m) => {
                const MIcon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedModel(m); setShowModelDropdown(false); onModelChange?.(m.label); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors"
                    style={{
                      color: selectedModel.id === m.id ? m.color : 'var(--foreground)',
                      background: selectedModel.id === m.id ? `${m.color}12` : 'transparent',
                    }}
                  >
                    <MIcon size={13} style={{ color: m.color }} />
                    <div className="text-left">
                      <p className="font-medium">{m.label}</p>
                      <p style={{ color: 'var(--muted-foreground)' }}>{m.provider}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => { setShowLangDropdown(!showLangDropdown); setShowModelDropdown(false); }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 active:scale-95"
            style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
          >
            <Code2 size={12} style={{ color: 'var(--primary)' }} />
            {selectedLang.label}
            <ChevronDown size={12} style={{ color: 'var(--muted-foreground)' }} />
          </button>
          {showLangDropdown && (
            <div
              className="absolute bottom-full left-0 mb-2 w-44 rounded-xl border py-1 z-50 card-glow"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              {languages.map((l) => (
                <button
                  key={l.id}
                  onClick={() => { setSelectedLang(l); setShowLangDropdown(false); onLanguageChange?.(l.label); }}
                  className="w-full text-left px-3 py-1.5 text-xs transition-colors font-mono"
                  style={{
                    color: selectedLang.id === l.id ? '#a78bfa' : 'var(--foreground)',
                    background: selectedLang.id === l.id ? 'rgba(124,58,237,0.1)' : 'transparent',
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Builder Mode toggle */}
        <button
          onClick={() => onBuilderModeChange?.(!builderMode)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 active:scale-95"
          style={
            builderMode
              ? { background: 'rgba(124,58,237,0.18)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.4)' }
              : { background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--muted-foreground)' }
          }
          title="Toggle Builder Mode — AI generates complete, runnable files"
        >
          <Hammer size={12} />
          Builder
          {builderMode && <span className="w-1.5 h-1.5 rounded-full bg-purple-400 ml-0.5" />}
        </button>

        <div className="flex-1" />
        <span className="text-xs font-mono hidden sm:block" style={{ color: 'var(--muted-foreground)' }}>
          Shift+Enter for newline
        </span>
      </div>

      {/* Attached files preview */}
      {attachedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2.5">
          {attachedFiles.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium"
              style={{
                background: 'rgba(124,58,237,0.1)',
                border: '1px solid rgba(124,58,237,0.25)',
                color: 'var(--foreground)',
              }}
            >
              {isImage(file.type) ? (
                <ImageIcon size={12} style={{ color: '#a78bfa' }} />
              ) : (
                <FileText size={12} style={{ color: '#a78bfa' }} />
              )}
              <span className="max-w-[120px] truncate font-mono">{file.name}</span>
              <span style={{ color: 'var(--muted-foreground)' }}>{formatFileSize(file.size)}</span>
              <button
                onClick={() => removeFile(idx)}
                className="ml-0.5 rounded transition-colors hover:text-red-400"
                style={{ color: 'var(--muted-foreground)' }}
                aria-label={`Remove ${file.name}`}
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input area */}
      <div
        className="flex items-end gap-2 rounded-xl border p-2 transition-all duration-150"
        style={{
          borderColor: builderMode ? 'rgba(124,58,237,0.5)' : 'var(--border)',
          background: 'var(--input)',
          boxShadow: builderMode ? '0 0 0 1px rgba(124,58,237,0.2)' : 'none',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.ts,.tsx,.js,.jsx,.py,.go,.rs,.java,.sql,.sh,.md,.txt,.json,.yaml,.yml,.env,.config"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Attach files"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessingFile}
          className="p-2 rounded-lg transition-all duration-150 active:scale-95 flex-shrink-0"
          style={{
            color: attachedFiles.length > 0 ? '#a78bfa' : 'var(--muted-foreground)',
            background: attachedFiles.length > 0 ? 'rgba(124,58,237,0.1)' : 'transparent',
          }}
          title="Attach file or project context"
          aria-label="Attach file"
        >
          {isProcessingFile ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Paperclip size={16} />
          )}
        </button>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm outline-none scrollbar-thin"
          style={{
            color: 'var(--foreground)',
            minHeight: '36px',
            maxHeight: '200px',
            lineHeight: '1.6',
            fontFamily: 'var(--font-sans)',
          }}
          disabled={isStreaming}
          aria-label="Chat input"
        />
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            className="p-2 rounded-lg transition-all duration-150 active:scale-95"
            style={{ color: 'var(--muted-foreground)' }}
            title="Voice input"
            aria-label="Voice input"
          >
            <Mic size={16} />
          </button>
          {isStreaming ? (
            <button
              onClick={onStop}
              className="p-2 rounded-lg transition-all duration-150 active:scale-95"
              style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}
              title="Stop generation"
              aria-label="Stop generation"
            >
              <StopCircle size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!input.trim() && attachedFiles.length === 0}
              className="p-2 rounded-lg transition-all duration-150 active:scale-95"
              style={
                input.trim() || attachedFiles.length > 0
                  ? { background: builderMode ? 'rgba(124,58,237,0.9)' : 'var(--primary)', color: 'white' }
                  : { background: 'var(--muted)', color: 'var(--muted-foreground)', cursor: 'not-allowed' }
              }
              title={builderMode ? 'Build it (Enter)' : 'Send message (Enter)'}
              aria-label={builderMode ? 'Build' : 'Send message'}
            >
              {builderMode ? <Hammer size={16} /> : <Send size={16} />}
            </button>
          )}
        </div>
      </div>
      <p className="text-xs text-center mt-2" style={{ color: 'var(--muted-foreground)' }}>
        {builderMode
          ? '🔨 Builder Mode — CodePilot generates complete, runnable files for your project.'
          : 'CodePilot builds real code. Always review before deploying to production.'}
      </p>
    </div>
  );
}
