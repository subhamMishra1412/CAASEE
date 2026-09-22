import { mockEvents } from "@/data/mockData";
import { checkAvailability } from "@/domain/calendar/scheduling/checkAvailability";
import type {
  CalendarDaySummary,
  CalendarEvent,
} from "@/domain/calendar/types";
import { useEffect, useState } from "react";

let calendarEvents: CalendarEvent[] = [...mockEvents];
const listeners = new Set<() => void>();

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
  listeners.forEach((listener) => listener());
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
    const date = event.startAt.slice(0, 10);
    counts.set(date, (counts.get(date) ?? 0) + 1);
  });

  return Array.from(counts.entries()).map(([date, count]) => ({
    date,
    events: count,
  }));
}
