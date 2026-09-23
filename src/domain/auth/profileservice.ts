import { supabase } from "@/lib/supabase";

export type UserProfile = {
  id: string;
  fullName: string;
  timezone: string;
  email: string;
};

export async function getCurrentUserProfile(): Promise<{
  success: boolean;
  profile?: UserProfile;
  message?: string;
}> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return {
      success: false,
      message: userError.message,
    };
  }

  if (!user) {
    return {
      success: false,
      message: "You are not signed in.",
    };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, timezone")
    .eq("id", user.id)
    .single();

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    profile: {
      id: data.id,
      fullName: data.full_name,
      timezone: data.timezone,
      email: user.email ?? "",
    },
  };
}

export async function updateCurrentUserProfile(input: {
  fullName: string;
  timezone: string;
}): Promise<{
  success: boolean;
  message?: string;
}> {
  const fullName = input.fullName.trim();
  const timezone = input.timezone.trim();

  if (!fullName) {
    return {
      success: false,
      message: "Please enter your name.",
    };
  }

  if (!timezone) {
    return {
      success: false,
      message: "Please enter a valid time zone.",
    };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return {
      success: false,
      message: userError.message,
    };
  }

  if (!user) {
    return {
      success: false,
      message: "You are not signed in.",
    };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      timezone,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

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
