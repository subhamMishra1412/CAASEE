/**
 * Shared calendar domain contracts. These are intentionally small while the
 * scheduling architecture is still being defined.
 */
export type CalendarEvent = {
  id: string;
  title: string;
  /** ISO 8601 timestamp, including the source offset. */
  startAt: string;
  /** ISO 8601 timestamp, including the source offset. */
  endAt: string;
  /** IANA time-zone identifier, for example "Asia/Kolkata". */
  timezone: string;
  description?: string;
  location?: string;
  source: "manual" | "ai";
};

export type CalendarDaySummary = {
  /** ISO calendar date in YYYY-MM-DD form. */
  date: string;
  events: number;
};
