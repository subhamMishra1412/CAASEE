import { Colors } from "@/constants/theme";
import { loginUser, registerUser } from "@/domain/auth/authService";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type AuthMode = "register" | "login";

export default function AuthScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

  const [mode, setMode] = useState<AuthMode>("register");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError("");
    setMessage("");
    setPassword("");
    setConfirmPassword("");
  }

  async function handleSubmit() {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (mode === "register") {
        const result = await registerUser({
          fullName,
          email,
          password,
          confirmPassword,
        });

        if (!result.success) {
          /*
           * Registration may succeed but require email confirmation.
           * That message is intentionally shown here rather than
           * navigating into the authenticated app.
           */
          if (result.message?.startsWith("Account created.")) {
            setMessage(result.message);
            setMode("login");
            setPassword("");
            setConfirmPassword("");
            return;
          }

          setError(result.message ?? "Unable to create your account.");
          return;
        }

        router.replace("/");
        return;
      }

      const result = await loginUser({
        email,
        password,
      });

      if (!result.success) {
        setError(result.message ?? "Unable to sign in.");
        return;
      }

      router.replace("/");
    } finally {
      setLoading(false);
    }
  }

  const isRegister = mode === "register";

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View
            style={[
              styles.orb,
              {
                backgroundColor: colors.text,
              },
            ]}
          >
            <Text style={styles.orbIcon}>✦</Text>
          </View>

          <Text
            style={[
              styles.brand,
              {
                color: colors.text,
              },
            ]}
          >
            CAASEE
          </Text>

          <Text
            style={[
              styles.eyebrow,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            YOUR AI SCHEDULING ASSISTANT
          </Text>

          <Text
            style={[
              styles.title,
              {
                color: colors.text,
              },
            ]}
          >
            {isRegister ? "Let's get you set up." : "Welcome back."}
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            {isRegister
              ? "Create your CAASee account and start planning your day."
              : "Sign in to continue to your schedule."}
          </Text>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            },
          ]}
        >
          {isRegister ? (
            <View style={styles.field}>
              <Text
                style={[
                  styles.label,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Full name
              </Text>

              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Your name"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="words"
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                  },
                ]}
              />
            </View>
          ) : null}

          <View style={styles.field}>
            <Text
              style={[
                styles.label,
                {
                  color: colors.text,
                },
              ]}
            >
              Email
            </Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                },
              ]}
            />
          </View>

          <View style={styles.field}>
            <Text
              style={[
                styles.label,
                {
                  color: colors.text,
                },
              ]}
            >
              Password
            </Text>

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="At least 8 characters"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete={isRegister ? "new-password" : "password"}
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                },
              ]}
            />
          </View>

          {isRegister ? (
            <View style={styles.field}>
              <Text
                style={[
                  styles.label,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Confirm password
              </Text>

              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Enter your password again"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                  },
                ]}
              />
            </View>
          ) : null}

          {error ? (
            <View
              style={[
                styles.messageBox,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {error}
              </Text>
            </View>
          ) : null}

          {message ? (
            <View
              style={[
                styles.messageBox,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {message}
              </Text>
            </View>
          ) : null}

          <Pressable
            onPress={handleSubmit}
            disabled={loading}
            style={[
              styles.primaryButton,
              {
                backgroundColor: colors.text,
                opacity: loading ? 0.6 : 1,
              },
            ]}
          >
            {loading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text
                style={[
                  styles.primaryButtonText,
                  {
                    color: colors.background,
                  },
                ]}
              >
                {isRegister ? "Create account" : "Sign in"}
              </Text>
            )}
          </Pressable>

          <View style={styles.switchRow}>
            <Text
              style={[
                styles.switchText,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}
            </Text>

            <Pressable
              onPress={() => switchMode(isRegister ? "login" : "register")}
            >
              <Text
                style={[
                  styles.switchAction,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {isRegister ? "Sign in" : "Create account"}
              </Text>
            </Pressable>
          </View>
        </View>

        <Text
          style={[
            styles.footer,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          Your account keeps your schedule private and synced.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 50,
    paddingBottom: 40,
    justifyContent: "center",
  },

  hero: {
    alignItems: "center",
    marginBottom: 28,
  },

  orb: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  orbIcon: {
    color: "#FFFFFF",
    fontSize: 25,
  },

  brand: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 2.2,
  },

  eyebrow: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.4,
    marginTop: 5,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: -0.8,
    textAlign: "center",
    marginTop: 24,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    maxWidth: 340,
    marginTop: 7,
  },

  card: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
  },

  field: {
    marginBottom: 16,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 7,
  },

  input: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
  },

  messageBox: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 11,
    marginBottom: 14,
  },

  messageText: {
    fontSize: 13,
    lineHeight: 19,
  },

  primaryButton: {
    minHeight: 50,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },

  primaryButtonText: {
    fontSize: 14,
    fontWeight: "800",
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 18,
    gap: 5,
  },

  switchText: {
    fontSize: 13,
  },

  switchAction: {
    fontSize: 13,
    fontWeight: "800",
  },

  footer: {
    textAlign: "center",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 20,
  },
});
