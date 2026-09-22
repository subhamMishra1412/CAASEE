export type EventIntent = "create" | "reschedule";

export interface EventDraft {
  title: string;
  attendee?: string;
  date?: Date;
  time?: string;
  location?: string;
  rawText: string;
  intent: EventIntent;
  targetTitle?: string;
}

function getToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function getTomorrow(): Date {
  const tomorrow = getToday();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
}

function parseTime(text: string): string | undefined {
  const match = text.match(/\b(\d{1,2})(?::(\d{2}))?\s*(AM|PM)\b/i);

  if (!match) {
    return undefined;
  }

  const hour = Number(match[1]);
  const minute = Number(match[2] ?? "0");

  if (hour < 1 || hour > 12 || minute > 59) {
    return undefined;
  }

  return `${hour}:${String(minute).padStart(2, "0")} ${match[3].toUpperCase()}`;
}

function parseLocation(text: string): string | undefined {
  const match = text.match(
    /\bat\s+(?:the\s+)?(.+?)(?=\s+(?:tomorrow|today|on|at)\b|[.!?]|$)/i,
  );

  return match?.[1]?.trim() || undefined;
}

function parseAttendee(text: string): string | undefined {
  const match = text.match(
    /\bwith\s+([A-Za-z][A-Za-z\s'-]*?)(?=\s+(?:tomorrow|today|on|at)\b|[.!?]|$)/i,
  );

  return match?.[1]?.trim() || undefined;
}

function cleanTitle(title: string): string {
  return title
    .replace(/\s+/g, " ")
    .replace(/^(?:a|an|the)\s+/i, "")
    .replace(/^project\s+/i, "")
    .trim();
}

function parseCreateTitle(text: string): string {
  let title = text
    .replace(/^\s*schedule\s+/i, "")
    .replace(/\bwith\s+.+?(?=\s+(?:tomorrow|today|on|at)\b|[.!?]|$)/i, "")
    .replace(
      /\bat\s+(?:the\s+)?(.+?)(?=\s+(?:tomorrow|today|on|at)\b|[.!?]|$)/i,
      "",
    )
    .replace(/\b(?:tomorrow|today)\b/gi, "")
    .replace(/\b\d{1,2}(?::\d{2})?\s*(?:AM|PM)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  title = cleanTitle(title);

  return title || "New Event";
}

function parseRescheduleTarget(text: string): string | undefined {
  const match = text.match(
    /^(?:please\s+)?(?:move|reschedule|shift)\s+(?:my\s+)?(.+?)\s+\bto\b/i,
  );

  if (!match?.[1]) {
    return undefined;
  }

  const target = match[1]
    .replace(/\s+/g, " ")
    .replace(/^(?:the|a|an)\s+/i, "")
    .trim();

  return target || undefined;
}

function isRescheduleRequest(text: string): boolean {
  return /^(?:please\s+)?(?:move|reschedule|shift)\b/i.test(text);
}

function parseRescheduleTitle(text: string): string {
  return parseRescheduleTarget(text) ?? "Existing Event";
}

export function parseEventInput(text: string): EventDraft {
  const normalized = text.trim();
  const intent: EventIntent = isRescheduleRequest(normalized)
    ? "reschedule"
    : "create";

  const draft: EventDraft = {
    title:
      intent === "reschedule"
        ? parseRescheduleTitle(normalized)
        : parseCreateTitle(normalized),
    attendee: parseAttendee(normalized),
    time: parseTime(normalized),
    location: parseLocation(normalized),
    rawText: normalized,
    intent,
    targetTitle:
      intent === "reschedule" ? parseRescheduleTarget(normalized) : undefined,
  };

  if (/\btomorrow\b/i.test(normalized)) {
    draft.date = getTomorrow();
  } else if (/\btoday\b/i.test(normalized)) {
    draft.date = getToday();
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
