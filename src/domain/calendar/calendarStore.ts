import { getEventCalendarDate } from "@/domain/calendar/dateUtils";
import { checkAvailability } from "@/domain/calendar/scheduling/checkAvailability";
import type {
  CalendarDaySummary,
  CalendarEvent,
} from "@/domain/calendar/types";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

let calendarEvents: CalendarEvent[] = [];
let currentUserId: string | null = null;
let loading = false;

const listeners = new Set<() => void>();

function notifyListeners(): void {
  listeners.forEach((listener) => listener());
}

function mapDatabaseEvent(row: {
  id: string;
  title: string;
  start_at: string;
  end_at: string;
  timezone: string;
  description: string | null;
  location: string | null;
  source: "manual" | "ai";
}): CalendarEvent {
  return {
    id: row.id,
    title: row.title,
    startAt: row.start_at,
    endAt: row.end_at,
    timezone: row.timezone,
    description: row.description ?? undefined,
    location: row.location ?? undefined,
    source: row.source,
  };
}

async function getAuthenticatedUserId(): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

export async function loadCalendarEvents(): Promise<void> {
  if (loading) {
    return;
  }

  loading = true;

  try {
    const userId = await getAuthenticatedUserId();

    /*
     * No authenticated user means there is no private calendar
     * that should be loaded into client state.
     */
    if (!userId) {
      currentUserId = null;
      calendarEvents = [];
      notifyListeners();
      return;
    }

    /*
     * If the authenticated user changed, discard the previous
     * user's in-memory calendar immediately.
     */
    if (currentUserId !== userId) {
      currentUserId = userId;
      calendarEvents = [];
      notifyListeners();
    }

    const { data, error } = await supabase
      .from("calendar_events")
      .select("id,title,start_at,end_at,timezone,description,location,source")
      .eq("user_id", userId)
      .order("start_at", { ascending: true });

    if (error) {
      console.error("Failed to load calendar events:", error);
      return;
    }

    calendarEvents = (data ?? []).map(mapDatabaseEvent);
    notifyListeners();
  } finally {
    loading = false;
  }
}

export function getCalendarEvents(): CalendarEvent[] {
  return calendarEvents;
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
    let mounted = true;

    const refresh = async () => {
      await loadCalendarEvents();

      if (mounted) {
        setEvents([...calendarEvents]);
      }
    };

    refresh();

    const unsubscribe = subscribeCalendarEvents(() => {
      if (!mounted) {
        return;
      }

      setEvents([...calendarEvents]);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) {
        return;
      }

      if (!session?.user) {
        currentUserId = null;
        calendarEvents = [];
        notifyListeners();
        return;
      }

      await loadCalendarEvents();
    });

    return () => {
      mounted = false;
      unsubscribe();
      subscription.unsubscribe();
    };
  }, []);

  return events;
}

export type CalendarScheduleResult =
  | {
      scheduled: true;
    }
  | {
      scheduled: false;
      conflict: CalendarEvent;
    };

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

  /*
   * Do not allow a calendar mutation without an authenticated user.
   */
  if (!currentUserId) {
    return {
      scheduled: false,
      conflict: event,
    };
  }

  /*
   * Persist the event using the authenticated user's ID.
   *
   * RLS independently verifies that user_id belongs to auth.uid().
   */
  void supabase
    .from("calendar_events")
    .insert({
      id: event.id,
      user_id: currentUserId,
      title: event.title,
      start_at: event.startAt,
      end_at: event.endAt,
      timezone: event.timezone,
      description: event.description ?? null,
      location: event.location ?? null,
      source: event.source,
    })
    .then(({ error }) => {
      if (error) {
        console.error("Failed to save calendar event:", error);

        /*
         * Roll back the optimistic local event if persistence failed.
         */
        calendarEvents = calendarEvents.filter(
          (existingEvent) => existingEvent.id !== event.id,
        );

        notifyListeners();
      }
    });

  addCalendarEvent(event);

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

  if (!currentUserId) {
    return {
      rescheduled: false,
      conflict: existingEvent,
    };
  }

  /*
   * The event being rescheduled must not conflict with itself.
   */
  const otherEvents = currentEvents.filter(
    (event) => event.id !== existingEventId,
  );

  const availability = checkAvailability(proposedEvent, otherEvents);

  if (!availability.available) {
    return {
      rescheduled: false,
      conflict: availability.conflict,
    };
  }

  const updatedEvent: CalendarEvent = {
    ...existingEvent,
    startAt: proposedEvent.startAt,
    endAt: proposedEvent.endAt,
  };

  /*
   * Update the database using both the event ID and current user ID.
   *
   * RLS provides the actual security boundary.
   */
  void supabase
    .from("calendar_events")
    .update({
      start_at: updatedEvent.startAt,
      end_at: updatedEvent.endAt,
    })
    .eq("id", existingEventId)
    .eq("user_id", currentUserId)
    .then(({ error }) => {
      if (error) {
        console.error("Failed to reschedule calendar event:", error);

        /*
         * Roll back the optimistic update.
         */
        calendarEvents = calendarEvents.map((event) =>
          event.id === existingEventId ? existingEvent : event,
        );

        notifyListeners();
      }
    });

  calendarEvents = currentEvents.map((event) =>
    event.id === existingEventId ? updatedEvent : event,
  );

  notifyListeners();

  return {
    rescheduled: true,
    event: updatedEvent,
  };
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
