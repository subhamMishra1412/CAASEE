import type { CalendarDaySummary, CalendarEvent } from "@/domain/calendar/types";

export const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Project Planning",
    startAt: "2026-09-19T09:00:00+05:30",
    endAt: "2026-09-19T10:00:00+05:30",
    timezone: "Asia/Kolkata",
    description: "Team sync on Q4 roadmap",
    location: "Conference room A",
    source: "manual",
  },
  {
    id: "2",
    title: "Code Review",
    startAt: "2026-09-19T11:30:00+05:30",
    endAt: "2026-09-19T12:15:00+05:30",
    timezone: "Asia/Kolkata",
    description: "PR feedback session",
    source: "manual",
  },
  {
    id: "3",
    title: "Focus Time",
    startAt: "2026-09-19T14:00:00+05:30",
    endAt: "2026-09-19T16:00:00+05:30",
    timezone: "Asia/Kolkata",
    description: "Deep work block",
    source: "ai",
  },
];

export const mockCalendarEvents: CalendarDaySummary[] = [
  { date: "2026-09-19", events: 3 },
  { date: "2026-09-20", events: 2 },
  { date: "2026-09-21", events: 4 },
  { date: "2026-09-22", events: 1 },
  { date: "2026-09-23", events: 2 },
  { date: "2026-09-24", events: 0 },
  { date: "2026-09-25", events: 3 },
];

export const mockTasks = [
  {
    id: "1",
    title: "Finish DevSphere dashboard",
    priority: "high" as const,
    dueDate: "Today",
    completed: false,
  },
  {
    id: "2",
    title: "Update portfolio projects",
    priority: "medium" as const,
    dueDate: "Tomorrow",
    completed: false,
  },
  {
    id: "3",
    title: "Review master's programs",
    priority: "medium" as const,
    dueDate: "This week",
    completed: false,
  },
];

export const userProfile = {
  name: "Subham",
  email: "subham@example.com",
  timezone: "IST (UTC+5:30)",
  location: "Bengaluru, India",
  workStyle: "Single-task focused",
};
