import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { Colors } from "@/constants/theme";
import { useAuthSession } from "@/domain/auth/useAuthSession";

type AuthRequiredProps = {
  children: ReactNode;
  title: string;
  description: string;
};

export function AuthRequired({
  children,
  title,
  description,
}: AuthRequiredProps) {
  const router = useRouter();
  const colors = Colors.light;

  const { session, loading } = useAuthSession();

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
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
          styles.container,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <View style={styles.orb}>
          <Text style={styles.orbText}>✦</Text>
        </View>

        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.description,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          {description}
        </Text>

        <Pressable onPress={() => router.push("/auth")} style={styles.button}>
          <Text style={styles.buttonText}>Sign in or create an account</Text>
        </Pressable>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },

  orb: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  orbText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },

  description: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 8,
    maxWidth: 340,
  },

  button: {
    minHeight: 48,
    paddingHorizontal: 20,
    borderRadius: 13,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});
