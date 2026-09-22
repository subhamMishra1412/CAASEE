import type { EventDraft } from "@/domain/calendar/eventComposer";
import type { CalendarEvent } from "@/domain/calendar/types";

export type RescheduleProposal = {
  type: "proposal";
  existingEvent: CalendarEvent;
  proposedEvent: CalendarEvent;
};

export type RescheduleClarification = {
  type: "clarification";
  message: string;
};

export type RescheduleNotFound = {
  type: "not_found";
  message: string;
};

export type RescheduleEventResult =
  | RescheduleProposal
  | RescheduleClarification
  | RescheduleNotFound;

function buildDateTime(date: Date, time: string): Date | null {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!match) {
    return null;
  }

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const meridiem = match[3].toUpperCase();

  if (hour < 1 || hour > 12 || minute > 59) {
    return null;
  }

  if (meridiem === "PM" && hour !== 12) {
    hour += 12;
  }

  if (meridiem === "AM" && hour === 12) {
    hour = 0;
  }

  const result = new Date(date);
  result.setHours(hour, minute, 0, 0);

  return result;
}

function normalizeTitle(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function eventMatchesTarget(
  event: CalendarEvent,
  targetTitle: string,
): boolean {
  const eventTitle = normalizeTitle(event.title);
  const target = normalizeTitle(targetTitle);

  if (!eventTitle || !target) {
    return false;
  }

  return (
    eventTitle === target ||
    eventTitle.includes(target) ||
    target.includes(eventTitle)
  );
}

function findTargetEvent(
  targetTitle: string | undefined,
  existingEvents: CalendarEvent[],
): CalendarEvent | null {
  if (!targetTitle) {
    return null;
  }

  return (
    existingEvents.find((event) => eventMatchesTarget(event, targetTitle)) ??
    null
  );
}

export function createRescheduleProposal(
  draft: EventDraft,
  existingEvents: CalendarEvent[],
): RescheduleEventResult {
  if (!draft.date || !draft.time) {
    if (!draft.date && !draft.time) {
      return {
        type: "clarification",
        message: "What new date and time should I move the event to?",
      };
    }
    if (!draft.date) {
      return {
        type: "clarification",
        message: "What new date should I move the event to?",
      };
    }

    return {
      type: "clarification",
      message: "What new time should I move the event to?",
    };
  }

  if (!draft.targetTitle) {
    return {
      type: "not_found",
      message: "Which existing event should I reschedule?",
    };
  }

  const existingEvent = findTargetEvent(draft.targetTitle, existingEvents);

  if (!existingEvent) {
    return {
      type: "not_found",
      message: `I couldn't find an existing event matching "${draft.targetTitle}".`,
    };
  }

  const start = buildDateTime(draft.date, draft.time);

  if (!start) {
    return {
      type: "clarification",
      message: "What new time should I move the event to?",
    };
  }

  const duration =
    new Date(existingEvent.endAt).getTime() -
    new Date(existingEvent.startAt).getTime();

  const end = new Date(start.getTime() + duration);

  const proposedEvent: CalendarEvent = {
    ...existingEvent,
    startAt: start.toISOString(),
    endAt: end.toISOString(),
  };

  return {
    type: "proposal",
    existingEvent,
    proposedEvent,
  };
}
