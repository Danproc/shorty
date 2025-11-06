"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/libs/supabase/client";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const supabase = createClient();

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch user's stats
      const { data: urls } = await supabase
        .from("short_urls")
        .select("id, click_count, created_at")
        .eq("user_id", user.id)
        .eq("is_active", true);

      const { data: qrs } = await supabase
        .from("qr_codes")
        .select("id, scan_count, created_at")
        .eq("user_id", user.id)
        .eq("is_active", true);

      const totalClicks = urls?.reduce((sum, url) => sum + (url.click_count || 0), 0) || 0;
      const totalScans = qrs?.reduce((sum, qr) => sum + (qr.scan_count || 0), 0) || 0;
      const totalUrls = urls?.length || 0;
      const totalQrs = qrs?.length || 0;

      // Get analytics data for last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: analyticsData } = await supabase
        .from("asset_analytics")
        .select("created_at, asset_type")
        .gte("created_at", sevenDaysAgo.toISOString())
        .order("created_at", { ascending: true });

      // Group analytics by day and type
      const dailyActivity = {};
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        dailyActivity[dateStr] = { urls: 0, qrs: 0, total: 0 };
      }

      analyticsData?.forEach((event) => {
        const dateStr = new Date(event.created_at).toISOString().split('T')[0];
        if (dailyActivity[dateStr] !== undefined) {
          dailyActivity[dateStr].total++;
          if (event.asset_type === 'short_url') {
            dailyActivity[dateStr].urls++;
          } else if (event.asset_type === 'qr_code') {
            dailyActivity[dateStr].qrs++;
          }
        }
      });

      const dailyActivityArray = Object.entries(dailyActivity).map(([date, counts]) => ({
        date: date.split('-').slice(1).join('/'), // Format as MM/DD
        URLs: counts.urls,
        QRs: counts.qrs,
        Total: counts.total,
      }));

      setStats({
        totalUrls,
        totalQrs,
        totalClicks,
        totalScans,
        urls: urls || [],
        qrs: qrs || [],
        dailyActivity: dailyActivityArray,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="p-8 pb-24 bg-base-200 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="p-8 pb-24 bg-base-200 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
            Dashboard
          </h1>
          <p className="text-base-content/70">
            Welcome back! Here&apos;s an overview of your assets.
          </p>
        </div>

        {/* Stats Grid with Visible Borders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="stat bg-base-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary/20 hover:border-primary/40 p-6">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-10 h-10 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div className="stat-title text-base-content/70 font-semibold uppercase text-xs tracking-wide">Total URLs</div>
            <div className="stat-value text-4xl text-primary font-extrabold mt-2">{stats?.totalUrls || 0}</div>
            <div className="stat-desc text-success font-semibold mt-2">{stats?.totalClicks || 0} total clicks</div>
          </div>

          <div className="stat bg-base-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary/20 hover:border-primary/40 p-6">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-10 h-10 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
              </svg>
            </div>
            <div className="stat-title text-base-content/70 font-semibold uppercase text-xs tracking-wide">Total QR Codes</div>
            <div className="stat-value text-4xl text-primary font-extrabold mt-2">{stats?.totalQrs || 0}</div>
            <div className="stat-desc text-success font-semibold mt-2">{stats?.totalScans || 0} total scans</div>
          </div>

          <div className="stat bg-base-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary/20 hover:border-primary/40 p-6">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-10 h-10 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </div>
            <div className="stat-title text-base-content/70 font-semibold uppercase text-xs tracking-wide">Total Views</div>
            <div className="stat-value text-4xl text-primary font-extrabold mt-2">{(stats?.totalClicks || 0) + (stats?.totalScans || 0)}</div>
            <div className="stat-desc text-base-content/60 font-semibold mt-2">Combined activity</div>
          </div>
        </div>

        {/* Activity Chart - PostHog Style with Stacked Bars */}
        <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-2 border-primary/20 hover:border-primary/30">
          <div className="card-body p-6">
            <h2 className="card-title text-2xl font-bold mb-4">Activity Trend (Last 7 Days)</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.dailyActivity || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                  <XAxis
                    dataKey="date"
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                    tick={{ fill: '#6b7280' }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                    tick={{ fill: '#6b7280' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F1419',
                      border: '2px solid #3ECF8E',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                      color: '#E5E7EB'
                    }}
                  />
                  <Bar dataKey="URLs" stackId="a" fill="#3ECF8E" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="QRs" stackId="a" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t-2 border-primary/20">
              <div className="text-center">
                <p className="text-xs text-base-content/60 uppercase font-semibold tracking-wide">URL Clicks</p>
                <p className="text-2xl font-bold text-primary mt-1">{stats?.totalClicks || 0}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-base-content/60 uppercase font-semibold tracking-wide">QR Scans</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{stats?.totalScans || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-2 border-primary/20 hover:border-primary/30">
          <div className="card-body p-6">
            <h2 className="card-title text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/qr-generator" className="btn btn-outline btn-primary btn-lg rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Generate QR Code
              </Link>
              <Link href="/shorten" className="btn btn-outline btn-primary btn-lg rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Shorten URL
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent URLs */}
          <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-2 border-primary/20 hover:border-primary/30">
            <div className="card-body p-6">
              <h2 className="card-title text-xl font-bold mb-4">Recent URLs</h2>
              {stats?.urls && stats.urls.length > 0 ? (
                <div className="space-y-2">
                  {stats.urls.slice(0, 5).map((url) => (
                    <div key={url.id} className="flex items-center justify-between p-3 hover:bg-base-200 rounded-lg transition-colors border border-primary/10">
                      <span className="text-sm truncate flex-1 font-medium">URL #{url.id.slice(0, 8)}</span>
                      <span className="badge badge-primary badge-sm">{url.click_count || 0} clicks</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-base-content/60">No URLs yet. Create your first one!</p>
              )}
              <Link href="/dashboard/urls" className="btn btn-sm btn-ghost mt-4 hover:bg-primary/10">
                View All URLs →
              </Link>
            </div>
          </div>

          {/* Recent QR Codes */}
          <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-2 border-primary/20 hover:border-primary/30">
            <div className="card-body p-6">
              <h2 className="card-title text-xl font-bold mb-4">Recent QR Codes</h2>
              {stats?.qrs && stats.qrs.length > 0 ? (
                <div className="space-y-2">
                  {stats.qrs.slice(0, 5).map((qr) => (
                    <div key={qr.id} className="flex items-center justify-between p-3 hover:bg-base-200 rounded-lg transition-colors border border-primary/10">
                      <span className="text-sm truncate flex-1 font-medium">QR #{qr.id.slice(0, 8)}</span>
                      <span className="badge badge-primary badge-sm">{qr.scan_count || 0} scans</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-base-content/60">No QR codes yet. Create your first one!</p>
              )}
              <Link href="/dashboard/qrs" className="btn btn-sm btn-ghost mt-4 hover:bg-primary/10">
                View All QR Codes →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
