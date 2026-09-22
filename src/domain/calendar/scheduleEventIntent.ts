type ScheduleEventIntent = {
  title: string;
  startAt: string;
  endAt: string;
  timezone: string;
  location?: string;
  description?: string;
  participant?: string;
};
