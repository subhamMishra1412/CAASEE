export const mockEvents = [
  {
    id: "1",
    title: "Project Planning",
    time: "09:00 AM",
    duration: "1h",
    color: "#e8f5e9",
    textColor: "#2e7d32",
    description: "Team sync on Q4 roadmap",
    isAI: false,
  },
  {
    id: "2",
    title: "Code Review",
    time: "11:30 AM",
    duration: "45m",
    color: "#e3f2fd",
    textColor: "#1565c0",
    description: "PR feedback session",
    isAI: false,
  },
  {
    id: "3",
    title: "Focus Time",
    time: "02:00 PM",
    duration: "2h",
    color: "#f3e5f5",
    textColor: "#6a1b9a",
    description: "Deep work block",
    isAI: true,
  },
];

export const mockCalendarEvents = [
  { date: "19", events: 3 },
  { date: "20", events: 2 },
  { date: "21", events: 4 },
  { date: "22", events: 1 },
  { date: "23", events: 2 },
  { date: "24", events: 0 },
  { date: "25", events: 3 },
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
