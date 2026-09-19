import { Colors } from "@/constants/theme";
import type { CalendarEvent } from "@/domain/calendar/types";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { EventCard } from "./EventCard";

interface ScheduleSectionProps {
  events: CalendarEvent[];
  onViewAll: () => void;
  colors: (typeof Colors)["light"];
}

export function ScheduleSection({
  events,
  onViewAll,
  colors,
}: ScheduleSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Today's Schedule
        </Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={[styles.viewAll, { color: colors.textSecondary }]}>
            View All →
          </Text>
        </TouchableOpacity>
      </View>

      {events && events.length > 0 ? (
        <View style={styles.eventsList}>
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              size="compact"
              colors={colors}
            />
          ))}
        </View>
      ) : (
        <View
          style={[styles.empty, { backgroundColor: colors.cardBackground }]}
        >
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No events scheduled today
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.border }]}>
            Your day is wide open
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  viewAll: {
    fontSize: 13,
    fontWeight: "500",
  },
  eventsList: {
    gap: 2,
  },
  empty: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "500",
  },
  emptySubtext: {
    fontSize: 12,
    marginTop: 4,
  },
});
