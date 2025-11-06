import { createClient } from "@/libs/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const assetId = searchParams.get("assetId");
  const assetType = searchParams.get("assetType");

  if (!assetId || !assetType) {
    return NextResponse.json(
      { error: "Missing assetId or assetType" },
      { status: 400 }
    );
  }

  try {
    // Map asset type to table name
    let tableName = "";
    let dbAssetType = "";
    if (assetType === "url") {
      tableName = "short_urls";
      dbAssetType = "short_url";
    } else if (assetType === "qr") {
      tableName = "qr_codes";
      dbAssetType = "qr_code";
    } else if (assetType === "markdown") {
      tableName = "markdown_conversions";
      dbAssetType = "markdown";
    } else {
      return NextResponse.json({ error: "Invalid asset type" }, { status: 400 });
    }

    // Verify asset belongs to user
    const { data: asset, error: assetError } = await supabase
      .from(tableName)
      .select("id, user_id")
      .eq("id", assetId)
      .single();

    if (assetError || !asset || asset.user_id !== user.id) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    // Get summary statistics
    const { data: summary } = await supabase
      .from("asset_analytics_summary")
      .select("*")
      .eq("asset_type", dbAssetType)
      .eq("asset_id", assetId)
      .single();

    // Get daily scans for last 30 days (with event type breakdown)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: dailyData } = await supabase
      .from("asset_analytics")
      .select("created_at, event_type")
      .eq("asset_type", dbAssetType)
      .eq("asset_id", assetId)
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: true });

    // Group by day and event type
    const dailyScans = {};
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      dailyScans[dateStr] = { visits: 0, scans: 0, total: 0 };
    }

    dailyData?.forEach((event) => {
      const dateStr = new Date(event.created_at).toISOString().split("T")[0];
      if (dailyScans[dateStr] !== undefined) {
        dailyScans[dateStr].total++;

        // Categorize by event type
        if (event.event_type === 'visit') {
          dailyScans[dateStr].visits++;
        } else if (event.event_type === 'scan') {
          dailyScans[dateStr].scans++;
        } else {
          // For backwards compatibility, count other event types as visits
          dailyScans[dateStr].visits++;
        }
      }
    });

    const dailyScansArray = Object.entries(dailyScans).map(([date, counts]) => ({
      date,
      scans: counts.total, // Keep for backwards compatibility
      visits: counts.visits,
      qr_scans: counts.scans,
    }));

    // Get top referrers
    const { data: referrerData } = await supabase
      .from("asset_analytics")
      .select("referer")
      .eq("asset_type", dbAssetType)
      .eq("asset_id", assetId);

    const referrerCounts = {};
    referrerData?.forEach((event) => {
      let referrer = event.referer || "Direct";

      // Clean up referrer (extract domain)
      if (referrer !== "Direct" && referrer.startsWith("http")) {
        try {
          const url = new URL(referrer);
          referrer = url.hostname.replace("www.", "");
        } catch (e) {
          // Keep as is if URL parsing fails
        }
      }

      referrerCounts[referrer] = (referrerCounts[referrer] || 0) + 1;
    });

    const topReferrers = Object.entries(referrerCounts)
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Get recent activity (last 10 events)
    const { data: recentActivity } = await supabase
      .from("asset_analytics")
      .select("created_at, referer, country_code")
      .eq("asset_type", dbAssetType)
      .eq("asset_id", assetId)
      .order("created_at", { ascending: false })
      .limit(10);

    const formattedRecentActivity = recentActivity?.map((event) => {
      let referrer = event.referer || "Direct";

      // Clean up referrer (extract domain)
      if (referrer !== "Direct" && referrer.startsWith("http")) {
        try {
          const url = new URL(referrer);
          referrer = url.hostname.replace("www.", "");
        } catch (e) {
          // Keep as is if URL parsing fails
        }
      }

      return {
        timestamp: event.created_at,
        referrer,
        country: event.country_code || "Unknown",
      };
    }) || [];

    return NextResponse.json({
      totalScans: summary?.total_events || 0,
      uniqueVisitors: summary?.unique_visitors || 0,
      firstScan: summary?.first_event || null,
      lastScan: summary?.last_event || null,
      dailyScans: dailyScansArray,
      topReferrers,
      recentActivity: formattedRecentActivity,
    });
  } catch (error) {
    console.error("Error fetching asset analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
