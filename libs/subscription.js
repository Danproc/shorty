import { createClient } from "@/libs/supabase/server";

/**
 * Check if a user has an active subscription
 * @param {string} userId - The user's ID from Supabase auth
 * @returns {Promise<{hasAccess: boolean, profile: object|null}>}
 */
export async function checkSubscription(userId) {
  if (!userId) {
    return { hasAccess: false, profile: null };
  }

  try {
    const supabase = await createClient();

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return { hasAccess: false, profile: null };
    }

    return {
      hasAccess: profile?.has_access || false,
      profile,
    };
  } catch (error) {
    console.error("Error checking subscription:", error);
    return { hasAccess: false, profile: null };
  }
}

/**
 * Get user profile with subscription status
 * @param {string} userId - The user's ID from Supabase auth
 * @returns {Promise<object|null>}
 */
export async function getUserProfile(userId) {
  if (!userId) {
    return null;
  }

  try {
    const supabase = await createClient();

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }

    return profile;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}
