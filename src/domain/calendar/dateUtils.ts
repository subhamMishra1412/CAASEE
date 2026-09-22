import type { CalendarEvent } from "@/domain/calendar/types";

export function getEventCalendarDate(event: CalendarEvent): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: event.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(event.startAt));
}

export function formatEventTime(timestamp: string, timezone: string): string {
  return new Intl.DateTimeFormat(undefined, {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export function formatEventDate(timestamp: string, timezone: string): string {
  return new Intl.DateTimeFormat(undefined, {
    timeZone: timezone,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date(timestamp));
}

export function getLocalCalendarDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
