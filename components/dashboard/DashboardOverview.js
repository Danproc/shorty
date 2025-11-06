"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import KPICard from "./KPICard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
    <main className="p-4 md:p-8 pb-24 bg-base-200">
      <section className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold">Analytics</h1>
          <p className="text-base-content/70 mt-1">
            Track your links, QR codes, and conversions
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <KPICard
            title="Total Assets"
            value={loading ? "..." : stats?.totalAssets || 0}
            loading={loading}
          />
          <KPICard
            title="Total Scans (7 days)"
            value={loading ? "..." : stats?.totalScans7Days || 0}
            loading={loading}
          />
          <div className="card bg-base-100 hover:shadow-sm transition-all duration-200 rounded-lg border border-base-300 hover:border-primary/30 md:col-span-2 lg:col-span-1">
            <div className="card-body p-4">
              <p className="text-xs text-base-content/60 font-medium uppercase tracking-wide">Activity Trend (7 Days)</p>
              {loading ? (
                <div className="skeleton h-24 w-full mt-2 rounded-lg"></div>
              ) : (
                <div className="mt-2 h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats?.dailyActivity || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} />
                      <XAxis
                        dataKey="date"
                        stroke="currentColor"
                        strokeOpacity={0.2}
                        style={{ fontSize: '9px' }}
                        tick={{ fill: 'currentColor', opacity: 0.4 }}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="currentColor"
                        strokeOpacity={0.2}
                        style={{ fontSize: '9px' }}
                        tick={{ fill: 'currentColor', opacity: 0.4 }}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--b1))',
                          border: '1px solid hsl(var(--bc) / 0.2)',
                          borderRadius: '0.5rem',
                          fontSize: '11px'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#3ECF8E"
                        strokeWidth={1.5}
                        strokeOpacity={0.6}
                        dot={false}
                        activeDot={{ r: 3, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Asset Breakdown */}
        <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-2 border-primary/20 hover:border-primary/30">
          <div className="card-body p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="card-title text-2xl font-bold">Your Assets</h2>
              <Link href="/dashboard/assets" className="btn btn-sm btn-primary rounded-lg hover:scale-105 transition-transform">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="stat bg-base-200 rounded-xl p-5 border-2 border-primary/15 hover:border-primary/30 transition-all hover:shadow-md">
                <div className="stat-title text-base-content/70 font-semibold uppercase text-xs tracking-wide">Short URLs</div>
                <div className="stat-value text-3xl text-base-content font-extrabold mt-2">
                  {loading ? "..." : stats?.urlsCount || 0}
                </div>
                <div className="stat-desc mt-2">
                  <Link href="/shorten" className="link link-primary font-semibold hover:underline">
                    Create new →
                  </Link>
                </div>
              </div>

              <div className="stat bg-base-200 rounded-xl p-5 border-2 border-primary/15 hover:border-primary/30 transition-all hover:shadow-md">
                <div className="stat-title text-base-content/70 font-semibold uppercase text-xs tracking-wide">QR Codes</div>
                <div className="stat-value text-3xl text-base-content font-extrabold mt-2">
                  {loading ? "..." : stats?.qrCount || 0}
                </div>
                <div className="stat-desc mt-2">
                  <Link href="/qr-generator" className="link link-primary font-semibold hover:underline">
                    Create new →
                  </Link>
                </div>
              </div>

              <div className="stat bg-base-200 rounded-xl p-5 border-2 border-primary/15 hover:border-primary/30 transition-all hover:shadow-md">
                <div className="stat-title text-base-content/70 font-semibold uppercase text-xs tracking-wide">MD Files</div>
                <div className="stat-value text-3xl text-base-content font-extrabold mt-2">
                  {loading ? "..." : stats?.markdownCount || 0}
                </div>
                <div className="stat-desc mt-2">
                  <Link href="/markdown" className="link link-primary font-semibold hover:underline">
                    Create new →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-2 border-primary/20 hover:border-primary/30">
          <div className="card-body p-6">
            <h2 className="card-title text-2xl font-bold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/shorten"
                className="btn btn-lg btn-outline rounded-xl hover:scale-105 transition-transform border-2"
              >
                Create Short URL
              </Link>
              <Link
                href="/qr-generator"
                className="btn btn-lg btn-outline rounded-xl hover:scale-105 transition-transform border-2"
              >
                Generate QR Code
              </Link>
              <Link
                href="/markdown"
                className="btn btn-lg btn-outline rounded-xl hover:scale-105 transition-transform border-2"
              >
                Convert Markdown
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
