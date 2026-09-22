import { mockEvents } from "@/data/mockData";
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
  calendarEvents = [...calendarEvents, even
  listeners.forEach((listener) => listener());
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
