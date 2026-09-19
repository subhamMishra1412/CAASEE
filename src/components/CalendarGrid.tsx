import { Colors } from "@/constants/theme";
import type { CalendarDaySummary } from "@/domain/calendar/types";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CalendarGridProps {
  events?: CalendarDaySummary[];
  colors: (typeof Colors)["light"];
  month: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

function isSameDate(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function CalendarGrid({
  events = [],
  colors,
  month,
  selectedDate,
  onSelectDate,
}: CalendarGridProps) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const startDay = new Date(year, monthIndex, 1).getDay();
  const cellCount = Math.ceil((startDay + daysInMonth) / days.length) * days.length;
  const today = new Date();

  const getDayEvents = (date: Date) => {
    return events.find((event) => event.date === toDateKey(date))?.events || 0;
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
        {Array.from({ length: cellCount }).map((_, index) => {
          const dayNumber = index - startDay + 1;
          const isCurrentMonth = dayNumber >= 1 && dayNumber <= daysInMonth;
          const date = new Date(year, monthIndex, dayNumber);
          const isToday = isCurrentMonth && isSameDate(date, today);
          const isSelected = isCurrentMonth && isSameDate(date, selectedDate);
          const eventCount = isCurrentMonth ? getDayEvents(date) : 0;

          return (
            <TouchableOpacity
              key={index}
              disabled={!isCurrentMonth}
              style={[
                styles.dayCell,
                isSelected && { backgroundColor: colors.text },
                isToday && !isSelected && { borderColor: colors.text, borderWidth: 1 },
                !isCurrentMonth && styles.otherMonthCell,
              ]}
              onPress={() => isCurrentMonth && onSelectDate(date)}
              activeOpacity={0.6}
            >
              <Text
                style={[
                  styles.dayNumber,
                  isSelected && { color: colors.background },
                  !isCurrentMonth && { color: colors.border },
                  !isSelected && { color: colors.text },
                ]}
              >
                {isCurrentMonth ? dayNumber : ""}
              </Text>

              {isCurrentMonth && eventCount > 0 && (
                <View
                  style={[
                    styles.eventDot,
                    isSelected && {
                      backgroundColor: "rgba(255,255,255,0.3)",
                    },
                    !isSelected && {
                      backgroundColor: colors.cardBackground,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.eventCount,
                      !isSelected && { color: colors.text },
                      isSelected && { color: colors.background },
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
