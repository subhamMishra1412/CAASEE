import { Colors } from "@/constants/theme";
import { signOutUser } from "@/domain/auth/authService";
import { useAuthSession } from "@/domain/auth/useAuthSession";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

  const { session, loading } = useAuthSession();

  const [notifications, setNotifications] = React.useState(true);
  const [autoSchedule, setAutoSchedule] = React.useState(true);
  const [signingOut, setSigningOut] = React.useState(false);

  async function handleSignOut() {
    setSigningOut(true);

    try {
      const result = await signOutUser();

      if (!result.success) {
        Alert.alert(
          "Unable to sign out",
          result.message ?? "Please try again.",
        );
        return;
      }

      router.replace("/");
    } finally {
      setSigningOut(false);
    }
  }

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator color={colors.text} />
      </View>
    );
  }

  const email = session?.user.email ?? "Not signed in";

  const fullName = session?.user.user_metadata?.full_name ?? "CAASee User";

  const timezone =
    session?.user.user_metadata?.timezone ??
    Intl.DateTimeFormat().resolvedOptions().timeZone ??
    "UTC";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.backButton,
            { backgroundColor: colors.cardBackground },
          ]}
          onPress={() => router.back()}
        >
          <Text style={[styles.backIcon, { color: colors.text }]}>←</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Profile
        </Text>

        <View style={styles.spacer} />
      </View>

      <View
        style={[styles.profileCard, { backgroundColor: colors.cardBackground }]}
      >
        <View style={[styles.avatar, { backgroundColor: colors.border }]}>
          <Text style={styles.avatarText}>👤</Text>
        </View>

        <View style={styles.profileInfo}>
          <Text style={[styles.userName, { color: colors.text }]}>
            {fullName}
          </Text>

          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            {email}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Account Information
        </Text>

        <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
            Timezone
          </Text>

          <Text style={[styles.detailValue, { color: colors.text }]}>
            {timezone}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Preferences
        </Text>

        <View
          style={[styles.preferenceRow, { borderBottomColor: colors.border }]}
        >
          <View style={styles.preferenceContent}>
            <Text style={[styles.preferenceName, { color: colors.text }]}>
              Notifications
            </Text>

            <Text
              style={[styles.preferenceDesc, { color: colors.textSecondary }]}
            >
              Receive event reminders and updates
            </Text>
          </View>

          <Switch value={notifications} onValueChange={setNotifications} />
        </View>

        <View
          style={[styles.preferenceRow, { borderBottomColor: colors.border }]}
        >
          <View style={styles.preferenceContent}>
            <Text style={[styles.preferenceName, { color: colors.text }]}>
              AI Auto-scheduling
            </Text>

            <Text
              style={[styles.preferenceDesc, { color: colors.textSecondary }]}
            >
              Let CAASEE suggest optimal time blocks
            </Text>
          </View>

          <Switch value={autoSchedule} onValueChange={setAutoSchedule} />
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.signoutButton,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
            opacity: signingOut ? 0.6 : 1,
          },
        ]}
        onPress={handleSignOut}
        disabled={signingOut}
      >
        {signingOut ? (
          <ActivityIndicator color={colors.text} />
        ) : (
          <Text style={styles.signoutText}>Sign out</Text>
        )}
      </TouchableOpacity>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Text style={[styles.versionText, { color: colors.textSecondary }]}>
          CAASEE v1.0.0
        </Text>

        <Text style={[styles.copyrightText, { color: colors.border }]}>
          © 2026 CAASEE
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

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
    alignItems: "center",
    marginBottom: 24,
    justifyContent: "space-between",
  },

  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  backIcon: {
    fontSize: 18,
    fontWeight: "700",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  spacer: {
    width: 36,
  },

  profileCard: {
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 28,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 28,
  },

  profileInfo: {
    flex: 1,
  },

  userName: {
    fontSize: 16,
    fontWeight: "700",
  },

  userEmail: {
    fontSize: 12,
    marginTop: 3,
  },

  section: {
    marginBottom: 28,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 12,
    letterSpacing: 0.5,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },

  detailLabel: {
    fontSize: 13,
    fontWeight: "500",
  },

  detailValue: {
    fontSize: 13,
    fontWeight: "600",
  },

  preferenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
  },

  preferenceContent: {
    flex: 1,
  },

  preferenceName: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 3,
  },

  preferenceDesc: {
    fontSize: 11,
  },

  signoutButton: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
    marginBottom: 20,
    borderWidth: 1,
  },

  signoutText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ff6b6b",
  },

  footer: {
    alignItems: "center",
    paddingTop: 20,
    borderTopWidth: 1,
  },

  versionText: {
    fontSize: 11,
    fontWeight: "500",
  },

  copyrightText: {
    fontSize: 10,
    marginTop: 4,
  },
});
