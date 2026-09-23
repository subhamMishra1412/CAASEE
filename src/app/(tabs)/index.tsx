import { AIOrb } from "@/components/AIOrb";
import { ScheduleSection } from "@/components/ScheduleSection";
import { Colors } from "@/constants/theme";
import { useAuthSession } from "@/domain/auth/useAuthSession";
import { useCalendarEvents } from "@/domain/calendar/calendarStore";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

  const events = useCalendarEvents();
  const { session } = useAuthSession();

  const privateEvents = session ? events : [];

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";

    return "Good evening";
  };

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <View>
          <Text
            style={[
              styles.greeting,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            {getGreeting()}
          </Text>

          <Text
            style={[
              styles.name,
              {
                color: colors.text,
              },
            ]}
          >
            Subham
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.settingsButton,
            {
              backgroundColor: colors.cardBackground,
            },
          ]}
          onPress={() => router.push("/profile")}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.brandingContainer}>
        <Text
          style={[
            styles.branding,
            {
              color: colors.text,
            },
          ]}
        >
          CAASEE
        </Text>

        <Text
          style={[
            styles.brandingSubtext,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          Intelligent scheduling assistant
        </Text>
      </View>

      {/* Voice scheduling */}
      <View style={styles.voiceSection}>
        <AIOrb
          size="large"
          colors={colors}
          onPress={() => router.push("/assistant")}
        />
      </View>

      {/* Text scheduling */}
      <Pressable
        onPress={() => router.push("/schedule")}
        style={[
          styles.textScheduleCard,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.textScheduleIcon,
            {
              backgroundColor: colors.background,
            },
          ]}
        >
          <Text
            style={[
              styles.textScheduleIconText,
              {
                color: colors.text,
              },
            ]}
          >
            ✎
          </Text>
        </View>

        <View style={styles.textScheduleContent}>
          <Text
            style={[
              styles.textScheduleTitle,
              {
                color: colors.text,
              },
            ]}
          >
            Schedule with text
          </Text>

          <Text
            style={[
              styles.textScheduleSubtitle,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Type a request and CAASEE will schedule it
          </Text>
        </View>

        <Text
          style={[
            styles.arrow,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          ›
        </Text>
      </Pressable>

      {/* Quick stats */}
      <View
        style={[
          styles.statsContainer,
          {
            backgroundColor: colors.cardBackground,
          },
        ]}
      >
        <View style={styles.statBox}>
          <Text
            style={[
              styles.statNumber,
              {
                color: colors.text,
              },
            ]}
          >
            {privateEvents.length}
          </Text>

          <Text
            style={[
              styles.statLabel,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Events
          </Text>
        </View>

        <View
          style={[
            styles.statDivider,
            {
              backgroundColor: colors.border,
            },
          ]}
        />

        <View style={styles.statBox}>
          <Text
            style={[
              styles.statNumber,
              {
                color: colors.text,
              },
            ]}
          >
            {session ? "12" : "—"}
          </Text>

          <Text
            style={[
              styles.statLabel,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            This week
          </Text>
        </View>

        <View
          style={[
            styles.statDivider,
            {
              backgroundColor: colors.border,
            },
          ]}
        />

        <View style={styles.statBox}>
          <Text
            style={[
              styles.statNumber,
              {
                color: colors.text,
              },
            ]}
          >
            {session ? "2" : "—"}
          </Text>

          <Text
            style={[
              styles.statLabel,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Pending
          </Text>
        </View>
      </View>

      {/* Private schedule */}
      {session ? (
        <ScheduleSection
          events={privateEvents}
          colors={colors}
          onViewAll={() => router.push("/calendar")}
        />
      ) : (
        <Pressable
          onPress={() => router.push("/auth")}
          style={[
            styles.authCard,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.authCardTitle,
              {
                color: colors.text,
              },
            ]}
          >
            Sign in to see your schedule
          </Text>

          <Text
            style={[
              styles.authCardText,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Create an account or sign in to access your private calendar.
          </Text>

          <Text style={styles.authCardLink}>Sign in or create account →</Text>
        </Pressable>
      )}

      <View
        style={[
          styles.insightCard,
          {
            backgroundColor: colors.insightBackground,
          },
        ]}
      >
        <Text style={styles.insightIcon}>💡</Text>

        <View style={styles.insightContent}>
          <Text
            style={[
              styles.insightTitle,
              {
                color: colors.text,
              },
            ]}
          >
            Smart suggestion
          </Text>

          <Text
            style={[
              styles.insightText,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Block 4-5 PM for focused work based on your patterns
          </Text>
        </View>
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
    marginBottom: 22,
  },

  greeting: {
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.5,
  },

  name: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 2,
  },

  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  settingsIcon: {
    fontSize: 18,
  },

  brandingContainer: {
    alignItems: "center",
    marginBottom: 16,
  },

  branding: {
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: 1.5,
  },

  brandingSubtext: {
    fontSize: 12,
    marginTop: 4,
    letterSpacing: 0.3,
  },

  voiceSection: {
    alignItems: "center",
    marginBottom: 8,
  },

  textScheduleCard: {
    minHeight: 72,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  textScheduleIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  textScheduleIconText: {
    fontSize: 22,
    fontWeight: "600",
  },

  textScheduleContent: {
    flex: 1,
    marginLeft: 12,
  },

  textScheduleTitle: {
    fontSize: 15,
    fontWeight: "700",
  },

  textScheduleSubtitle: {
    fontSize: 12,
    marginTop: 3,
  },

  arrow: {
    fontSize: 28,
    marginLeft: 8,
  },

  statsContainer: {
    flexDirection: "row",
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: "space-around",
    alignItems: "center",
  },

  statBox: {
    alignItems: "center",
    flex: 1,
  },

  statNumber: {
    fontSize: 20,
    fontWeight: "700",
  },

  statLabel: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: "500",
  },

  statDivider: {
    width: 1,
    height: 30,
  },

  authCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
  },

  authCardTitle: {
    fontSize: 15,
    fontWeight: "700",
  },

  authCardText: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5,
  },

  authCardLink: {
    color: "#2563EB",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 12,
  },

  insightCard: {
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginTop: 20,
    borderLeftWidth: 3,
    borderLeftColor: "#0ea5e9",
  },

  insightIcon: {
    fontSize: 20,
    marginTop: 2,
  },

  insightContent: {
    flex: 1,
  },

  insightTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 3,
  },

  insightText: {
    fontSize: 12,
    lineHeight: 16,
  },
});
