'use client';

export function isSchemaError(error: any): boolean {
  if (!error) return false;
  if (error.code && typeof error.code === 'string') {
    const errorClass = error.code.substring(0, 2);
    if (errorClass === '42') return true;
    if (errorClass === '23') return false;
    if (errorClass === '08') return true;
  }
  if (error.message) {
    return [/relation.*does not exist/i, /column.*does not exist/i, /function.*does not exist/i, /syntax error/i].some((pattern) => pattern.test(error.message));
  }
  return false;
}

export function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeLocal<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(`studio-store:${key}`));
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel(`studio-store:${key}`);
      channel.postMessage({ key, at: Date.now() });
      channel.close();
    }
  } catch {
    // ignore storage issues
  }
}

export function subscribeToLocalStore(key: string, onChange: () => void) {
  if (typeof window === 'undefined') return () => {};

  const handleStorage = (event: StorageEvent) => {
    if (event.key === key) onChange();
  };
  const handleCustom = () => onChange();

  window.addEventListener('storage', handleStorage);
  window.addEventListener(`studio-store:${key}`, handleCustom as EventListener);

  let channel: BroadcastChannel | null = null;
  if ('BroadcastChannel' in window) {
    channel = new BroadcastChannel(`studio-store:${key}`);
    channel.onmessage = () => onChange();
  }

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(`studio-store:${key}`, handleCustom as EventListener);
    channel?.close();
  };
}
