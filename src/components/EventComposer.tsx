import { Colors } from "@/constants/theme";
import {
    EventDraft,
    formatEventDate,
    parseEventInput,
} from "@/domain/calendar/eventComposer";
import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface EventComposerProps {
  colors: (typeof Colors)["light"];
  onEventDraft?: (event: EventDraft) => void;
}

export function EventComposer({ colors, onEventDraft }: EventComposerProps) {
  const [input, setInput] = useState("");
  const [draft, setDraft] = useState<EventDraft | null>(null);

  const handleCompose = () => {
    const value = input.trim();

    if (!value) {
      return;
    }

    const parsedEvent = parseEventInput(value);

    setDraft(parsedEvent);
    onEventDraft?.(parsedEvent);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        Schedule something
      </Text>

      <Text
        style={[
          styles.subtitle,
          {
            color: colors.textSecondary,
          },
        ]}
      >
        Tell CAASEE what you want to schedule.
      </Text>

      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Schedule a meeting with Rahul tomorrow at 8 PM at the office."
        placeholderTextColor={colors.textSecondary}
        multiline
        textAlignVertical="top"
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.background,
            borderColor: colors.border,
          },
        ]}
      />

      <TouchableOpacity
        style={[
          styles.composeButton,
          {
            backgroundColor: colors.text,
            opacity: input.trim() ? 1 : 0.5,
          },
        ]}
        onPress={handleCompose}
        disabled={!input.trim()}
        activeOpacity={0.8}
      >
        <Text style={[styles.composeButtonText, { color: colors.background }]}>
          Compose Event
        </Text>
      </TouchableOpacity>

      {draft && (
        <View
          style={[
            styles.preview,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.previewTitle, { color: colors.text }]}>
            Event preview
          </Text>

          <View style={styles.previewRow}>
            <Text
              style={[styles.previewLabel, { color: colors.textSecondary }]}
            >
              Title
            </Text>

            <Text style={[styles.previewValue, { color: colors.text }]}>
              {draft.title}
            </Text>
          </View>

          {draft.attendee && (
            <View style={styles.previewRow}>
              <Text
                style={[styles.previewLabel, { color: colors.textSecondary }]}
              >
                With
              </Text>

              <Text style={[styles.previewValue, { color: colors.text }]}>
                {draft.attendee}
              </Text>
            </View>
          )}

          {draft.date && (
            <View style={styles.previewRow}>
              <Text
                style={[styles.previewLabel, { color: colors.textSecondary }]}
              >
                Date
              </Text>

              <Text style={[styles.previewValue, { color: colors.text }]}>
                {formatEventDate(draft.date)}
              </Text>
            </View>
          )}

          {draft.time && (
            <View style={styles.previewRow}>
              <Text
                style={[styles.previewLabel, { color: colors.textSecondary }]}
              >
                Time
              </Text>

              <Text style={[styles.previewValue, { color: colors.text }]}>
                {draft.time}
              </Text>
            </View>
          )}

          {draft.location && (
            <View style={styles.previewRow}>
              <Text
                style={[styles.previewLabel, { color: colors.textSecondary }]}
              >
                Location
              </Text>

              <Text style={[styles.previewValue, { color: colors.text }]}>
                {draft.location}
              </Text>
            </View>
          )}

          <View
            style={[
              styles.status,
              {
                backgroundColor: colors.insightBackground,
              },
            ]}
          >
            <Text style={[styles.statusText, { color: colors.textSecondary }]}>
              Draft only — nothing has been added to your calendar yet.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginTop: 24,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
    marginBottom: 14,
  },

  input: {
    minHeight: 100,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    lineHeight: 20,
  },

  composeButton: {
    marginTop: 12,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
  },

  composeButtonText: {
    fontSize: 13,
    fontWeight: "700",
  },

  preview: {
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },

  previewTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
  },

  previewRow: {
    flexDirection: "row",
    marginBottom: 9,
  },

  previewLabel: {
    width: 72,
    fontSize: 12,
    fontWeight: "600",
  },

  previewValue: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
  },

  status: {
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
  },

  statusText: {
    fontSize: 11,
    lineHeight: 15,
  },
});
