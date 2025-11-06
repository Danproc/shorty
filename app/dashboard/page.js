import { createClient } from "@/libs/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch user's stats
  const { data: urls } = await supabase
    .from("short_urls")
    .select("id, click_count")
    .eq("user_id", user.id)
    .eq("is_active", true);

  const { data: qrs } = await supabase
    .from("qr_codes")
    .select("id, scan_count")
    .eq("user_id", user.id)
    .eq("is_active", true);

  const totalClicks = urls?.reduce((sum, url) => sum + (url.click_count || 0), 0) || 0;
  const totalScans = qrs?.reduce((sum, qr) => sum + (qr.scan_count || 0), 0) || 0;
  const totalUrls = urls?.length || 0;
  const totalQrs = qrs?.length || 0;

  return (
    <main className="p-8 pb-24">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
            Dashboard
          </h1>
          <p className="text-base-content/70">
            Welcome back! Here&apos;s an overview of your assets.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="stat bg-base-200 rounded-lg shadow">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="stat-title">Total URLs</div>
            <div className="stat-value text-primary">{totalUrls}</div>
            <div className="stat-desc">{totalClicks} total clicks</div>
          </div>

          <div className="stat bg-base-200 rounded-lg shadow">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
              </svg>
            </div>
            <div className="stat-title">Total QR Codes</div>
            <div className="stat-value text-secondary">{totalQrs}</div>
            <div className="stat-desc">{totalScans} total scans</div>
          </div>

          <div className="stat bg-base-200 rounded-lg shadow">
            <div className="stat-figure text-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </div>
            <div className="stat-title">Total Views</div>
            <div className="stat-value text-info">{totalClicks + totalScans}</div>
            <div className="stat-desc">Combined activity</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Link href="/qr-generator" className="btn btn-outline btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Generate QR Code
              </Link>
              <Link href="/shorten" className="btn btn-outline btn-secondary">
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
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Recent URLs</h2>
              {urls && urls.length > 0 ? (
                <div className="space-y-2">
                  {urls.slice(0, 5).map((url) => (
                    <div key={url.id} className="flex items-center justify-between p-2 hover:bg-base-200 rounded">
                      <span className="text-sm truncate flex-1">URL #{url.id.slice(0, 8)}</span>
                      <span className="badge badge-sm">{url.click_count || 0} clicks</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-base-content/60">No URLs yet. Create your first one!</p>
              )}
              <Link href="/dashboard/urls" className="btn btn-sm btn-ghost mt-2">
                View All URLs →
              </Link>
            </div>
          </div>

          {/* Recent QR Codes */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Recent QR Codes</h2>
              {qrs && qrs.length > 0 ? (
                <div className="space-y-2">
                  {qrs.slice(0, 5).map((qr) => (
                    <div key={qr.id} className="flex items-center justify-between p-2 hover:bg-base-200 rounded">
                      <span className="text-sm truncate flex-1">QR #{qr.id.slice(0, 8)}</span>
                      <span className="badge badge-sm">{qr.scan_count || 0} scans</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-base-content/60">No QR codes yet. Create your first one!</p>
              )}
              <Link href="/dashboard/qrs" className="btn btn-sm btn-ghost mt-2">
                View All QR Codes →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
