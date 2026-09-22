export interface EventDraft {
  title: string;
  attendee?: string;
  date?: Date;
  time?: string;
  location?: string;
  rawText: string;
}

function getTomorrow(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}

function parseTime(text: string): string | undefined {
  const match = text.match(/\b(\d{1,2})(?::(\d{2}))?\s*(AM|PM)\b/i);

  if (!match) {
    return undefined;
  }

  const hour = Number(match[1]);
  const minute = match[2] ?? "00";
  const meridiem = match[3].toUpperCase();

  return `${hour}:${minute} ${meridiem}`;
}

function parseLocation(text: string): string | undefined {
  const match = text.match(
    /\bat\s+(?:the\s+)?(.+?)(?:\s+tomorrow|\s+today|$)/i,
  );

  return match?.[1]?.trim();
}

function parseAttendee(text: string): string | undefined {
  const match = text.match(
    /\bwith\s+([A-Za-z][A-Za-z\s'-]*?)(?=\s+(?:tomorrow|today|at)\b|[.!?]|$)/i,
  );

  return match?.[1]?.trim();
}

function parseTitle(text: string): string {
  const match = text.match(
    /\bschedule\s+(?:a|an)\s+(.+?)(?=\s+with\s+|\s+tomorrow|\s+today|\s+at\s+|$)/i,
  );

  if (match?.[1]) {
    return match[1].trim();
  }

  return "New Event";
}

export function parseEventInput(text: string): EventDraft {
  const normalized = text.trim();

  const draft: EventDraft = {
    title: parseTitle(normalized),
    attendee: parseAttendee(normalized),
    time: parseTime(normalized),
    location: parseLocation(normalized),
    rawText: normalized,
  };

  if (/\btomorrow\b/i.test(normalized)) {
    draft.date = getTomorrow();
  } else if (/\btoday\b/i.test(normalized)) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    draft.date = today;
  }

  return draft;
}

export function formatEventDate(date?: Date): string {
  if (!date) {
    return "Date not specified";
  }

  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}
