import { Colors } from "@/constants/theme";
import { userProfile } from "@/Data/mockData";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import React from "react";
import {
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
  const [notifications, setNotifications] = React.useState(true);
  const [autoSchedule, setAutoSchedule] = React.useState(true);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.backButton,
            { backgroundColor: colors.cardBackground },
          ]}
          onPress={() => router.back()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Profile
        </Text>
        <View style={styles.spacer} />
      </View>

      {/* Profile Card */}
      <View
        style={[styles.profileCard, { backgroundColor: colors.cardBackground }]}
      >
        <View style={[styles.avatar, { backgroundColor: colors.border }]}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.userName, { color: colors.text }]}>
            {userProfile.name}
          </Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            {userProfile.email}
          </Text>
        </View>
      </View>

      {/* User Details */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Account Information
        </Text>
        <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
            Timezone
          </Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>
            {userProfile.timezone}
          </Text>
        </View>
        <View
          style={[
            styles.detailRow,
            styles.lastDetailRow,
            { borderBottomColor: colors.border },
          ]}
        >
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
            Location
          </Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>
            {userProfile.location}
          </Text>
        </View>
      </View>

      {/* Preferences */}
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

      {/* Work Style */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Work Style
        </Text>
        <View
          style={[
            styles.workStyleBox,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <Text style={styles.workStyleIcon}>🎯</Text>
          <View>
            <Text style={[styles.workStyleTitle, { color: colors.text }]}>
              {userProfile.workStyle}
            </Text>
            <Text
              style={[styles.workStyleDesc, { color: colors.textSecondary }]}
            >
              Optimized for single-task focused workflows
            </Text>
          </View>
        </View>
      </View>

      {/* Settings Menu */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Settings
        </Text>
        <SettingRow icon="🎨" label="Appearance" colors={colors} />
        <SettingRow icon="🔔" label="Notifications" colors={colors} />
        <SettingRow icon="🔗" label="Connected Calendars" colors={colors} />
        <SettingRow icon="📱" label="Mobile App Settings" colors={colors} />
        <SettingRow icon="🆘" label="Help & Support" colors={colors} />
      </View>

      {/* Actions */}
      <TouchableOpacity
        style={[
          styles.signoutButton,
          { backgroundColor: colors.cardBackground },
        ]}
      >
        <Text style={styles.signoutText}>Sign out</Text>
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

function SettingRow({
  icon,
  label,
  colors,
}: {
  icon: string;
  label: string;
  colors: (typeof Colors)["light"];
}) {
  return (
    <TouchableOpacity
      style={[styles.settingRow, { borderBottomColor: colors.border }]}
    >
      <Text style={styles.settingIcon}>{icon}</Text>
      <Text style={[styles.settingLabel, { color: colors.text }]}>{label}</Text>
      <Text style={[styles.settingArrow, { color: colors.border }]}>→</Text>
    </TouchableOpacity>
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
  lastDetailRow: {
    borderBottomWidth: 0,
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
  workStyleBox: {
    borderRadius: 10,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  workStyleIcon: {
    fontSize: 20,
    marginTop: 2,
  },
  workStyleTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  workStyleDesc: {
    fontSize: 11,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  settingIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
  settingArrow: {
    fontSize: 14,
    fontWeight: "300",
  },
  signoutButton: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 28,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e8e8e8",
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
