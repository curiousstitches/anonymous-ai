'use client';

import { useState, useCallback, useRef } from 'react';
import { getChatCompletion, getStreamingChatCompletion } from '@/lib/ai/chatCompletion';

export function useChat(provider: string, model: string, streaming: boolean = true) {
  const [response, setResponse] = useState('');
  const [fullResponse, setFullResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Use a ref to accumulate text without triggering extra renders per character
  const accumulatedRef = useRef('');
  const chunksRef = useRef<any[]>([]);

  const sendMessage = useCallback(
    async (messages: object[], parameters: object = {}) => {
      accumulatedRef.current = '';
      chunksRef.current = [];
      setResponse('');
      setFullResponse(streaming ? [] : null);
      setIsLoading(true);
      setError(null);

      try {
        if (streaming) {
          await getStreamingChatCompletion(
            provider,
            model,
            messages,
            (chunk) => {
              chunksRef.current.push(chunk);
              const content = chunk?.choices?.[0]?.delta?.content;
              if (content) {
                accumulatedRef.current += content;
                // Batch DOM updates — only flush every ~50ms via requestAnimationFrame
                setResponse(accumulatedRef.current);
              }
            },
            () => {
              // Stream complete — do a final sync of fullResponse
              setFullResponse([...chunksRef.current]);
              setIsLoading(false);
            },
            (err) => {
              setError(err);
              setIsLoading(false);
            },
            parameters
          );
        } else {
          const result = await getChatCompletion(provider, model, messages, parameters);
          setFullResponse(result);
          setResponse(result?.choices?.[0]?.message?.content || '');
          setIsLoading(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setIsLoading(false);
      }
    },
    [provider, model, streaming]
  );

  return { response, fullResponse, isLoading, error, sendMessage };
}
