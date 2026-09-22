import type { CalendarEvent } from "@/domain/calendar/types";

export type AvailabilityResult =
  | {
      available: true;
    }
  | {
      available: false;
      conflict: CalendarEvent;
    };

function eventsOverlap(
  proposedEvent: CalendarEvent,
  existingEvent: CalendarEvent,
): boolean {
  const proposedStart = new Date(proposedEvent.startAt).getTime();
  const proposedEnd = new Date(proposedEvent.endAt).getTime();

  const existingStart = new Date(existingEvent.startAt).getTime();
  const existingEnd = new Date(existingEvent.endAt).getTime();

  return proposedStart < existingEnd && proposedEnd > existingStart;
}

export function checkAvailability(
  proposedEvent: CalendarEvent,
  existingEvents: CalendarEvent[],
): AvailabilityResult {
  const conflict = existingEvents.find((event) =>
    eventsOverlap(proposedEvent, event),
  );

  if (conflict) {
    return {
      available: false,
      conflict,
    };
  }

  return {
    available: true,
  };
}
