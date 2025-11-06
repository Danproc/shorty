"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/libs/supabase/client";
import KPICard from "./KPICard";
import AnalyticsChart from "./AnalyticsChart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
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

      // Fetch real analytics data from API
      const response = await fetch(
        `/api/analytics/asset?assetId=${assetId}&assetType=${assetType}`
      );

      if (response.ok) {
        const analyticsData = await response.json();
        setAnalytics(analyticsData);
      } else {
        throw new Error("Failed to fetch analytics");
      }
    } catch (error) {
      console.error("Error fetching asset details:", error);
      toast.error("Failed to load asset details");
    } finally {
      setLoading(false);
    }
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
              Copy Link
            </button>
          )}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Scans"
            value={analytics?.totalScans || 0}
          />
          <KPICard
            title="Unique Visitors"
            value={analytics?.uniqueVisitors || 0}
          />
          <KPICard
            title="First Scan"
            value={analytics?.firstScan ? new Date(analytics.firstScan).toLocaleDateString() : "Never"}
          />
          <KPICard
            title="Last Scan"
            value={analytics?.lastScan ? new Date(analytics.lastScan).toLocaleDateString() : "Never"}
          />
        </div>

        {/* Enhanced Analytics Chart with PostHog-style Visualization */}
        <AnalyticsChart
          assetId={assetId}
          assetType={assetType}
          analytics={analytics}
          loading={loading}
        />

        {/* Top Referrers and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Referrers */}
          <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-2 border-base-300">
            <div className="card-body p-6">
              <h2 className="card-title text-2xl font-bold mb-6">Top Referrers</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics?.topReferrers || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="referrer" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '2px solid #3ECF8E',
                        borderRadius: '0.75rem',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="count" fill="#3ECF8E" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-2 border-base-300">
            <div className="card-body p-6">
              <h2 className="card-title text-2xl font-bold mb-6">Recent Activity</h2>
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr className="border-b-2 border-base-300">
                      <th className="font-bold text-base-content">Time</th>
                      <th className="font-bold text-base-content">Referrer</th>
                      <th className="font-bold text-base-content">Country</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics?.recentActivity?.map((activity, index) => (
                      <tr key={index} className="hover:bg-base-200 transition-colors">
                        <td className="text-xs font-medium">
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
