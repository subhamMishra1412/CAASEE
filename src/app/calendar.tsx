import { CalendarGrid } from "@/components/CalendarGrid";
import { EventCard } from "@/components/EventCard";
import { Colors } from "@/constants/theme";
import { mockCalendarEvents, mockEvents } from "@/data/mockData";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type ViewType = "month" | "week" | "day";

export default function CalendarScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const [view, setView] = useState<ViewType>("month");
  const [displayedMonth, setDisplayedMonth] = useState(() => {
    const currentDate = new Date();
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const views: ViewType[] = ["month", "week", "day"];
  const monthLabel = displayedMonth.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
  const todayLabel = new Date().toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
  });
  const selectedDateLabel = selectedDate.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const weekStart = new Date(selectedDate);
  weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const weekRangeLabel = `${weekStart.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })} – ${weekEnd.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })}`;

  const changeMonth = (offset: number) => {
    setDisplayedMonth(
      (currentMonth) =>
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1),
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.dateText, { color: colors.text }]}>
            {monthLabel}
          </Text>
          <Text style={[styles.currentDate, { color: colors.textSecondary }]}>
            Today is {todayLabel}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.profileButton,
            { backgroundColor: colors.cardBackground },
          ]}
          onPress={() => router.push("/profile")}
        >
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.monthNavigation}>
        <TouchableOpacity
          accessibilityLabel="Previous month"
          style={[styles.navigationButton, { backgroundColor: colors.cardBackground }]}
          onPress={() => changeMonth(-1)}
        >
          <Text style={[styles.navigationIcon, { color: colors.text }]}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityLabel="Next month"
          style={[styles.navigationButton, { backgroundColor: colors.cardBackground }]}
          onPress={() => changeMonth(1)}
        >
          <Text style={[styles.navigationIcon, { color: colors.text }]}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* View Selector */}
      <View
        style={[
          styles.viewSelector,
          { backgroundColor: colors.cardBackground },
        ]}
      >
        {views.map((v) => (
          <TouchableOpacity
            key={v}
            style={[
              styles.viewButton,
              view === v && [
                styles.activeView,
                { backgroundColor: colors.text },
              ],
            ]}
            onPress={() => setView(v)}
          >
            <Text
              style={[
                styles.viewButtonText,
                view === v && [
                  styles.activeViewText,
                  { color: colors.background },
                ],
                view !== v && { color: colors.textSecondary },
              ]}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Calendar Grid */}
      {view === "month" && (
        <CalendarGrid
          events={mockCalendarEvents}
          colors={colors}
          month={displayedMonth}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      )}

      {/* Week View Placeholder */}
      {view === "week" && (
        <View
          style={[
            styles.viewPlaceholder,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <Text style={[styles.placeholderText, { color: colors.text }]}>
            Week view coming soon
          </Text>
          <Text
            style={[styles.placeholderSubtext, { color: colors.textSecondary }]}
          >
            {weekRangeLabel}
          </Text>
        </View>
      )}

      {/* Day View */}
      {view === "day" && (
        <View style={styles.dayViewContainer}>
          <Text style={[styles.dayViewDate, { color: colors.text }]}>
            {selectedDateLabel}
          </Text>
          <View style={styles.timelineContainer}>
            {mockEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                colors={colors}
              />
            ))}
          </View>
        </View>
      )}

      {/* Upcoming Events Section */}
      <View style={styles.upcomingSection}>
        <Text style={[styles.upcomingTitle, { color: colors.text }]}>
          Upcoming Events
        </Text>
        {mockEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            colors={colors}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  dateText: {
    fontSize: 26,
    fontWeight: "700",
  },
  currentDate: {
    fontSize: 13,
    marginTop: 4,
    fontWeight: "500",
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  profileIcon: {
    fontSize: 18,
  },
  monthNavigation: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginBottom: 12,
  },
  navigationButton: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  navigationIcon: {
    fontSize: 12,
    fontWeight: "600",
  },
  viewSelector: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
    padding: 4,
    borderRadius: 10,
  },
  viewButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  activeView: {
    borderRadius: 8,
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  activeViewText: {
    fontWeight: "600",
  },
  viewPlaceholder: {
    borderRadius: 12,
    paddingVertical: 48,
    paddingHorizontal: 20,
    alignItems: "center",
    marginVertical: 20,
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: "600",
  },
  placeholderSubtext: {
    fontSize: 12,
    marginTop: 4,
  },
  dayViewContainer: {
    marginVertical: 20,
  },
  dayViewDate: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 16,
  },
  timelineContainer: {
    gap: 2,
  },
  upcomingSection: {
    marginTop: 28,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 14,
    letterSpacing: 0.3,
  },
});
