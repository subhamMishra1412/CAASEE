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
  const colors = Colors[colorScheme ?? "light"];

  const [mode, setMode] = useState<AuthMode>("register");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError("");
  }

  async function handleSubmit() {
    if (loading) {
      return;
    }

    setError("");
    setLoading(true);

    const result = isRegister
      ? await registerUser({
          fullName,
          email,
          password,
          confirmPassword,
        })
      : await loginUser({
          email,
          password,
        });

    setLoading(false);

    if (!result.success) {
      setError(result.message ?? "Something went wrong.");
      return;
    }

    router.replace("/(tabs)");
  }

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.content}>
          {/* AI INTRO */}
          <View style={styles.hero}>
            <View style={styles.orb}>
              <View style={styles.orbCore}>
                <Text style={styles.orbSymbol}>✦</Text>
              </View>
            </View>

            <Text
              style={[
                styles.brand,
                {
                  color: colors.text,
                },
              ]}
            >
              CAASee
            </Text>

            <Text
              style={[
                styles.title,
                {
                  color: colors.text,
                },
              ]}
            >
              {isRegister
                ? "Let’s make your schedule feel lighter."
                : "Good to see you again."}
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
                ? "I’ll help you plan your time and keep the things that matter organized."
                : "Your schedule is waiting. Let’s get things organized."}
            </Text>
          </View>

          {/* FORM */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.cardTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              {isRegister ? "Create your account" : "Welcome back"}
            </Text>

            <Text
              style={[
                styles.cardSubtitle,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              {isRegister
                ? "Let’s get you set up."
                : "Enter your details to continue."}
            </Text>

            {isRegister && (
              <View style={styles.field}>
                <Text
                  style={[
                    styles.label,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  Your name
                </Text>

                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="What should I call you?"
                  placeholderTextColor={colors.textSecondary}
                  style={[
                    styles.input,
                    {
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>
            )}

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
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                returnKeyType="next"
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
                placeholder={
                  isRegister ? "At least 8 characters" : "Enter your password"
                }
                placeholderTextColor={colors.textSecondary}
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete={isRegister ? "new-password" : "current-password"}
                returnKeyType={isRegister ? "next" : "done"}
              />
            </View>

            {isRegister && (
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
                  placeholder="Enter it again"
                  placeholderTextColor={colors.textSecondary}
                  style={[
                    styles.input,
                    {
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  returnKeyType="done"
                />
              </View>
            )}

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              style={({ pressed }) => [
                styles.button,
                pressed && !loading && styles.buttonPressed,
                loading && styles.buttonDisabled,
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.buttonText}>
                    {isRegister ? "Create my account" : "Sign me in"}
                  </Text>

                  <Text style={styles.buttonArrow}>→</Text>
                </>
              )}
            </Pressable>
          </View>

          {/* SWITCH */}
          <View style={styles.switchRow}>
            <Text
              style={[
                styles.switchText,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              {isRegister ? "Already have an account?" : "New to CAASee?"}
            </Text>

            <Pressable
              onPress={() => switchMode(isRegister ? "login" : "register")}
              disabled={loading}
            >
              <Text style={styles.switchLink}>
                {isRegister ? "Sign in" : "Create an account"}
              </Text>
            </Pressable>
          </View>

          <Text
            style={[
              styles.footer,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Your time. Your plans. One calmer place.
          </Text>
        </View>
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
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 24,
  },

  content: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
  },

  hero: {
    alignItems: "center",
    marginBottom: 17,
  },

  orb: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  orbCore: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },

  orbSymbol: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  brand: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 5,
  },

  title: {
    fontSize: 22,
    lineHeight: 27,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: -0.3,
    marginBottom: 5,
  },

  subtitle: {
    maxWidth: 370,
    fontSize: 12.5,
    lineHeight: 17,
    textAlign: "center",
  },

  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    shadowColor: "#1D4ED8",
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 2,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 3,
  },

  cardSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 13,
  },

  field: {
    marginBottom: 10,
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 5,
  },

  input: {
    minHeight: 46,
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 13,
    fontSize: 14,
  },

  errorBox: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 11,
    paddingHorizontal: 11,
    paddingVertical: 8,
    marginBottom: 10,
  },

  errorText: {
    color: "#B91C1C",
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
  },

  button: {
    minHeight: 48,
    borderRadius: 13,
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 2,
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  buttonArrow: {
    color: "#FFFFFF",
    fontSize: 19,
  },

  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 5,
    marginTop: 14,
  },

  switchText: {
    fontSize: 12,
  },

  switchLink: {
    color: "#2563EB",
    fontSize: 12,
    fontWeight: "800",
  },

  footer: {
    textAlign: "center",
    fontSize: 10,
    marginTop: 12,
    opacity: 0.7,
  },
});
