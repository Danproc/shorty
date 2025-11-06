"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/libs/supabase/client";
import KPICard from "./KPICard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import toast from "react-hot-toast";

export default function AssetDetailPage({ assetId, assetType }) {
  const [asset, setAsset] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (assetId && assetType) {
      fetchAssetDetails();
    }
  }, [assetId, assetType]);

  const fetchAssetDetails = async () => {
    const supabase = createClient();

    try {
      // Fetch asset details
      let tableName = "";
      if (assetType === "url") tableName = "short_urls";
      else if (assetType === "qr") tableName = "qr_codes";
      else if (assetType === "markdown") tableName = "markdown_conversions";

      const { data: assetData } = await supabase
        .from(tableName)
        .select("*")
        .eq("id", assetId)
        .single();

      setAsset(assetData);

      // For now, generate mock analytics data
      // In a real app, you'd query the asset_analytics table
      const mockAnalytics = {
        totalScans: assetData?.click_count || assetData?.scan_count || assetData?.download_count || 0,
        uniqueVisitors: Math.floor((assetData?.click_count || 0) * 0.7), // Mock calculation
        firstScan: assetData?.created_at,
        lastScan: assetData?.last_clicked_at || assetData?.last_scanned_at || assetData?.last_downloaded_at,
        dailyScans: generateMockDailyScans(30),
        topReferrers: [
          { referrer: "Direct", count: 45 },
          { referrer: "google.com", count: 28 },
          { referrer: "twitter.com", count: 15 },
          { referrer: "facebook.com", count: 12 },
        ],
        recentActivity: generateMockRecentActivity(10),
      };

      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error("Error fetching asset details:", error);
      toast.error("Failed to load asset details");
    } finally {
      setLoading(false);
    }
  };

  const generateMockDailyScans = (days) => {
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split("T")[0],
        scans: Math.floor(Math.random() * 20),
      });
    }
    return data;
  };

  const generateMockRecentActivity = (count) => {
    const activity = [];
    const referrers = ["Direct", "google.com", "twitter.com", "facebook.com", "linkedin.com"];

    for (let i = 0; i < count; i++) {
      const date = new Date();
      date.setHours(date.getHours() - i * 3);
      activity.push({
        timestamp: date.toISOString(),
        referrer: referrers[Math.floor(Math.random() * referrers.length)],
        country: "US",
      });
    }
    return activity;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  if (loading) {
    return (
      <main className="min-h-screen p-4 md:p-8 pb-24 bg-base-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </main>
    );
  }

  if (!asset) {
    return (
      <main className="min-h-screen p-4 md:p-8 pb-24 bg-base-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold mb-4">Asset not found</h1>
            <Link href="/dashboard/assets" className="btn btn-primary">
              Back to Assets
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const getAssetUrl = () => {
    if (assetType === "url") {
      return `${window.location.origin}/r/${asset.short_code}`;
    } else if (assetType === "qr") {
      return `${window.location.origin}/qr/${asset.qr_code}`;
    }
    return null;
  };

  return (
    <main className="min-h-screen p-4 md:p-8 pb-24 bg-base-200">
      <section className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <Link href="/dashboard/assets" className="text-sm text-base-content/70 hover:text-base-content mb-2 inline-block">
              ← Back to Assets
            </Link>
            <h1 className="text-3xl md:text-4xl font-extrabold">
              {asset.title || "Untitled Asset"}
            </h1>
            <p className="text-base-content/70 mt-1">
              {assetType === "url" && asset.original_url}
              {assetType === "qr" && asset.target_url}
              {assetType === "markdown" && "Markdown Conversion"}
            </p>
          </div>
          {getAssetUrl() && (
            <button
              onClick={() => copyToClipboard(getAssetUrl())}
              className="btn btn-primary gap-2"
            >
              📋 Copy Link
            </button>
          )}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Scans"
            value={analytics?.totalScans || 0}
            icon="👁️"
          />
          <KPICard
            title="Unique Visitors"
            value={analytics?.uniqueVisitors || 0}
            icon="👤"
          />
          <KPICard
            title="First Scan"
            value={analytics?.firstScan ? new Date(analytics.firstScan).toLocaleDateString() : "Never"}
            icon="📅"
          />
          <KPICard
            title="Last Scan"
            value={analytics?.lastScan ? new Date(analytics.lastScan).toLocaleDateString() : "Never"}
            icon="🕒"
          />
        </div>

        {/* Daily Scans Chart */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Daily Scans (Last 30 Days)</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics?.dailyScans || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="scans"
                    stroke="#3ECF8E"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Referrers and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Referrers */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">Top Referrers</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics?.topReferrers || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="referrer" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3ECF8E" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">Recent Activity</h2>
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Referrer</th>
                      <th>Country</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics?.recentActivity?.map((activity, index) => (
                      <tr key={index}>
                        <td className="text-xs">
                          {new Date(activity.timestamp).toLocaleString()}
                        </td>
                        <td className="text-xs">{activity.referrer}</td>
                        <td className="text-xs">{activity.country}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
