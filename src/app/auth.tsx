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

    router.replace("/");
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* AI INTRO */}
          <View style={styles.hero}>
            <View style={styles.orbOuter}>
              <View style={styles.orbMiddle}>
                <View style={styles.orbInner}>
                  <Text style={styles.orbText}>✦</Text>
                </View>
              </View>
            </View>

            <Text style={[styles.brand, { color: colors.text }]}>CAASee</Text>

            <Text style={[styles.heroTitle, { color: colors.text }]}>
              {isRegister
                ? "Let’s make your schedule feel lighter."
                : "Good to see you again."}
            </Text>

            <Text
              style={[styles.heroSubtitle, { color: colors.textSecondary }]}
            >
              {isRegister
                ? "I’ll help you plan your time, keep track of what matters, and make scheduling feel a little more human."
                : "Your schedule is waiting. Sign in and let’s get things organized."}
            </Text>
          </View>

          {/* FORM CARD */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                {isRegister ? "Create your account" : "Welcome back"}
              </Text>

              <Text
                style={[styles.cardSubtitle, { color: colors.textSecondary }]}
              >
                {isRegister
                  ? "It only takes a minute to get started."
                  : "Enter your details to continue."}
              </Text>
            </View>

            {isRegister && (
              <View style={styles.field}>
                <Text style={[styles.label, { color: colors.text }]}>
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
                      backgroundColor: colors.background,
                    },
                  ]}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>
            )}

            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.text }]}>Email</Text>

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
                    backgroundColor: colors.background,
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
              <Text style={[styles.label, { color: colors.text }]}>
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
                    backgroundColor: colors.background,
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
                <Text style={[styles.label, { color: colors.text }]}>
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
                      backgroundColor: colors.background,
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
                styles.primaryButton,
                pressed && !loading && styles.buttonPressed,
                loading && styles.buttonDisabled,
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>
                    {isRegister ? "Create my account" : "Sign me in"}
                  </Text>

                  <Text style={styles.primaryButtonArrow}>→</Text>
                </>
              )}
            </Pressable>
          </View>

          {/* MODE SWITCH */}
          <View style={styles.switchContainer}>
            <Text style={[styles.switchText, { color: colors.textSecondary }]}>
              {isRegister ? "Already have an account?" : "New to CAASee?"}
            </Text>

            <Pressable
              onPress={() => switchMode(isRegister ? "login" : "register")}
              disabled={loading}
              hitSlop={8}
            >
              <Text style={styles.switchLink}>
                {isRegister ? "Sign in" : "Create an account"}
              </Text>
            </Pressable>
          </View>

          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
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
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 36,
  },

  content: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
  },

  hero: {
    alignItems: "center",
    marginBottom: 26,
  },

  orbOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DBEAFE",
    marginBottom: 14,
  },

  orbMiddle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#BFDBFE",
  },

  orbInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563EB",
  },

  orbText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },

  brand: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 9,
  },

  heroTitle: {
    fontSize: 27,
    lineHeight: 34,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: -0.5,
    marginBottom: 9,
  },

  heroSubtitle: {
    maxWidth: 390,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },

  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    shadowColor: "#1D4ED8",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 3,
  },

  cardHeader: {
    marginBottom: 20,
  },

  cardTitle: {
    fontSize: 21,
    fontWeight: "800",
    marginBottom: 5,
  },

  cardSubtitle: {
    fontSize: 13,
    lineHeight: 19,
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
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 15,
    fontSize: 15,
  },

  errorBox: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 11,
    marginBottom: 15,
  },

  errorText: {
    color: "#B91C1C",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },

  primaryButton: {
    minHeight: 54,
    borderRadius: 15,
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginTop: 2,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  primaryButtonArrow: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "400",
    marginTop: -2,
  },

  buttonPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },

  buttonDisabled: {
    opacity: 0.65,
  },

  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    gap: 5,
    flexWrap: "wrap",
  },

  switchText: {
    fontSize: 13,
  },

  switchLink: {
    color: "#2563EB",
    fontSize: 13,
    fontWeight: "800",
  },

  footerText: {
    textAlign: "center",
    fontSize: 11,
    marginTop: 25,
    opacity: 0.75,
  },
});
