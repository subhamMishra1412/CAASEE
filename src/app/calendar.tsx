import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { CalendarGrid } from "@/components/CalendarGrid";
import { Colors } from "@/constants/theme";
import {
  getCalendarDaySummaries,
  useCalendarEvents,
} from "@/domain/calendar/calendarStore";

export default function CalendarScreen() {
  const colors = Colors.light;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [month, setMonth] = useState(new Date());

  const calendarEvents = useCalendarEvents();

  const calendarDays = useMemo(
    () => getCalendarDaySummaries(calendarEvents),
    [calendarEvents],
  );

  const selectedDateKey = [
    selectedDate.getFullYear(),
    String(selectedDate.getMonth() + 1).padStart(2, "0"),
    String(selectedDate.getDate()).padStart(2, "0"),
  ].join("-");

  const selectedEvents = calendarEvents.filter(
    (event) => event.startAt.slice(0, 10) === selectedDateKey,
  );

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
    >
      <Text style={[styles.title, { color: colors.text }]}>Calendar</Text>

      <CalendarGrid
        events={calendarDays}
        colors={colors}
        month={month}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      <View style={styles.eventsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Events
        </Text>

        {selectedEvents.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.mutedText }]}>
            No events for this day.
          </Text>
        ) : (
          selectedEvents.map((event) => (
            <View
              key={event.id}
              style={[
                styles.eventCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.eventTitle, { color: colors.text }]}>
                {event.title}
              </Text>

              <Text style={[styles.eventTime, { color: colors.mutedText }]}>
                {new Date(event.startAt).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}{" "}
                –{" "}
                {new Date(event.endAt).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </Text>

              {event.location ? (
                <Text style={[styles.eventDetail, { color: colors.mutedText }]}>
                  {event.location}
                </Text>
              ) : null}

              {event.description ? (
                <Text style={[styles.eventDetail, { color: colors.mutedText }]}>
                  {event.description}
                </Text>
              ) : null}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  eventsSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  emptyText: {
    fontSize: 14,
  },
  eventCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  eventTime: {
    fontSize: 14,
  },
  eventDetail: {
    fontSize: 13,
  },
});
