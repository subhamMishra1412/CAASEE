import { supabase } from "@/lib/supabase";
import { getDeviceTimezone } from "./timezone";
import type { RegisterInput, RegisterResult } from "./types";

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
    options: {
      data: {
        full_name: fullName,
        timezone: getDeviceTimezone(),
      },
    },
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

  /*
   * If Supabase email confirmation is enabled,
   * the account exists but there is no session yet.
   */
  if (!data.session) {
    return {
      success: false,
      message:
        "Account created. Please check your email to confirm your account, then sign in.",
    };
  }

  return {
    success: true,
  };
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<RegisterResult> {
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

export async function signOutUser(): Promise<RegisterResult> {
  const { error } = await supabase.auth.signOut();

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
