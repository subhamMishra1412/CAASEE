import { Colors } from "@/constants/theme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CalendarEvent {
  date: string;
  events: number;
}

interface CalendarGridProps {
  events?: CalendarEvent[];
  colors: (typeof Colors)["light"];
}

export function CalendarGrid({ events = [], colors }: CalendarGridProps) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const daysInMonth = 30;
  const startDay = 0;
  const today = 19;

  const getDayEvents = (day: number) => {
    return events.find((e) => parseInt(e.date) === day)?.events || 0;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Day labels */}
      <View style={styles.weekHeader}>
        {days.map((day) => (
          <Text
            key={day}
            style={[styles.dayLabel, { color: colors.textSecondary }]}
          >
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.grid}>
        {Array.from({ length: 35 }).map((_, index) => {
          const dayNumber = index - startDay + 1;
          const isCurrentMonth = dayNumber >= 1 && dayNumber <= daysInMonth;
          const isToday = isCurrentMonth && dayNumber === today;
          const eventCount = isCurrentMonth ? getDayEvents(dayNumber) : 0;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                isToday && { backgroundColor: colors.text },
                !isCurrentMonth && styles.otherMonthCell,
              ]}
              activeOpacity={0.6}
            >
              <Text
                style={[
                  styles.dayNumber,
                  isToday && { color: colors.background },
                  !isCurrentMonth && { color: colors.border },
                  !isToday && { color: colors.text },
                ]}
              >
                {isCurrentMonth ? dayNumber : ""}
              </Text>

              {isCurrentMonth && eventCount > 0 && (
                <View
                  style={[
                    styles.eventDot,
                    isToday && {
                      backgroundColor: "rgba(255,255,255,0.3)",
                    },
                    !isToday && {
                      backgroundColor: colors.cardBackground,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.eventCount,
                      !isToday && { color: colors.text },
                      isToday && { color: colors.background },
                    ]}
                  >
                    {eventCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  weekHeader: {
    flexDirection: "row",
    marginBottom: 16,
    justifyContent: "space-around",
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    width: "14.28%",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
    borderRadius: 8,
    position: "relative",
  },
  otherMonthCell: {
    opacity: 0.3,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: "600",
  },
  eventDot: {
    position: "absolute",
    bottom: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  eventCount: {
    fontSize: 9,
    fontWeight: "700",
  },
});
