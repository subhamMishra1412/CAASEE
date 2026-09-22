import { checkAvailability } from "@/domain/calendar/scheduling/checkAvailability";
import type { CalendarEvent } from "@/domain/calendar/types";

const SEARCH_OFFSETS_HOURS = [1, 2, 3, -1, -2, -3];

export function suggestAlternativeTimes(
  proposedEvent: CalendarEvent,
  existingEvents: CalendarEvent[],
): CalendarEvent[] {
  const duration =
    new Date(proposedEvent.endAt).getTime() -
    new Date(proposedEvent.startAt).getTime();

  return SEARCH_OFFSETS_HOURS.reduce<CalendarEvent[]>(
    (alternatives, offset) => {
      const start = new Date(proposedEvent.startAt);
      start.setHours(start.getHours() + offset);

      const end = new Date(start.getTime() + duration);

      const alternative: CalendarEvent = {
        ...proposedEvent,
        id: `${proposedEvent.id}-alternative-${offset}`,
        startAt: start.toISOString(),
        endAt: end.toISOString(),
      };

      const availability = checkAvailability(alternative, existingEvents);

      if (availability.available) {
        alternatives.push(alternative);
      }

      return alternatives;
    },
    [],
  );
}
