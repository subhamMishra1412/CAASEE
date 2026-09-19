import { Colors } from "@/constants/theme";
import type { CalendarEvent } from "@/domain/calendar/types";
import {
  formatEventDuration,
  formatEventTime,
} from "@/presentation/calendar/formatters";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface EventCardProps {
  event: CalendarEvent;
  onPress?: () => void;
  size?: "default" | "compact";
  colors: (typeof Colors)["light"];
}

export function EventCard({
  event,
  onPress,
  size = "default",
  colors,
}: EventCardProps) {
  const isInteractive = Boolean(onPress);
  const eventColors =
    event.source === "ai"
      ? { background: "#f3e5f5", text: "#6a1b9a" }
      : { background: colors.cardBackground, text: colors.text };
  const timeLabel = formatEventTime(event);
  const durationLabel = formatEventDuration(event);

  if (size === "compact") {
    return (
      <TouchableOpacity
        style={[styles.compactContainer, { backgroundColor: eventColors.background }]}
        onPress={onPress}
        disabled={!isInteractive}
        accessibilityHint={
          isInteractive ? undefined : "Event details are planned for Task 003"
        }
        activeOpacity={isInteractive ? 0.7 : 1}
      >
        <Text style={[styles.compactTime, { color: eventColors.text }]}>
          {timeLabel}
        </Text>
        <Text style={[styles.compactTitle, { color: eventColors.text }]}>
          {event.title}
        </Text>
        {event.source === "ai" && (
          <Text style={[styles.aiTag, { color: eventColors.text }]}>AI</Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: eventColors.background }]}
      onPress={onPress}
      disabled={!isInteractive}
      accessibilityHint={
        isInteractive ? undefined : "Event details are planned for Task 003"
      }
      activeOpacity={isInteractive ? 0.7 : 1}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: eventColors.text }]}>{event.title}</Text>
        {event.source === "ai" && (
          <View style={[styles.aiIndicator, { backgroundColor: eventColors.text }]}>
            <Text style={styles.aiDot}>✦</Text>
          </View>
        )}
      </View>

      <View style={styles.details}>
        <Text style={[styles.time, { color: eventColors.text }]}>
          {timeLabel}{durationLabel ? ` · ${durationLabel}` : ""}
        </Text>
        {event.description && (
          <Text style={[styles.description, { color: eventColors.text, opacity: 0.7 }]}>
            {event.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 14,
    marginVertical: 8,
    marginHorizontal: 0,
  },
  compactContainer: {
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },
  aiIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  aiDot: {
    fontSize: 12,
  },
  details: {
    gap: 4,
  },
  time: {
    fontSize: 13,
    fontWeight: "500",
  },
  description: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "400",
  },
  compactTime: {
    fontSize: 12,
    fontWeight: "600",
    flex: 0.25,
  },
  compactTitle: {
    fontSize: 13,
    fontWeight: "500",
    flex: 0.65,
  },
  aiTag: {
    fontSize: 10,
    fontWeight: "700",
    flex: 0.1,
    textAlign: "right",
  },
});
