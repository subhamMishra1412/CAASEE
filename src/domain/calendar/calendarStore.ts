import { mockEvents } from "@/data/mockData";
import { getEventCalendarDate } from "@/domain/calendar/dateUtils";
import { checkAvailability } from "@/domain/calendar/scheduling/checkAvailability";
import type {
  CalendarDaySummary,
  CalendarEvent,
} from "@/domain/calendar/types";
import { useEffect, useState } from "react";

let calendarEvents: CalendarEvent[] = [...mockEvents];
const listeners = new Set<() => void>();

function notifyListeners(): void {
  listeners.forEach((listener) => listener());
}

export function getCalendarEvents(): CalendarEvent[] {
  return calendarEvents;
}

export function addCalendarEvent(event: CalendarEvent): void {
  const alreadyExists = calendarEvents.some(
    (existingEvent) => existingEvent.id === event.id,
  );

  if (alreadyExists) {
    return;
  }

  calendarEvents = [...calendarEvents, event];
  notifyListeners();
}

export type CalendarScheduleResult =
  | {
      scheduled: true;
    }
  | {
      scheduled: false;
      conflict: CalendarEvent;
    };

export function scheduleCalendarEvent(
  event: CalendarEvent,
): CalendarScheduleResult {
  const currentEvents = getCalendarEvents();

  const duplicate = currentEvents.find(
    (existingEvent) => existingEvent.id === event.id,
  );

  if (duplicate) {
    return {
      scheduled: false,
      conflict: duplicate,
    };
  }

  const availability = checkAvailability(event, currentEvents);

  if (!availability.available) {
    return {
      scheduled: false,
      conflict: availability.conflict,
    };
  }

  addCalendarEvent(event);

  const wasAdded = getCalendarEvents().some(
    (existingEvent) => existingEvent.id === event.id,
  );

  if (!wasAdded) {
    return {
      scheduled: false,
      conflict: event,
    };
  }

  return {
    scheduled: true,
  };
}

export type CalendarRescheduleResult =
  | {
      rescheduled: true;
      event: CalendarEvent;
    }
  | {
      rescheduled: false;
      conflict: CalendarEvent;
    };

export function rescheduleCalendarEvent(
  existingEventId: string,
  proposedEvent: CalendarEvent,
): CalendarRescheduleResult {
  /*
   * Re-read the calendar at execution time.
   *
   * The proposal may have been created several seconds earlier,
   * so availability must never rely only on the earlier UI check.
   */
  const currentEvents = getCalendarEvents();

  const existingEvent = currentEvents.find(
    (event) => event.id === existingEventId,
  );

  if (!existingEvent) {
    return {
      rescheduled: false,
      conflict: proposedEvent,
    };
  }

  /*
   * The event being rescheduled must not conflict with itself.
   */
  const otherEvents = currentEvents.filter(
    (event) => event.id !== existingEventId,
  );

  /*
   * Final execution-time validation.
   */
  const availability = checkAvailability(proposedEvent, otherEvents);

  if (!availability.available) {
    return {
      rescheduled: false,
      conflict: availability.conflict,
    };
  }

  /*
   * Preserve the existing event's identity and metadata.
   * Only the scheduled time changes.
   */
  const updatedEvent: CalendarEvent = {
    ...existingEvent,
    startAt: proposedEvent.startAt,
    endAt: proposedEvent.endAt,
  };

  /*
   * Replace the existing event instead of creating a new one.
   */
  calendarEvents = currentEvents.map((event) =>
    event.id === existingEventId ? updatedEvent : event,
  );

  notifyListeners();

  /*
   * Verify that the replacement actually exists in calendar state.
   */
  const wasRescheduled = getCalendarEvents().some(
    (event) =>
      event.id === existingEventId &&
      event.startAt === updatedEvent.startAt &&
      event.endAt === updatedEvent.endAt,
  );

  if (!wasRescheduled) {
    return {
      rescheduled: false,
      conflict: existingEvent,
    };
  }

  return {
    rescheduled: true,
    event: updatedEvent,
  };
}

export function subscribeCalendarEvents(listener: () => void): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function useCalendarEvents(): CalendarEvent[] {
  const [events, setEvents] = useState<CalendarEvent[]>(calendarEvents);

  useEffect(() => {
    return subscribeCalendarEvents(() => {
      setEvents([...calendarEvents]);
    });
  }, []);

  return events;
}

export function getCalendarDaySummaries(
  events: CalendarEvent[],
): CalendarDaySummary[] {
  const counts = new Map<string, number>();

  events.forEach((event) => {
    const date = getEventCalendarDate(event);
    counts.set(date, (counts.get(date) ?? 0) + 1);
  });

  return Array.from(counts.entries()).map(([date, count]) => ({
    date,
    events: count,
  }));
}
