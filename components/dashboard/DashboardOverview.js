"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ButtonAccount from "@/components/ButtonAccount";
import KPICard from "./KPICard";
import MiniChart from "./MiniChart";

export default function DashboardOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 pb-24 bg-base-200">
      <section className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">Dashboard</h1>
            <p className="text-base-content/70 mt-1">
              Track your links, QR codes, and conversions
            </p>
          </div>
          <ButtonAccount />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <KPICard
            title="Total Assets"
            value={loading ? "..." : stats?.totalAssets || 0}
            icon="📦"
            loading={loading}
          />
          <KPICard
            title="Total Scans (7 days)"
            value={loading ? "..." : stats?.totalScans7Days || 0}
            icon="📊"
            loading={loading}
          />
          <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
            <div className="card-body">
              <p className="text-sm text-base-content/70 font-medium">Activity Trend</p>
              {loading ? (
                <div className="skeleton h-16 w-full mt-2"></div>
              ) : (
                <div className="mt-2">
                  <MiniChart data={stats?.dailyActivity || []} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Asset Breakdown */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title">Your Assets</h2>
              <Link href="/dashboard/assets" className="btn btn-sm btn-primary">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="stat bg-base-200 rounded-lg">
                <div className="stat-figure text-2xl">🔗</div>
                <div className="stat-title">Short URLs</div>
                <div className="stat-value text-2xl">
                  {loading ? "..." : stats?.urlsCount || 0}
                </div>
                <div className="stat-desc">
                  <Link href="/shorten" className="link link-primary">
                    Create new
                  </Link>
                </div>
              </div>

              <div className="stat bg-base-200 rounded-lg">
                <div className="stat-figure text-2xl">📱</div>
                <div className="stat-title">QR Codes</div>
                <div className="stat-value text-2xl">
                  {loading ? "..." : stats?.qrCount || 0}
                </div>
                <div className="stat-desc">
                  <Link href="/qr-generator" className="link link-primary">
                    Create new
                  </Link>
                </div>
              </div>

              <div className="stat bg-base-200 rounded-lg">
                <div className="stat-figure text-2xl">📝</div>
                <div className="stat-title">MD Files</div>
                <div className="stat-value text-2xl">
                  {loading ? "..." : stats?.markdownCount || 0}
                </div>
                <div className="stat-desc">
                  <Link href="/markdown" className="link link-primary">
                    Create new
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/shorten"
                className="btn btn-lg btn-outline justify-start gap-3"
              >
                <span className="text-2xl">🔗</span>
                <span>Create Short URL</span>
              </Link>
              <Link
                href="/qr-generator"
                className="btn btn-lg btn-outline justify-start gap-3"
              >
                <span className="text-2xl">📱</span>
                <span>Generate QR Code</span>
              </Link>
              <Link
                href="/markdown"
                className="btn btn-lg btn-outline justify-start gap-3"
              >
                <span className="text-2xl">📝</span>
                <span>Convert Markdown</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
