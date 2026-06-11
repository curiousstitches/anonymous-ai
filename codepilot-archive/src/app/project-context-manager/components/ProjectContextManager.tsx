'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileCode, FileText, File, Trash2, Eye, Link2, AlertTriangle, Check, X, Search, FolderOpen, Clock,  } from 'lucide-react';
import { toast } from 'sonner';

interface ContextFile {
  id: string;
  name: string;
  language: string;
  size: string;
  sizeBytes: number;
  tokens: number;
  lastUsed: string;
  status: 'active' | 'indexed' | 'error';
  attachedTo?: string;
  preview: string;
}

const mockFiles: ContextFile[] = [
  {
    id: 'file-001',
    name: 'api-routes.ts',
    language: 'TypeScript',
    size: '14.2 KB',
    sizeBytes: 14540,
    tokens: 3820,
    lastUsed: '2m ago',
    status: 'active',
    attachedTo: 'Fix async/await race condition',
    preview: `import { NextRequest, NextResponse } from 'next/server'
;\nimport { verifyJWT } from '../../../lib/auth'
;\n\nexport async function GET(req: NextRequest) {\n  const token = req.headers.get('authorization');\n  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });\n  // ...`,
  },
  {
    id: 'file-002',
    name: 'database.py',
    language: 'Python',
    size: '8.7 KB',
    sizeBytes: 8908,
    tokens: 2340,
    lastUsed: '1h ago',
    status: 'indexed',
    attachedTo: 'FastAPI JWT auth middleware',
    preview: `from sqlalchemy import create_engine, Column, Integer, String\nfrom sqlalchemy.ext.declarative import declarative_base\nfrom sqlalchemy.orm import sessionmaker\n\nBase = declarative_base()\n\nclass User(Base):\n    __tablename__ = 'users'\n    id = Column(Integer, primary_key=True)`,
  },
  {
    id: 'file-003',
    name: 'useInfiniteScroll.ts',
    language: 'TypeScript',
    size: '3.1 KB',
    sizeBytes: 3174,
    tokens: 840,
    lastUsed: '3h ago',
    status: 'indexed',
    attachedTo: 'React Query infinite scroll',
    preview: `import { useInfiniteQuery } from '@tanstack/react-query'
;\n\nexport function useInfiniteScroll<T>(queryKey: string, fetchFn: (page: number) => Promise<T[]>) {\n  return useInfiniteQuery({\n    queryKey: [queryKey],\n    queryFn: ({ pageParam = 1 }) => fetchFn(pageParam),`,
  },
  {
    id: 'file-004',
    name: 'schema.sql',
    language: 'SQL',
    size: '6.4 KB',
    sizeBytes: 6553,
    tokens: 1720,
    lastUsed: 'Yesterday',
    status: 'indexed',
    preview: `CREATE TABLE users (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  email VARCHAR(255) UNIQUE NOT NULL,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\nCREATE INDEX idx_users_email ON users(email);`,
  },
  {
    id: 'file-005',
    name: 'Cargo.toml',
    language: 'TOML',
    size: '1.2 KB',
    sizeBytes: 1228,
    tokens: 320,
    lastUsed: 'Yesterday',
    status: 'error',
    preview: `[package]\nname = "my-rust-app"\nversion = "0.1.0"\nedition = "2021"\n\n[dependencies]\ntokio = { version = "1", features = ["full"] }`,
  },
  {
    id: 'file-006',
    name: 'docker-compose.yml',
    language: 'YAML',
    size: '2.8 KB',
    sizeBytes: 2867,
    tokens: 760,
    lastUsed: '2 days ago',
    status: 'indexed',
    preview: `version: '3.9'\nservices:\n  app:\n    build: .\n    ports:\n      - "3000:3000"\n    environment:\n      - DATABASE_URL=postgresql://...`,
  },
  {
    id: 'file-007',
    name: 'middleware.ts',
    language: 'TypeScript',
    size: '4.6 KB',
    sizeBytes: 4710,
    tokens: 1240,
    lastUsed: '3 days ago',
    status: 'indexed',
    attachedTo: 'Fix async/await race condition',
    preview: `import { NextResponse } from 'next/server'
;\nimport type { NextRequest } from 'next/server'
;\n\nexport function middleware(request: NextRequest) {\n  const token = request.cookies.get('token');`,
  },
  {
    id: 'file-008',
    name: 'redis-cache.py',
    language: 'Python',
    size: '5.3 KB',
    sizeBytes: 5427,
    tokens: 1430,
    lastUsed: '5 days ago',
    status: 'indexed',
    preview: `import redis\nfrom functools import wraps\nimport json\n\nr = redis.Redis(host='localhost', port=6379, decode_responses=True)\n\ndef cache(ttl=300):\n    def decorator(fn):`,
  },
];

const langColors: Record<string, string> = {
  TypeScript: '#06b6d4',
  Python: '#10b981',
  JavaScript: '#f59e0b',
  SQL: '#a78bfa',
  Rust: '#ef4444',
  YAML: '#f59e0b',
  TOML: '#94a3b8',
  Dockerfile: '#64748b',
};

const MAX_CONTEXT_TOKENS = 16000;

function FileIcon({ language }: { language: string }) {
  const color = langColors[language] || '#94a3b8';
  if (['TypeScript', 'JavaScript'].includes(language)) return <FileCode size={15} style={{ color }} />;
  if (['Python', 'SQL'].includes(language)) return <FileCode size={15} style={{ color }} />;
  return <File size={15} style={{ color }} />;
}

export default function ProjectContextManager() {
  const [files, setFiles] = useState<ContextFile[]>(mockFiles);
  const [selectedFile, setSelectedFile] = useState<ContextFile | null>(files[0]);
  const [search, setSearch] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalTokens = files.reduce((sum, f) => sum + f.tokens, 0);
  const tokenPct = Math.round((totalTokens / MAX_CONTEXT_TOKENS) * 100);

  const activeFiles = files.filter((f) => f.status === 'active');
  const filtered = files.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.language.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setTimeout(() => {
      setFiles((prev) => prev.filter((f) => f.id !== id));
      if (selectedFile?.id === id) setSelectedFile(null);
      setDeletingId(null);
      toast.success('File removed from context');
    }, 400);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    // Backend integration point: POST /api/context/upload with FormData
    toast.success('File uploaded and indexed successfully');
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left panel — file list */}
      <div
        className="flex flex-col w-full lg:w-[420px] xl:w-[480px] flex-shrink-0 border-r overflow-hidden"
        style={{ borderColor: 'var(--border)' }}
      >
        {/* Header */}
        <div
          className="px-5 py-4 border-b"
          style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FolderOpen size={16} style={{ color: 'var(--primary)' }} />
              <h1 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>
                Project Context
              </h1>
              <span
                className="text-xs px-1.5 py-0.5 rounded-full font-mono"
                style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}
              >
                {files.length}
              </span>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-primary text-xs py-1.5 px-3"
            >
              <Upload size={12} />
              Upload
            </button>
            <input ref={fileInputRef} type="file" multiple className="hidden" aria-label="Upload files" />
          </div>

          {/* Token budget */}
          <div
            className="rounded-lg px-3 py-2.5"
            style={
              tokenPct > 80
                ? { background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }
                : { background: 'var(--muted)', border: '1px solid var(--border)' }
            }
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                {tokenPct > 80 && <AlertTriangle size={12} style={{ color: '#f59e0b' }} />}
                <span className="text-xs font-medium" style={{ color: tokenPct > 80 ? '#f59e0b' : 'var(--foreground)' }}>
                  Context Window
                </span>
              </div>
              <span className="text-xs font-mono token-count" style={{ color: 'var(--muted-foreground)' }}>
                {(totalTokens / 1000).toFixed(1)}k / {(MAX_CONTEXT_TOKENS / 1000).toFixed(0)}k tokens
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(tokenPct, 100)}%`,
                  background: tokenPct > 80 ? '#f59e0b' : tokenPct > 60 ? '#f59e0b' : 'var(--primary)',
                }}
              />
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
              {tokenPct}% used · {activeFiles.length} file{activeFiles.length !== 1 ? 's' : ''} active in current chat
            </p>
          </div>

          {/* Search */}
          <div className="relative mt-3">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files by name or language..."
              className="input-base pl-8 text-xs py-2"
            />
          </div>
        </div>

        {/* Bulk action bar */}
        {selectedIds.size > 0 && (
          <div
            className="flex items-center justify-between px-4 py-2 border-b slide-up"
            style={{ background: 'rgba(124,58,237,0.08)', borderColor: 'rgba(124,58,237,0.25)' }}
          >
            <span className="text-xs font-medium" style={{ color: '#a78bfa' }}>
              {selectedIds.size} file{selectedIds.size > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                className="text-xs px-2.5 py-1 rounded-lg"
                style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}
                onClick={() => {
                  selectedIds.forEach((id) => handleDelete(id));
                  setSelectedIds(new Set());
                }}
              >
                Delete selected
              </button>
              <button
                onClick={() => setSelectedIds(new Set())}
                className="p-1 rounded"
                style={{ color: 'var(--muted-foreground)' }}
                aria-label="Clear selection"
              >
                <X size={13} />
              </button>
            </div>
          </div>
        )}

        {/* Drop zone */}
        <div
          className="mx-4 mt-3 mb-1 rounded-xl border-2 border-dashed py-4 text-center cursor-pointer transition-all duration-200"
          style={{
            borderColor: dragOver ? 'var(--primary)' : 'var(--border)',
            background: dragOver ? 'rgba(124,58,237,0.08)' : 'transparent',
          }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Drop files here to upload"
        >
          <Upload size={18} className="mx-auto mb-1.5" style={{ color: dragOver ? 'var(--primary)' : 'var(--muted-foreground)' }} />
          <p className="text-xs" style={{ color: dragOver ? 'var(--primary)' : 'var(--muted-foreground)' }}>
            Drop files here or click to browse
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            .ts, .py, .js, .sql, .rs, .go, .yaml, .json
          </p>
        </div>

        {/* File list */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-3 py-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FolderOpen size={32} style={{ color: 'var(--muted-foreground)' }} />
              <p className="mt-3 text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                No context files yet
              </p>
              <p className="mt-1 text-xs" style={{ color: 'var(--muted-foreground)', maxWidth: '220px' }}>
                Upload source files to give the AI more context about your project
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary mt-4 text-xs py-2"
              >
                <Upload size={12} />
                Upload First File
              </button>
            </div>
          ) : (
            filtered.map((file) => (
              <div
                key={file.id}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 ${
                  deletingId === file.id ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
                style={{
                  background:
                    selectedFile?.id === file.id
                      ? 'rgba(124,58,237,0.1)'
                      : 'transparent',
                  border: selectedFile?.id === file.id
                    ? '1px solid rgba(124,58,237,0.25)'
                    : '1px solid transparent',
                  transition: 'all 200ms ease',
                }}
                onClick={() => setSelectedFile(file)}
              >
                {/* Checkbox */}
                <div
                  className="flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all"
                  style={{
                    borderColor: selectedIds.has(file.id) ? 'var(--primary)' : 'var(--border)',
                    background: selectedIds.has(file.id) ? 'var(--primary)' : 'transparent',
                  }}
                  onClick={(e) => { e.stopPropagation(); toggleSelect(file.id); }}
                >
                  {selectedIds.has(file.id) && <Check size={10} style={{ color: 'white' }} />}
                </div>

                <FileIcon language={file.language} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium font-mono truncate" style={{ color: 'var(--foreground)' }}>
                      {file.name}
                    </p>
                    {file.status === 'active' && (
                      <span className="badge-green text-xs flex-shrink-0">Active</span>
                    )}
                    {file.status === 'error' && (
                      <span className="badge-red text-xs flex-shrink-0">Error</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="text-xs font-mono"
                      style={{
                        color: langColors[file.language] || '#94a3b8',
                      }}
                    >
                      {file.language}
                    </span>
                    <span className="text-xs font-mono token-count" style={{ color: 'var(--muted-foreground)' }}>
                      {(file.tokens / 1000).toFixed(1)}k tokens
                    </span>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      {file.size}
                    </span>
                  </div>
                </div>

                {/* Row actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    className="p-1.5 rounded-md transition-colors"
                    style={{ color: 'var(--muted-foreground)' }}
                    title="Preview file"
                    onClick={(e) => { e.stopPropagation(); setSelectedFile(file); }}
                    aria-label="Preview file"
                  >
                    <Eye size={13} />
                  </button>
                  <button
                    className="p-1.5 rounded-md transition-colors"
                    style={{ color: 'var(--muted-foreground)' }}
                    title="Attach to current chat"
                    aria-label="Attach to current chat"
                  >
                    <Link2 size={13} />
                  </button>
                  <button
                    className="p-1.5 rounded-md transition-colors"
                    style={{ color: 'var(--muted-foreground)' }}
                    title="Remove from context — this will not delete the file from disk"
                    onClick={(e) => { e.stopPropagation(); handleDelete(file.id); }}
                    aria-label="Remove from context"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right panel — file preview */}
      <div className="hidden lg:flex flex-col flex-1 min-w-0 overflow-hidden">
        {selectedFile ? (
          <>
            {/* Preview header */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0"
              style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
            >
              <div className="flex items-center gap-3">
                <FileIcon language={selectedFile.language} />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold font-mono" style={{ color: 'var(--foreground)' }}>
                      {selectedFile.name}
                    </h2>
                    {selectedFile.status === 'active' && <span className="badge-green">Active in chat</span>}
                    {selectedFile.status === 'error' && <span className="badge-red">Index error</span>}
                    {selectedFile.status === 'indexed' && <span className="badge-cyan">Indexed</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span
                      className="text-xs font-mono"
                      style={{ color: langColors[selectedFile.language] || '#94a3b8' }}
                    >
                      {selectedFile.language}
                    </span>
                    <span className="text-xs font-mono token-count" style={{ color: 'var(--muted-foreground)' }}>
                      {selectedFile.tokens.toLocaleString()} tokens
                    </span>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      {selectedFile.size}
                    </span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      <Clock size={11} />
                      {selectedFile.lastUsed}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedFile.attachedTo && (
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs"
                    style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', color: '#06b6d4' }}
                  >
                    <Link2 size={11} />
                    {selectedFile.attachedTo}
                  </div>
                )}
                <button
                  className="btn-primary text-xs py-1.5 px-3"
                  aria-label="Attach file to current chat"
                >
                  <Link2 size={12} />
                  Attach to Chat
                </button>
              </div>
            </div>

            {/* Token usage for this file */}
            <div
              className="px-5 py-3 border-b flex items-center gap-4"
              style={{ borderColor: 'var(--border)', background: 'var(--muted)' }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  Token budget used by this file:
                </span>
                <span className="text-xs font-mono font-semibold token-count" style={{ color: 'var(--foreground)' }}>
                  {((selectedFile.tokens / MAX_CONTEXT_TOKENS) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(selectedFile.tokens / MAX_CONTEXT_TOKENS) * 100}%`,
                    background: 'var(--primary)',
                  }}
                />
              </div>
              <span className="text-xs font-mono token-count" style={{ color: 'var(--muted-foreground)' }}>
                {selectedFile.tokens.toLocaleString()} / {MAX_CONTEXT_TOKENS.toLocaleString()}
              </span>
            </div>

            {/* Code preview */}
            <div className="flex-1 overflow-auto scrollbar-thin">
              <div className="code-block m-0 rounded-none border-0 h-full">
                <div
                  className="flex items-center justify-between px-4 py-2 border-b"
                  style={{ borderColor: 'var(--border)', background: 'rgba(255,255,255,0.02)' }}
                >
                  <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
                    Preview (first 500 lines)
                  </span>
                  <span className="badge-cyan text-xs">Read-only</span>
                </div>
                <pre className="p-5 text-xs leading-relaxed overflow-auto h-full font-mono" style={{ margin: 0, background: '#0a0c10' }}>
                  <code style={{ color: 'var(--foreground)' }}>
                    {selectedFile.preview}
                    {'\n\n// ... (file continues)\n// Full content available in chat context'}
                  </code>
                </pre>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <FileText size={40} style={{ color: 'var(--muted-foreground)' }} />
            <p className="mt-4 text-base font-medium" style={{ color: 'var(--foreground)' }}>
              Select a file to preview
            </p>
            <p className="mt-2 text-sm" style={{ color: 'var(--muted-foreground)', maxWidth: '280px' }}>
              Click any file in the list to see its content, token count, and attachment status
            </p>
          </div>
        )}
      </div>
    </div>
  );
}