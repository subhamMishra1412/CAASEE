import type { ScheduleEventIntent } from "@/domain/calendar/scheduleEventIntent";
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
};

export function EventComposer({ colors, onEventIntent }: EventComposerProps) {
  const [text, setText] = useState("");
  const [proposedEvent, setProposedEvent] =
    useState<ScheduleEventIntent | null>(null);

  const handleSubmit = () => {
    if (!text.trim()) return;

    // Temporary frontend representation.
    // AI parsing will replace this later.
    const event: ScheduleEventIntent = {
      title: "Meeting with Rahul",
      startAt: "2026-09-23T20:00:00+05:30",
      endAt: "2026-09-23T21:00:00+05:30",
      timezone: "Asia/Kolkata",
      location: "Office",
      participant: "Rahul",
    };

    setProposedEvent(event);
    onEventIntent?.(event);
  };

  const handleCancel = () => {
    setProposedEvent(null);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>
        What would you like to schedule?
      </Text>

      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="e.g. Schedule a meeting with Rahul tomorrow at 8 PM at the office"
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

      {proposedEvent && (
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
            Tomorrow
          </Text>

          <Text style={[styles.eventTime, { color: colors.text }]}>
            8:00 PM – 9:00 PM
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
              onPress={() => {
                // Intentionally empty.
                // Calendar creation will be implemented later.
              }}
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
});
