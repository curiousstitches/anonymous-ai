'use client';

// Puter.js is loaded client-side — it attaches `puter` to the global window object
// when imported via the npm package.

let puterInitialized = false;

async function getPuter(): Promise<any> {
  if (typeof window === 'undefined') {
    throw new Error('Puter.js is only available in the browser');
  }

  if (!puterInitialized) {
    await import('@heyputer/puter.js');
    puterInitialized = true;
  }

  // Give Puter a moment to attach to window after import
  await new Promise((r) => setTimeout(r, 100));

  const puter = (window as any).puter;
  if (!puter) {
    throw new Error('Puter.js failed to initialize');
  }
  return puter;
}

export interface PuterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | { type: string; [key: string]: unknown }[];
}

export interface PuterTestResult {
  success: boolean;
  latencyMs: number;
  ttfbMs: number; // time to first byte/chunk
  totalChars: number;
  tokensEstimate: number;
  charsPerSecond: number;
  model: string;
  provider: 'puter' | 'openai-failover';
  error?: string;
  timestamp: Date;
}

/** Resolve Puter model label to OpenAI model ID for failover */
function puterModelToOpenAIModel(puterModelId: string): string {
  if (puterModelId === 'gpt-4o-mini') return 'gpt-4o-mini';
  if (puterModelId === 'claude-3-5-sonnet') return 'gpt-4o';
  return 'gpt-4o';
}

/** Failover: call OpenAI API route with streaming */
async function openAIFailoverStreaming(
  puterModelId: string,
  messages: PuterMessage[],
  onChunk: (text: string) => void,
  onComplete: (fullText: string) => void,
  onError: (error: Error) => void
): Promise<void> {
  try {
    const openaiModel = puterModelToOpenAIModel(puterModelId);
    const response = await fetch('/api/ai/chat-completion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'OPEN_AI',
        model: openaiModel,
        messages: messages.map((m) => ({
          role: m.role,
          content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
        })),
        stream: true,
        parameters: { max_completion_tokens: 2048 },
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || `OpenAI failover HTTP error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('Response body is not readable');

    const decoder = new TextDecoder();
    let buffer = '';
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'chunk' && data.chunk) {
              fullText += data.chunk;
              onChunk(data.chunk);
            } else if (data.type === 'done') {
              onComplete(fullText);
              return;
            } else if (data.type === 'error') {
              throw new Error(data.error || 'OpenAI failover stream error');
            }
          } catch {
            // skip invalid JSON lines
          }
        }
      }
    }

    onComplete(fullText);
  } catch (err) {
    onError(err instanceof Error ? err : new Error('OpenAI failover error'));
  }
}

/**
 * Streaming chat via Puter.js with automatic OpenAI failover.
 * If Puter fails for any reason, silently retries through OpenAI API route.
 */
export async function getPuterStreamingCompletion(
  model: string,
  messages: PuterMessage[],
  onChunk: (text: string) => void,
  onComplete: (fullText: string) => void,
  onError: (error: Error) => void
): Promise<void> {
  try {
    const puter = await getPuter();
    const resp = await puter.ai.chat(messages, { model, stream: true });

    let fullText = '';

    // Handle both async-iterable and array responses from Puter
    if (resp && typeof resp[Symbol.asyncIterator] === 'function') {
      for await (const part of resp) {
        const text =
          part?.text ??
          part?.choices?.[0]?.delta?.content ??
          part?.message?.content ??
          '';
        if (text) {
          fullText += text;
          onChunk(text);
        }
      }
    } else if (Array.isArray(resp)) {
      for (const part of resp) {
        const text =
          part?.text ??
          part?.choices?.[0]?.delta?.content ??
          part?.message?.content ??
          '';
        if (text) {
          fullText += text;
          onChunk(text);
        }
      }
    } else {
      // Non-streaming fallback — Puter returned a single object
      const text =
        resp?.text ??
        resp?.message?.content ??
        resp?.choices?.[0]?.message?.content ??
        '';
      if (text) {
        fullText = text;
        onChunk(text);
      }
    }

    onComplete(fullText);
  } catch (puterErr) {
    console.warn('[Puter failover] Puter request failed, retrying via OpenAI:', puterErr);
    await openAIFailoverStreaming(model, messages, onChunk, onComplete, onError);
  }
}

/**
 * Non-streaming chat via Puter.js with OpenAI failover
 */
export async function getPuterCompletion(
  model: string,
  messages: PuterMessage[]
): Promise<string> {
  try {
    const puter = await getPuter();
    const result = await puter.ai.chat(messages, { model });
    return (
      result?.message?.content ??
      result?.choices?.[0]?.message?.content ??
      result?.text ??
      ''
    );
  } catch (puterErr) {
    console.warn('[Puter failover] Non-streaming Puter failed, retrying via OpenAI:', puterErr);
    const openaiModel = puterModelToOpenAIModel(model);
    const response = await fetch('/api/ai/chat-completion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'OPEN_AI',
        model: openaiModel,
        messages: messages.map((m) => ({
          role: m.role,
          content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
        })),
        stream: false,
      }),
    });
    const data = await response.json();
    return data?.content ?? data?.message ?? '';
  }
}

/**
 * Live callback test for Puter — measures TTFB, total latency, throughput.
 * Falls back to OpenAI and marks provider accordingly.
 */
export async function testPuterConnection(model = 'gpt-4o-mini'): Promise<PuterTestResult> {
  const startMs = performance.now();
  let ttfbMs = 0;
  let firstChunk = true;
  let totalChars = 0;
  let usedProvider: 'puter' | 'openai-failover' = 'puter';
  let errorMsg: string | undefined;

  const testMessages: PuterMessage[] = [
    {
      role: 'user',
      content: 'Reply with exactly: "Puter callback test OK" — nothing else.',
    },
  ];

  try {
    const puter = await getPuter();
    const resp = await puter.ai.chat(testMessages, { model, stream: true });

    const processChunk = (text: string) => {
      if (text && firstChunk) {
        ttfbMs = performance.now() - startMs;
        firstChunk = false;
      }
      totalChars += text?.length ?? 0;
    };

    if (resp && typeof resp[Symbol.asyncIterator] === 'function') {
      for await (const part of resp) {
        const text =
          part?.text ??
          part?.choices?.[0]?.delta?.content ??
          part?.message?.content ??
          '';
        processChunk(text);
      }
    } else if (Array.isArray(resp)) {
      for (const part of resp) {
        const text =
          part?.text ??
          part?.choices?.[0]?.delta?.content ??
          part?.message?.content ??
          '';
        processChunk(text);
      }
    } else {
      const text =
        resp?.text ??
        resp?.message?.content ??
        resp?.choices?.[0]?.message?.content ??
        '';
      processChunk(text);
    }
  } catch (puterErr) {
    // Puter failed — measure failover via OpenAI
    usedProvider = 'openai-failover';
    errorMsg = puterErr instanceof Error ? puterErr.message : String(puterErr);

    try {
      const openaiModel = puterModelToOpenAIModel(model);
      const response = await fetch('/api/ai/chat-completion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'OPEN_AI',
          model: openaiModel,
          messages: testMessages.map((m) => ({ role: m.role, content: m.content })),
          stream: true,
          parameters: { max_completion_tokens: 64 },
        }),
      });

      if (!response.ok) throw new Error(`OpenAI HTTP ${response.status}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'chunk' && data.chunk) {
                if (firstChunk) {
                  ttfbMs = performance.now() - startMs;
                  firstChunk = false;
                }
                totalChars += data.chunk.length;
              } else if (data.type === 'done') break;
            } catch {
              // skip
            }
          }
        }
      }
    } catch (fallbackErr) {
      const latencyMs = performance.now() - startMs;
      return {
        success: false,
        latencyMs: Math.round(latencyMs),
        ttfbMs: 0,
        totalChars: 0,
        tokensEstimate: 0,
        charsPerSecond: 0,
        model,
        provider: 'openai-failover',
        error: `Both Puter and OpenAI failed: ${fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr)}`,
        timestamp: new Date(),
      };
    }
  }

  const latencyMs = performance.now() - startMs;
  const durationSec = latencyMs / 1000;

  return {
    success: true,
    latencyMs: Math.round(latencyMs),
    ttfbMs: Math.round(ttfbMs),
    totalChars,
    tokensEstimate: Math.round(totalChars / 4),
    charsPerSecond: durationSec > 0 ? Math.round(totalChars / durationSec) : 0,
    model,
    provider: usedProvider,
    error: usedProvider === 'openai-failover' ? errorMsg : undefined,
    timestamp: new Date(),
  };
}
