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
    <main className="p-8 pb-24 bg-base-200 min-h-screen">
      <section className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Analytics</h1>
          <p className="text-base-content/70">
            Track your links, QR codes, and conversions
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-2 border-primary/20 hover:border-primary/30 md:col-span-2 lg:col-span-1">
            <div className="card-body p-6">
              <p className="text-xs text-base-content/60 font-semibold uppercase tracking-wide">Activity Trend (7 Days)</p>
              {loading ? (
                <div className="skeleton h-24 w-full mt-2 rounded-lg"></div>
              ) : (
                <div className="mt-2 h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats?.dailyActivity || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                      <XAxis
                        dataKey="date"
                        stroke="#6b7280"
                        style={{ fontSize: '10px' }}
                        tick={{ fill: '#6b7280' }}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="#6b7280"
                        style={{ fontSize: '10px' }}
                        tick={{ fill: '#6b7280' }}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0F1419',
                          border: '2px solid #3ECF8E',
                          borderRadius: '0.75rem',
                          fontSize: '11px',
                          color: '#E5E7EB'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#3ECF8E"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, strokeWidth: 0 }}
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
            <h2 className="card-title text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/shorten"
                className="btn btn-lg btn-outline btn-primary rounded-xl hover:scale-105 transition-transform"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Create Short URL
              </Link>
              <Link
                href="/qr-generator"
                className="btn btn-lg btn-outline btn-primary rounded-xl hover:scale-105 transition-transform"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Generate QR Code
              </Link>
              <Link
                href="/markdown"
                className="btn btn-lg btn-outline btn-primary rounded-xl hover:scale-105 transition-transform"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Convert Markdown
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
