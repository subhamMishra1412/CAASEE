import type { ScheduleEventIntent } from "@/domain/calendar/scheduleEventIntent";
import type { CalendarEvent } from "@/domain/calendar/types";
import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type EventComposerProps = {
  colors: {
    text: string;
    textSecondary: string;
    cardBackground: string;
    border: string;
  };
  onEventIntent?: (event: ScheduleEventIntent) => void;
  onSchedule?: (event: CalendarEvent) => void;
};

function parseTime(text: string): { hour: number; minute: number } | null {
  const timeMatch = text.match(/\b(\d{1,2})(?::(\d{2}))?\s*(AM|PM)\b/i);

  if (!timeMatch) {
    return null;
  }

  let hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2] ?? "0");
  const period = timeMatch[3].toUpperCase();

  if (hour < 1 || hour > 12 || minute > 59) {
    return null;
  }

  if (period === "AM" && hour === 12) {
    hour = 0;
  }

  if (period === "PM" && hour !== 12) {
    hour += 12;
  }

  return { hour, minute };
}

function getTomorrowDate(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  return tomorrow;
}

function createIsoWithIndiaOffset(
  date: Date,
  hour: number,
  minute: number,
): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(hour).padStart(2, "0");
  const minutes = String(minute).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:00+05:30`;
}

function formatEventDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatEventTime(hour: number, minute: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${String(minute).padStart(2, "0")} ${period}`;
}

export function EventComposer({
  colors,
  onEventIntent,
  onSchedule,
}: EventComposerProps) {
  const [text, setText] = useState("");
  const [pendingRequest, setPendingRequest] = useState<string | null>(null);
  const [clarification, setClarification] = useState<string | null>(null);
  const [proposedEvent, setProposedEvent] =
    useState<ScheduleEventIntent | null>(null);
  const [scheduled, setScheduled] = useState(false);

  const handleSubmit = () => {
    if (!text.trim()) return;

    const currentText = text.trim();

    // If we previously asked for missing information,
    // combine the original request with the new answer.
    const fullRequest = pendingRequest
      ? `${pendingRequest} ${currentText}`
      : currentText;

    const time = parseTime(fullRequest);

    // Missing time information.
    if (!time) {
      setPendingRequest(fullRequest);
      setClarification("What time should I schedule it?");
      setProposedEvent(null);
      setScheduled(false);
      setText("");
      return;
    }

    const tomorrow = getTomorrowDate();

    const startAt = createIsoWithIndiaOffset(tomorrow, time.hour, time.minute);

    const endHour = time.hour + 1;

    const endDate = new Date(tomorrow);

    if (endHour >= 24) {
      endDate.setDate(endDate.getDate() + 1);
    }

    const endAt = createIsoWithIndiaOffset(endDate, endHour % 24, time.minute);

    // Mock parser.
    const participantMatch = fullRequest.match(
      /with\s+([A-Za-z]+(?:\s+[A-Za-z]+)*)/i,
    );

    const participant = participantMatch?.[1]?.trim();

    const locationMatch = fullRequest.match(
      /\bat\s+(?:the\s+)?(office|home|cafe|school)\b/i,
    );

    const location = locationMatch?.[1]
      ? locationMatch[1].charAt(0).toUpperCase() + locationMatch[1].slice(1)
      : undefined;

    const event: ScheduleEventIntent = {
      title: participant ? `Meeting with ${participant}` : "Meeting",
      startAt,
      endAt,
      timezone: "Asia/Kolkata",
      location,
      participant,
    };

    setPendingRequest(null);
    setClarification(null);
    setScheduled(false);
    setProposedEvent(event);
    setText("");

    onEventIntent?.(event);
  };

  const handleCancel = () => {
    setPendingRequest(null);
    setClarification(null);
    setProposedEvent(null);
    setScheduled(false);
    setText("");
  };

  const handleSchedule = () => {
    if (!proposedEvent) return;

    const calendarEvent: CalendarEvent = {
      id: `local-${Date.now()}`,
      title: proposedEvent.title,
      startAt: proposedEvent.startAt,
      endAt: proposedEvent.endAt,
      timezone: proposedEvent.timezone,
      location: proposedEvent.location,
      description: proposedEvent.description,
      source: "ai",
    };

    onSchedule?.(calendarEvent);

    setScheduled(true);
    setProposedEvent(null);
    setPendingRequest(null);
    setClarification(null);
  };

  const eventStart = proposedEvent ? new Date(proposedEvent.startAt) : null;

  const eventEnd = proposedEvent ? new Date(proposedEvent.endAt) : null;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>
        What would you like to schedule?
      </Text>

      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="e.g. Schedule a meeting with Rahul tomorrow at 8 PM"
        placeholderTextColor={colors.textSecondary}
        multiline
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          },
        ]}
      />

      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: colors.text }]}
        onPress={handleSubmit}
      >
        <Text style={[styles.submitText, { color: colors.cardBackground }]}>
          Understand request
        </Text>
      </TouchableOpacity>

      {clarification && (
        <View
          style={[
            styles.clarificationCard,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.clarificationText, { color: colors.text }]}>
            {clarification}
          </Text>
        </View>
      )}

      {proposedEvent && eventStart && eventEnd && (
        <View
          style={[
            styles.eventCard,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.eventTitle, { color: colors.text }]}>
            {proposedEvent.title}
          </Text>

          <Text style={[styles.eventDate, { color: colors.textSecondary }]}>
            {formatEventDate(eventStart)}
          </Text>

          <Text style={[styles.eventTime, { color: colors.text }]}>
            {formatEventTime(eventStart.getHours(), eventStart.getMinutes())} –{" "}
            {formatEventTime(eventEnd.getHours(), eventEnd.getMinutes())}
          </Text>

          {proposedEvent.location && (
            <Text
              style={[styles.eventLocation, { color: colors.textSecondary }]}
            >
              {proposedEvent.location}
            </Text>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: colors.border }]}
              onPress={handleCancel}
            >
              <Text style={[styles.cancelText, { color: colors.text }]}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.scheduleButton, { backgroundColor: colors.text }]}
              onPress={handleSchedule}
            >
              <Text
                style={[styles.scheduleText, { color: colors.cardBackground }]}
              >
                Schedule
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {scheduled && (
        <View
          style={[
            styles.successCard,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <Text style={[styles.successText, { color: colors.text }]}>
            Scheduled successfully.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },

  input: {
    minHeight: 90,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    textAlignVertical: "top",
  },

  submitButton: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  submitText: {
    fontSize: 14,
    fontWeight: "600",
  },

  clarificationCard: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },

  clarificationText: {
    fontSize: 14,
    fontWeight: "600",
  },

  eventCard: {
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
  },

  eventTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  eventDate: {
    fontSize: 14,
    marginTop: 12,
  },

  eventTime: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },

  eventLocation: {
    fontSize: 14,
    marginTop: 8,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },

  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
  },

  cancelText: {
    fontSize: 14,
    fontWeight: "600",
  },

  scheduleButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
  },

  scheduleText: {
    fontSize: 14,
    fontWeight: "600",
  },

  successCard: {
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
  },

  successText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
