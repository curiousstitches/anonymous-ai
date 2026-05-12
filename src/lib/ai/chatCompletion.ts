import { callAIEndpoint } from './aiClient';

const ENDPOINT = '/api/ai/chat-completion';

export async function getChatCompletion(
  provider: string,
  model: string,
  messages: object[],
  parameters: object = {}
) {
  return callAIEndpoint(ENDPOINT, {
    provider,
    model,
    messages,
    stream: false,
    parameters,
  });
}

export async function getStreamingChatCompletion(
  provider: string,
  model: string,
  messages: object[],
  onChunk: (chunk: any) => void,
  onComplete: () => void,
  onError: (error: Error) => void,
  parameters: object = {}
) {
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Start': String(Date.now()),
      },
      body: JSON.stringify({ provider, model, messages, stream: true, parameters }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || `HTTP error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('Response body is not readable');

    const decoder = new TextDecoder();
    let buffer = '';
    let doneSignalled = false;

    const processLines = (lines: string[]) => {
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const raw = line.slice(6).trim();
        if (!raw) continue;
        try {
          const data = JSON.parse(raw);
          if (data.type === 'chunk' && data.chunk) {
            onChunk(data.chunk);
          } else if (data.type === 'done') {
            doneSignalled = true;
            onComplete();
          } else if (data.type === 'error') {
            onError(new Error(data.error));
          }
        } catch {
          // skip malformed JSON
        }
      }
    };

    // Read loop — use a 16 KB read hint for better throughput
    while (true) {
      const { done, value } = await reader.read();

      if (value) {
        buffer += decoder.decode(value, { stream: !done });
        const lines = buffer.split('\n');
        // Keep the last (potentially incomplete) line in the buffer
        buffer = lines.pop() ?? '';
        processLines(lines);
      }

      if (done) {
        // Flush any remaining buffer content
        if (buffer.trim()) {
          processLines(buffer.split('\n'));
          buffer = '';
        }
        if (!doneSignalled) onComplete();
        break;
      }
    }
  } catch (error) {
    onError(error instanceof Error ? error : new Error('Streaming error'));
  }
}
