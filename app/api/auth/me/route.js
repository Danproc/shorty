import { createClient } from "@/libs/supabase/server";
import { NextResponse } from "next/server";
import { checkSubscription } from "@/libs/subscription";

/**
 * GET /api/auth/me
 * Returns the current user's profile and subscription status
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Not authenticated", has_access: false },
        { status: 401 }
      );
    }

    // Check subscription status
    const { hasAccess, profile } = await checkSubscription(user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
      },
      has_access: hasAccess,
      profile: profile,
    });
  } catch (error) {
    console.error("Error in /api/auth/me:", error);
    return NextResponse.json(
      { error: "Internal server error", has_access: false },
      { status: 500 }
    );
  }
}
