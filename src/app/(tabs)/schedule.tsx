import EventComposer from "@/components/EventComposer";
import { Colors } from "@/constants/theme";
import {
  rescheduleCalendarEvent,
  scheduleCalendarEvent,
  useCalendarEvents,
} from "@/domain/calendar/calendarStore";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Stack } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

export default function ScheduleScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

  /*
   * Initialize the authenticated user's persistent calendar.
   *
   * The calendar store:
   * - loads events from Supabase
   * - clears events when the user signs out
   * - reloads events when the authenticated user changes
   */
  const calendarEvents = useCalendarEvents();

  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [pulseAnim]);

  const orbScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06],
  });

  const orbOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.12, 0.24],
  });

  /*
   * Wait until the calendar store has initialized.
   *
   * We use the event array itself here only to ensure the hook
   * remains active. The store handles loading internally.
   */
  void calendarEvents;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Schedule",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
        }}
      />

      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.aiHeader}>
          <View style={styles.orbWrapper}>
            <Animated.View
              style={[
                styles.orbGlow,
                {
                  backgroundColor: colors.text,
                  opacity: orbOpacity,
                  transform: [{ scale: orbScale }],
                },
              ]}
            />

            <Animated.View
              style={[
                styles.orb,
                {
                  backgroundColor: colors.text,
                  transform: [{ scale: orbScale }],
                },
              ]}
            >
              <Text style={styles.orbIcon}>✦</Text>
            </Animated.View>
          </View>

          <Text style={[styles.brand, { color: colors.text }]}>CAASEE</Text>

          <Text style={[styles.eyebrow, { color: colors.textSecondary }]}>
            AI SCHEDULING
          </Text>
        </View>

        <View style={styles.intro}>
          <Text style={[styles.title, { color: colors.text }]}>
            Let&apos;s plan it.
          </Text>

          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Describe what you need in your own words.
          </Text>
        </View>

        <View
          style={[
            styles.composerCard,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.composerHeader}>
            <View style={styles.composerIndicator}>
              <View
                style={[styles.indicatorDot, { backgroundColor: colors.text }]}
              />
            </View>

            <Text style={[styles.composerLabel, { color: colors.text }]}>
              Schedule with AI
            </Text>
          </View>

          <EventComposer
            colors={{
              text: colors.text,
              mutedText: colors.textSecondary,
              card: colors.cardBackground,
              border: colors.border,
              primary: colors.text,
              background: colors.background,
            }}
            onSchedule={scheduleCalendarEvent}
            onReschedule={rescheduleCalendarEvent}
          />
        </View>

        <View style={styles.exampleContainer}>
          <Text style={[styles.exampleLabel, { color: colors.textSecondary }]}>
            TRY SAYING
          </Text>

          <Text style={[styles.exampleText, { color: colors.text }]}>
            “Project meeting with Rahul tomorrow at 4 PM”
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 50,
  },

  aiHeader: {
    alignItems: "center",
    marginTop: 4,
    marginBottom: 26,
  },

  orbWrapper: {
    width: 86,
    height: 86,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  orbGlow: {
    position: "absolute",
    width: 86,
    height: 86,
    borderRadius: 43,
  },

  orb: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },

  orbIcon: {
    color: "#FFFFFF",
    fontSize: 25,
  },

  brand: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 2,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.6,
    marginTop: 4,
  },

  intro: {
    alignItems: "center",
    marginBottom: 22,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: -0.8,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 6,
  },

  composerCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
  },

  composerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  composerIndicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  indicatorDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  composerLabel: {
    fontSize: 15,
    fontWeight: "700",
  },

  exampleContainer: {
    marginTop: 20,
    paddingHorizontal: 6,
  },

  exampleLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.4,
    marginBottom: 5,
  },

  exampleText: {
    fontSize: 13,
    lineHeight: 19,
  },
});
