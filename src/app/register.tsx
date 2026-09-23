import { Colors } from "@/constants/theme";
import { registerUser } from "@/domain/auth/authService";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Stack, useRouter } from "expo-router";
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

export default function RegisterScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setError("");

    if (loading) {
      return;
    }

    setLoading(true);

    const result = await registerUser({
      fullName,
      email,
      password,
      confirmPassword,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.message ?? "Registration failed.");
      return;
    }

    router.replace("/");
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Create account",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
        }}
      />

      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={[styles.eyebrow, { color: colors.textSecondary }]}>
              WELCOME TO CAASEE
            </Text>

            <Text style={[styles.title, { color: colors.text }]}>
              Create your account
            </Text>

            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Create your CAASee account to start managing your schedule.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.text }]}>Name</Text>

              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Your name"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="words"
                autoCorrect={false}
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.border,
                    backgroundColor: colors.cardBackground,
                  },
                ]}
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.text }]}>Email</Text>

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
                    backgroundColor: colors.cardBackground,
                  },
                ]}
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.text }]}>
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
                autoComplete="new-password"
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.border,
                    backgroundColor: colors.cardBackground,
                  },
                ]}
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.text }]}>
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
                    backgroundColor: colors.cardBackground,
                  },
                ]}
              />
            </View>

            {error ? (
              <View
                style={[
                  styles.errorContainer,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.errorText, { color: colors.text }]}>
                  {error}
                </Text>
              </View>
            ) : null}

            <Pressable
              onPress={handleRegister}
              disabled={loading}
              style={[
                styles.button,
                {
                  backgroundColor: colors.text,
                  opacity: loading ? 0.6 : 1,
                },
              ]}
            >
              {loading ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text style={[styles.buttonText, { color: colors.background }]}>
                  Create account
                </Text>
              )}
            </Pressable>

            <Pressable
              onPress={() => router.back()}
              disabled={loading}
              style={styles.loginButton}
            >
              <Text style={[styles.loginText, { color: colors.textSecondary }]}>
                Already have an account?{" "}
                <Text style={{ color: colors.text }}>Log in</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 28,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 6,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: -0.8,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 21,
    marginTop: 8,
  },

  form: {
    gap: 18,
  },

  field: {
    gap: 8,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
  },

  input: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 15,
    fontSize: 16,
  },

  errorContainer: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 13,
  },

  errorText: {
    fontSize: 14,
    lineHeight: 20,
  },

  button: {
    minHeight: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "700",
  },

  loginButton: {
    alignItems: "center",
    paddingVertical: 8,
  },

  loginText: {
    fontSize: 14,
  },
});
