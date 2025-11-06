import { createClient } from "@/libs/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get total assets count
    const { count: urlsCount } = await supabase
      .from("short_urls")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    const { count: qrCount } = await supabase
      .from("qr_codes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    const { count: markdownCount } = await supabase
      .from("markdown_conversions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    const totalAssets = (urlsCount || 0) + (qrCount || 0) + (markdownCount || 0);

    // Get total scans/visits in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get URLs from last 7 days
    const { data: recentUrls } = await supabase
      .from("short_urls")
      .select("id, click_count")
      .eq("user_id", user.id)
      .gte("created_at", sevenDaysAgo.toISOString());

    const { data: recentQrs } = await supabase
      .from("qr_codes")
      .select("id, scan_count")
      .eq("user_id", user.id)
      .gte("created_at", sevenDaysAgo.toISOString());

    const { data: recentMarkdown } = await supabase
      .from("markdown_conversions")
      .select("id, download_count")
      .eq("user_id", user.id)
      .gte("created_at", sevenDaysAgo.toISOString());

    const totalScans7Days =
      (recentUrls?.reduce((sum, url) => sum + (url.click_count || 0), 0) || 0) +
      (recentQrs?.reduce((sum, qr) => sum + (qr.scan_count || 0), 0) || 0) +
      (recentMarkdown?.reduce((sum, md) => sum + (md.download_count || 0), 0) || 0);

    // Get daily activity for sparkline (last 7 days)
    const dailyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      // For now, we'll use simple click counts
      // In a real implementation, you'd query asset_analytics table
      dailyActivity.push({
        date: date.toISOString().split('T')[0],
        value: Math.floor(Math.random() * 50), // Placeholder
      });
    }

    return NextResponse.json({
      totalAssets,
      totalScans7Days,
      urlsCount: urlsCount || 0,
      qrCount: qrCount || 0,
      markdownCount: markdownCount || 0,
      dailyActivity,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
