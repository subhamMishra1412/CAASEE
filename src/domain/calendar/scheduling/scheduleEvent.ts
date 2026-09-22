import type { EventDraft } from "@/domain/calendar/eventComposer";
import type { CalendarEvent } from "@/domain/calendar/types";

export type SchedulingClarification = {
  type: "clarification";
  missing: Array<"date" | "time">;
  message: string;
};

export type SchedulingProposal = {
  type: "proposal";
  event: CalendarEvent;
};

export type ScheduleEventResult = SchedulingProposal | SchedulingClarification;

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

function getMissingInformation(draft: EventDraft): Array<"date" | "time"> {
  const missing: Array<"date" | "time"> = [];

  if (!draft.date) {
    missing.push("date");
  }

  if (!draft.time) {
    missing.push("time");
  }

  return missing;
}

function formatClarificationMessage(missing: Array<"date" | "time">): string {
  if (missing.length === 2) {
    return "What date and time should I schedule this event?";
  }

  if (missing[0] === "date") {
    return "What date should I schedule this event?";
  }

  return "What time should I schedule this event?";
}

export function createScheduleProposal(draft: EventDraft): ScheduleEventResult {
  const missing = getMissingInformation(draft);

  if (missing.length > 0) {
    return {
      type: "clarification",
      missing,
      message: formatClarificationMessage(missing),
    };
  }

  const start = buildDateTime(draft.date!, draft.time!);

  if (!start) {
    return {
      type: "clarification",
      missing: ["time"],
      message: "What time should I schedule this event?",
    };
  }

  const end = new Date(start);
  end.setHours(end.getHours() + 1);

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  return {
    type: "proposal",
    event: {
      id: `local-${Date.now()}`,
      title: draft.title,
      startAt: start.toISOString(),
      endAt: end.toISOString(),
      timezone,
      location: draft.location,
      description: draft.attendee ? `With ${draft.attendee}` : undefined,
      source: "ai",
    },
  };
}
