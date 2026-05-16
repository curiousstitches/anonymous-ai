import { NextRequest, NextResponse } from 'next/server';
import { completion } from '@rocketnew/llm-sdk';

const API_KEYS: Record<string, string | undefined> = {
  OPEN_AI: process.env.OPENAI_API_KEY,
  ANTHROPIC: process.env.ANTHROPIC_API_KEY,
  GEMINI: process.env.GEMINI_API_KEY,
  PERPLEXITY: process.env.PERPLEXITY_API_KEY,
};

type SanitizedMessageContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string; detail?: string } }
  | { type: 'file'; file: { file_data: string; filename?: string } };

type SanitizedMessage = {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | SanitizedMessageContentPart[];
  tool_call_id?: string;
};

function sanitizeShortId(value: unknown, fallbackPrefix: string, index: number): string {
  const normalized = typeof value === 'string'
    ? value.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64)
    : '';

  return normalized || `${fallbackPrefix}_${index}`;
}

function sanitizeMessageContent(content: unknown): string | SanitizedMessageContentPart[] {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return String(content ?? '');

  const parts = content.flatMap((part): SanitizedMessageContentPart[] => {
    if (!part || typeof part !== 'object') return [];

    const type = typeof (part as { type?: unknown }).type === 'string'
      ? (part as { type: string }).type
      : '';

    if (type === 'text') {
      return [{ type: 'text', text: String((part as { text?: unknown }).text ?? '') }];
    }

    if (type === 'image_url') {
      const imageUrl = (part as { image_url?: { url?: unknown; detail?: unknown } }).image_url;
      const url = typeof imageUrl?.url === 'string' ? imageUrl.url : '';
      if (!url) return [];

      const detail = typeof imageUrl?.detail === 'string' ? imageUrl.detail : undefined;
      return [{ type: 'image_url', image_url: detail ? { url, detail } : { url } }];
    }

    if (type === 'file') {
      const file = (part as { file?: { file_data?: unknown; filename?: unknown } }).file;
      const file_data = typeof file?.file_data === 'string' ? file.file_data : '';
      if (!file_data) return [];

      const filename = typeof file?.filename === 'string' ? file.filename : undefined;
      return [{ type: 'file', file: filename ? { file_data, filename } : { file_data } }];
    }

    return [];
  });

  return parts.length > 0 ? parts : '';
}

function sanitizeMessages(messages: unknown[]): SanitizedMessage[] {
  return messages.flatMap((message, index): SanitizedMessage[] => {
    if (!message || typeof message !== 'object') return [];

    const role = (message as { role?: unknown }).role;
    if (role !== 'system' && role !== 'user' && role !== 'assistant' && role !== 'tool') {
      return [];
    }

    const sanitizedMessage: SanitizedMessage = {
      role,
      content: sanitizeMessageContent((message as { content?: unknown }).content),
    };

    const toolCallId = (message as { tool_call_id?: unknown; call_id?: unknown }).tool_call_id
      ?? (message as { call_id?: unknown }).call_id;

    if (role === 'tool' && toolCallId != null) {
      sanitizedMessage.tool_call_id = sanitizeShortId(toolCallId, 'tool', index);
    }

    return [sanitizedMessage];
  });
}

function formatErrorResponse(error: unknown, provider?: string) {

  const statusCode = (error as any)?.statusCode || (error as any)?.status || 500;
  const providerName = (error as any)?.llmProvider || provider || 'Unknown';

  return {
    error: `${providerName.toUpperCase()} API error: ${statusCode}`,
    details: error instanceof Error ? error.message : String(error),
    statusCode,
  };
}

export async function POST(request: NextRequest) {
  let body: any = {};

  try {
    body = await request.json();
    const { provider, model, messages, stream = false, parameters = {} } = body;
    const sanitizedMessages = Array.isArray(messages) ? sanitizeMessages(messages) : [];

    if (!provider || !model || sanitizedMessages.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: provider, model, messages', details: 'Request validation failed' },
        { status: 400 }
      );
    }

    const apiKey = API_KEYS[provider];

    if (!apiKey) {
      return NextResponse.json(
        { error: `${provider.toUpperCase()} API key is not configured`, details: 'The API key for this provider is missing in environment variables' },
        { status: 400 }
      );
    }

    if (stream) {
      const response = await completion({
        model,
        messages: sanitizedMessages,
        stream: true,
        api_key: apiKey,
        ...parameters,
      });

      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'start' })}\n\n`));

            for await (const chunk of response as unknown as AsyncIterable<unknown>) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'chunk', chunk })}\n\n`));
            }

            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
            controller.close();
          } catch (error) {
            const formatted = formatErrorResponse(error, provider);
            console.error('API Route Error:', { error: formatted.error, details: formatted.details });
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', error: formatted.error, details: formatted.details })}\n\n`));
            controller.close();
          }
        },
      });

      return new NextResponse(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    const response = await completion({
      model,
      messages: sanitizedMessages,
      stream: false,
      api_key: apiKey,
      ...parameters,
    });

    return NextResponse.json(response);
  } catch (error) {
    const formatted = formatErrorResponse(error, body?.provider);
    console.error('API Route Error:', { error: formatted.error, details: formatted.details });
    return NextResponse.json(
      { error: formatted.error, details: formatted.details },
      { status: formatted.statusCode }
    );
  }
}
