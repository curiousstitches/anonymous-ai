export type EventSeverity = 'info' | 'warning' | 'error' | 'success';
export type EventCategory = 'auth' | 'api' | 'usage' | 'system' | 'chat';

export interface PlatformEvent {
  id: string;
  timestamp: Date;
  category: EventCategory;
  severity: EventSeverity;
  title: string;
  detail?: string;
  user?: string;
  provider?: string;
  meta?: Record<string, string | number | boolean>;
}

// In-memory ring buffer — keeps the last 500 events
const MAX_EVENTS = 500;
const events: PlatformEvent[] = [];
let counter = 0;

function nextId(): string {
  return `evt-${Date.now()}-${++counter}`;
}

export function logEvent(
  category: EventCategory,
  severity: EventSeverity,
  title: string,
  options: {
    detail?: string;
    user?: string;
    provider?: string;
    meta?: Record<string, string | number | boolean>;
  } = {}
): PlatformEvent {
  const event: PlatformEvent = {
    id: nextId(),
    timestamp: new Date(),
    category,
    severity,
    title,
    ...options,
  };

  events.unshift(event); // newest first
  if (events.length > MAX_EVENTS) events.splice(MAX_EVENTS);

  return event;
}

export function getEvents(limit = 100, filterCategory?: EventCategory): PlatformEvent[] {
  const filtered = filterCategory ? events.filter((e) => e.category === filterCategory) : events;
  return filtered.slice(0, limit);
}

export function clearEvents(): void {
  events.splice(0, events.length);
}

// Seed a few startup events so the log isn't empty on first load
logEvent('system', 'info', 'Platform started', { detail: 'CodePilot application initialized' });
