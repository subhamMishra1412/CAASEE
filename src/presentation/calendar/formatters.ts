import type { CalendarEvent } from "@/domain/calendar/types";

export function formatEventTime(event: CalendarEvent) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: event.timezone,
  }).format(new Date(event.startAt));
}

export function formatEventDuration(event: CalendarEvent) {
  const durationInMinutes =
    (new Date(event.endAt).getTime() - new Date(event.startAt).getTime()) / 60000;

  if (!Number.isFinite(durationInMinutes) || durationInMinutes <= 0) {
    return "";
  }

  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;

  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}
