import { supabase } from "@/lib/supabase";
import type { RegisterInput, RegisterResult } from "./types";

function getDefaultTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

export async function registerUser(
  input: RegisterInput,
): Promise<RegisterResult> {
  const fullName = input.fullName.trim();
  const email = input.email.trim().toLowerCase();

  if (!fullName) {
    return {
      success: false,
      message: "Please enter your name.",
    };
  }

  if (!email) {
    return {
      success: false,
      message: "Please enter your email.",
    };
  }

  if (!email.includes("@")) {
    return {
      success: false,
      message: "Please enter a valid email address.",
    };
  }

  if (input.password.length < 8) {
    return {
      success: false,
      message: "Password must be at least 8 characters.",
    };
  }

  if (input.password !== input.confirmPassword) {
    return {
      success: false,
      message: "Passwords do not match.",
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password: input.password,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  if (!data.user) {
    return {
      success: false,
      message: "Unable to create your account.",
    };
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user.id,
    full_name: fullName,
    timezone: getDefaultTimezone(),
  });

  if (profileError) {
    return {
      success: false,
      message: "Account created, but your profile could not be created.",
    };
  }

  return {
    success: true,
  };
}
export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<{
  success: boolean;
  message?: string;
}> {
  const email = input.email.trim().toLowerCase();

  if (!email) {
    return {
      success: false,
      message: "Please enter your email.",
    };
  }

  if (!email.includes("@")) {
    return {
      success: false,
      message: "Please enter a valid email address.",
    };
  }

  if (!input.password) {
    return {
      success: false,
      message: "Please enter your password.",
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: input.password,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
  };
}
