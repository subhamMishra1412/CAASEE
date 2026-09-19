import { Colors } from "@/constants/theme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Event {
  id: string;
  title: string;
  time: string;
  duration: string;
  color: string;
  textColor: string;
  description?: string;
  isAI: boolean;
}

interface EventCardProps {
  event: Event;
  onPress: () => void;
  size?: "default" | "compact";
  colors: (typeof Colors)["light"];
}

export function EventCard({
  event,
  onPress,
  size = "default",
  colors,
}: EventCardProps) {
  if (size === "compact") {
    return (
      <TouchableOpacity
        style={[styles.compactContainer, { backgroundColor: event.color }]}
        onPress={onPress}
      >
        <Text style={[styles.compactTime, { color: event.textColor }]}>
          {event.time}
        </Text>
        <Text style={[styles.compactTitle, { color: event.textColor }]}>
          {event.title}
        </Text>
        {event.isAI && (
          <Text style={[styles.aiTag, { color: event.textColor }]}>AI</Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: event.color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: event.textColor }]}>
          {event.title}
        </Text>
        {event.isAI && (
          <View
            style={[styles.aiIndicator, { backgroundColor: event.textColor }]}
          >
            <Text style={styles.aiDot}>✨</Text>
          </View>
        )}
      </View>

      <View style={styles.details}>
        <Text style={[styles.time, { color: event.textColor }]}>
          {event.time} · {event.duration}
        </Text>
        {event.description && (
          <Text
            style={[
              styles.description,
              { color: event.textColor, opacity: 0.7 },
            ]}
          >
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
