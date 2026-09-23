import { Colors } from "@/constants/theme";
import { signOutUser } from "@/domain/auth/authService";
import {
  getCurrentUserProfile,
  updateCurrentUserProfile,
} from "@/domain/auth/profileservice";
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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

  const { session, loading: sessionLoading } = useAuthSession();

  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [timezone, setTimezone] = React.useState("");

  const [editing, setEditing] = React.useState(false);
  const [loadingProfile, setLoadingProfile] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [signingOut, setSigningOut] = React.useState(false);

  const [notifications, setNotifications] = React.useState(true);
  const [autoSchedule, setAutoSchedule] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      if (!session) {
        if (mounted) {
          setLoadingProfile(false);
        }
        return;
      }

      setLoadingProfile(true);

      const result = await getCurrentUserProfile();

      if (!mounted) {
        return;
      }

      if (!result.success || !result.profile) {
        Alert.alert(
          "Unable to load profile",
          result.message ?? "Please try again.",
        );
        setLoadingProfile(false);
        return;
      }

      setFullName(result.profile.fullName);
      setEmail(result.profile.email);
      setTimezone(result.profile.timezone);

      setLoadingProfile(false);
    }

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, [session]);

  async function handleSaveProfile() {
    setSaving(true);

    try {
      const result = await updateCurrentUserProfile({
        fullName,
        timezone,
      });

      if (!result.success) {
        Alert.alert(
          "Unable to save profile",
          result.message ?? "Please try again.",
        );
        return;
      }

      setEditing(false);

      Alert.alert("Profile updated", "Your profile has been saved.");
    } finally {
      setSaving(false);
    }
  }

  function handleCancelEdit() {
    setEditing(false);

    if (session) {
      void getCurrentUserProfile().then((result) => {
        if (!result.success || !result.profile) {
          return;
        }

        setFullName(result.profile.fullName);
        setTimezone(result.profile.timezone);
      });
    }
  }

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

  if (sessionLoading || loadingProfile) {
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

  if (!session) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          You are not signed in
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/auth")}
        >
          <Text style={styles.primaryButtonText}>
            Sign in or create an account
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
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
            {fullName || "CAASee User"}
          </Text>

          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            {email || "No email"}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Account Information
          </Text>

          {!editing ? (
            <TouchableOpacity onPress={() => setEditing(true)}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={[styles.formRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
            Full name
          </Text>

          {editing ? (
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Your name"
              placeholderTextColor={colors.textSecondary}
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                },
              ]}
              autoCapitalize="words"
            />
          ) : (
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {fullName}
            </Text>
          )}
        </View>

        <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
            Email
          </Text>

          <Text
            style={[
              styles.detailValue,
              styles.emailValue,
              { color: colors.text },
            ]}
          >
            {email}
          </Text>
        </View>

        <View style={[styles.formRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
            Timezone
          </Text>

          {editing ? (
            <TextInput
              value={timezone}
              onChangeText={setTimezone}
              placeholder="Asia/Kolkata"
              placeholderTextColor={colors.textSecondary}
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                },
              ]}
              autoCapitalize="none"
              autoCorrect={false}
            />
          ) : (
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {timezone}
            </Text>
          )}
        </View>

        {editing ? (
          <View style={styles.editActions}>
            <TouchableOpacity
              style={[
                styles.cancelButton,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
              onPress={handleCancelEdit}
              disabled={saving}
            >
              <Text style={[styles.cancelText, { color: colors.text }]}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, { opacity: saving ? 0.6 : 1 }]}
              onPress={handleSaveProfile}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveText}>Save changes</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : null}
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
    paddingHorizontal: 24,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 18,
  },

  primaryButton: {
    minHeight: 48,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
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

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  editText: {
    color: "#2563EB",
    fontSize: 13,
    fontWeight: "700",
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },

  formRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },

  detailLabel: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 6,
  },

  detailValue: {
    fontSize: 13,
    fontWeight: "600",
  },

  emailValue: {
    maxWidth: "65%",
    textAlign: "right",
  },

  input: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
  },

  editActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },

  cancelButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelText: {
    fontSize: 13,
    fontWeight: "700",
  },

  saveButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 10,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },

  saveText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
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
