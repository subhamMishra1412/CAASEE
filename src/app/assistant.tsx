import { AIOrb } from "@/components/AIOrb";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { StyleSheet, Text, View } from "react-native";

export default function AssistantScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Ask CAASEE</Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Speak naturally and I'll help schedule it.
        </Text>
      </View>

      <View style={styles.voiceArea}>
        <AIOrb size="large" colors={colors} />

        <Text style={[styles.voiceTitle, { color: colors.text }]}>
          Voice scheduling
        </Text>

        <Text style={[styles.voiceSubtitle, { color: colors.textSecondary }]}>
          Voice interaction will connect here.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  header: {
    paddingTop: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 14,
    marginTop: 5,
    lineHeight: 20,
  },

  voiceArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 80,
  },

  voiceTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 24,
  },

  voiceSubtitle: {
    fontSize: 14,
    marginTop: 6,
  },
});
