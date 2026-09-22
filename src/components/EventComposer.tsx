import { useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";

import { parseEventInput } from "@/domain/calendar/eventComposer";
import type { CalendarEvent } from "@/domain/calendar/types";

type EventComposerProps = {
  colors: {
    text: string;
    mutedText: string;
    card: string;
    border: string;
    primary: string;
    background: string;
  };
  onEventIntent?: (event: {
    title: string;
    startAt: string;
    endAt: string;
    timezone: string;
    location?: string;
    description?: string;
    participant?: string;
  }) => void;
  onSchedule?: (event: CalendarEvent) => void;
};

export default function EventComposer({
  colors,
  onEventIntent,
  onSchedule,
}: EventComposerProps) {
  const [text, setText] = useState("");
  const [pendingRequest, setPendingRequest] = useState<string | null>(null);
  const [clarification, setClarification] = useState<string | null>(null);
  const [proposedEvent, setProposedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [scheduled, setScheduled] = useState(false);

  const handleSubmit = () => {
    const currentText = text.trim();

    if (!currentText) {
      return;
    }

    const fullRequest = pendingRequest
      ? `${pendingRequest} ${currentText}`
      : currentText;

    const parsed = parseEventInput(fullRequest);

    if (!parsed.date) {
      setPendingRequest(fullRequest);
      setClarification("What day should I schedule it?");
      setText("");
      return;
    }

    if (!parsed.time) {
      setPendingRequest(fullRequest);
      setClarification("What time should I schedule it?");
      setText("");
      return;
    }

    const [timePart, period] = parsed.time.split(" ");
    const [hourString, minuteString] = timePart.split(":");

    let hour = Number(hourString);
    const minute = Number(minuteString);

    if (period === "AM" && hour === 12) {
      hour = 0;
    }

    if (period === "PM" && hour !== 12) {
      hour += 12;
    }

    const start = new Date(parsed.date);
    start.setHours(hour, minute, 0, 0);

    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 60);

    const calendarEvent: CalendarEvent = {
      id: `local-${Date.now()}`,
      title: parsed.title,
      startAt: start.toISOString(),
      endAt: end.toISOString(),
      timezone: "Asia/Kolkata",
      location: parsed.location,
      description: parsed.attendee
        ? `Meeting with ${parsed.attendee}`
        : undefined,
      source: "ai",
    };

    onEventIntent?.({
      title: calendarEvent.title,
      startAt: calendarEvent.startAt,
      endAt: calendarEvent.endAt,
      timezone: calendarEvent.timezone,
      location: calendarEvent.location,
      description: calendarEvent.description,
      participant: parsed.attendee,
    });

    setProposedEvent(calendarEvent);
    setPendingRequest(null);
    setClarification(null);
    setText("");
    setScheduled(false);
  };

  const handleSchedule = () => {
    if (!proposedEvent) {
      return;
    }

    onSchedule?.(proposedEvent);

    setScheduled(true);
    setProposedEvent(null);
  };

  const handleCancel = () => {
    setProposedEvent(null);
    setPendingRequest(null);
    setClarification(null);
    setScheduled(false);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: colors.text }]}>
        Schedule with AI
      </Text>

      <Text style={[styles.subtitle, { color: colors.mutedText }]}>
        Tell me what you want to schedule.
      </Text>

      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="e.g. Meeting with Rahul tomorrow at 8 PM at the office"
        placeholderTextColor={colors.mutedText}
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
        multiline
        onSubmitEditing={handleSubmit}
      />

      {clarification ? (
        <View
          style={[
            styles.clarification,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.clarificationText, { color: colors.text }]}>
            {clarification}
          </Text>
        </View>
      ) : null}

      <Pressable
        onPress={handleSubmit}
        style={[
          styles.primaryButton,
          {
            backgroundColor: colors.primary,
          },
        ]}
      >
        <Text style={styles.primaryButtonText}>Create Event</Text>
      </Pressable>

      {proposedEvent ? (
        <View
          style={[
            styles.proposalCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.proposalTitle, { color: colors.text }]}>
            Confirm event
          </Text>

          <Text style={[styles.eventTitle, { color: colors.text }]}>
            {proposedEvent.title}
          </Text>

          <Text style={[styles.eventDetail, { color: colors.mutedText }]}>
            {new Date(proposedEvent.startAt).toLocaleString()}
          </Text>

          {proposedEvent.location ? (
            <Text style={[styles.eventDetail, { color: colors.mutedText }]}>
              {proposedEvent.location}
            </Text>
          ) : null}

          {proposedEvent.description ? (
            <Text style={[styles.eventDetail, { color: colors.mutedText }]}>
              {proposedEvent.description}
            </Text>
          ) : null}

          <View style={styles.actions}>
            <Pressable
              onPress={handleCancel}
              style={[
                styles.secondaryButton,
                {
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.secondaryText, { color: colors.text }]}>
                Cancel
              </Text>
            </Pressable>

            <Pressable
              onPress={handleSchedule}
              style={[
                styles.primaryButton,
                {
                  backgroundColor: colors.primary,
                },
              ]}
            >
              <Text style={styles.primaryButtonText}>Schedule</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      {scheduled ? (
        <Text style={[styles.success, { color: colors.primary }]}>
          Scheduled successfully.
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
  },
  input: {
    minHeight: 90,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    textAlignVertical: "top",
    fontSize: 15,
  },
  clarification: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  clarificationText: {
    fontSize: 14,
  },
  primaryButton: {
    minHeight: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  proposalCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  proposalTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  eventDetail: {
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 46,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: {
    fontSize: 15,
    fontWeight: "600",
  },
  success: {
    fontSize: 14,
    fontWeight: "600",
  },
});
