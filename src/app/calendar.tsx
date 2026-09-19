import { CalendarGrid } from "@/components/CalendarGrid";
import { EventCard } from "@/components/EventCard";
import { Colors } from "@/constants/theme";
import { mockCalendarEvents, mockEvents } from "@/Data/mockData";
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

  const views: ViewType[] = ["month", "week", "day"];

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
            September 2026
          </Text>
          <Text style={[styles.currentDate, { color: colors.textSecondary }]}>
            Today is the 19th
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
        <CalendarGrid events={mockCalendarEvents} colors={colors} />
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
            Sep 16 - Sep 22
          </Text>
        </View>
      )}

      {/* Day View */}
      {view === "day" && (
        <View style={styles.dayViewContainer}>
          <Text style={[styles.dayViewDate, { color: colors.text }]}>
            Friday, September 19
          </Text>
          <View style={styles.timelineContainer}>
            {mockEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                colors={colors}
                onPress={() => {}}
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
            onPress={() => {}}
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
