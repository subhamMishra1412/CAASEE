import { AIOrb } from "@/components/AIOrb";
import { ScheduleSection } from "@/components/ScheduleSection";
import { Colors } from "@/constants/theme";
import { mockEvents } from "@/data/mockData";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import {
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
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
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            {getGreeting()}
          </Text>
          <Text style={[styles.name, { color: colors.text }]}>Subham</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.settingsButton,
            { backgroundColor: colors.cardBackground },
          ]}
          onPress={() => router.push("/profile")}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Branding */}
      <View style={styles.brandingContainer}>
        <Text style={[styles.branding, { color: colors.text }]}>CAASEE</Text>
        <Text style={[styles.brandingSubtext, { color: colors.textSecondary }]}>
          Intelligent scheduling assistant
        </Text>
      </View>

      {/* AI Orb */}
      {/* TODO(Task 003): Connect the AI assistant conversation flow. */}
      <AIOrb size="large" colors={colors} disabled />

      {/* Quick Stats */}
      <View
        style={[
          styles.statsContainer,
          { backgroundColor: colors.cardBackground },
        ]}
      >
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: colors.text }]}>3</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Today
          </Text>
        </View>
        <View
          style={[styles.statDivider, { backgroundColor: colors.border }]}
        />
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: colors.text }]}>12</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            This week
          </Text>
        </View>
        <View
          style={[styles.statDivider, { backgroundColor: colors.border }]}
        />
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: colors.text }]}>2</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Pending
          </Text>
        </View>
      </View>

      {/* Today's Schedule */}
      <ScheduleSection
        events={mockEvents}
        colors={colors}
        onViewAll={() => router.push("/calendar")}
      />

      {/* AI Insight Card */}
      <View
        style={[
          styles.insightCard,
          { backgroundColor: colors.insightBackground },
        ]}
      >
        <Text style={styles.insightIcon}>💡</Text>
        <View style={styles.insightContent}>
          <Text style={[styles.insightTitle, { color: colors.text }]}>
            Smart suggestion
          </Text>
          <Text style={[styles.insightText, { color: colors.textSecondary }]}>
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
    marginBottom: 24,
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
    marginBottom: 32,
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
  statsContainer: {
    flexDirection: "row",
    borderRadius: 12,
    paddingVertical: 16,
    marginVertical: 24,
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
