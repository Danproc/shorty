"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/libs/supabase/client";
import toast from "react-hot-toast";
import { trackEvent } from "@/libs/posthog/client";

export default function AssetsPage() {
  const [activeTab, setActiveTab] = useState("urls");
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssets();
  }, [activeTab]);

  const fetchAssets = async () => {
    setLoading(true);
    const supabase = createClient();

    try {
      let data = [];
      if (activeTab === "urls") {
        const { data: urls } = await supabase
          .from("short_urls")
          .select("*")
          .order("created_at", { ascending: false });
        data = urls || [];
      } else if (activeTab === "qr") {
        const { data: qrs } = await supabase
          .from("qr_codes")
          .select("*")
          .order("created_at", { ascending: false });
        data = qrs || [];
      } else if (activeTab === "markdown") {
        const { data: mds } = await supabase
          .from("markdown_conversions")
          .select("*")
          .order("created_at", { ascending: false });
        data = mds || [];
      }

      setAssets(data);
    } catch (error) {
      console.error("Error fetching assets:", error);
      toast.error("Failed to load assets");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this asset?")) return;

    const supabase = createClient();
    let tableName = "";

    if (activeTab === "urls") tableName = "short_urls";
    else if (activeTab === "qr") tableName = "qr_codes";
    else if (activeTab === "markdown") tableName = "markdown_conversions";

    try {
      const { error } = await supabase.from(tableName).delete().eq("id", id);

      if (error) throw error;

      toast.success("Asset deleted successfully");

      // Track event in PostHog
      trackEvent('Asset Deleted', {
        kind: activeTab === 'urls' ? 'short_url' : activeTab === 'qr' ? 'qr_code' : 'markdown',
      });

      fetchAssets();
    } catch (error) {
      console.error("Error deleting asset:", error);
      toast.error("Failed to delete asset");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const renderAssetRow = (asset) => {
    if (activeTab === "urls") {
      const shortUrl = `${window.location.origin}/r/${asset.short_code}`;
      return (
        <tr key={asset.id} className="hover">
          <td>
            <div>
              <div className="font-bold">{asset.title || "Untitled"}</div>
              <div className="text-sm opacity-70 truncate max-w-xs">
                {asset.original_url}
              </div>
            </div>
          </td>
          <td>
            <code className="bg-base-200 px-2 py-1 rounded text-sm">
              {asset.short_code}
            </code>
          </td>
          <td>{new Date(asset.created_at).toLocaleDateString()}</td>
          <td>{asset.click_count || 0}</td>
          <td>
            {asset.last_clicked_at
              ? new Date(asset.last_clicked_at).toLocaleDateString()
              : "Never"}
          </td>
          <td>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(shortUrl)}
                className="btn btn-xs btn-ghost"
                data-tooltip-id="tooltip"
                data-tooltip-content="Copy short URL"
              >
                Copy
              </button>
              <Link
                href={`/dashboard/assets/${asset.id}?type=url`}
                className="btn btn-xs btn-ghost"
                data-tooltip-id="tooltip"
                data-tooltip-content="View analytics"
              >
                Analytics
              </Link>
              <button
                onClick={() => handleDelete(asset.id)}
                className="btn btn-xs btn-ghost text-error"
                data-tooltip-id="tooltip"
                data-tooltip-content="Delete"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      );
    } else if (activeTab === "qr") {
      const qrUrl = `${window.location.origin}/qr/${asset.qr_code}`;
      return (
        <tr key={asset.id} className="hover">
          <td>
            <div>
              <div className="font-bold">{asset.title || "Untitled"}</div>
              <div className="text-sm opacity-70 truncate max-w-xs">
                {asset.target_url}
              </div>
            </div>
          </td>
          <td>
            <code className="bg-base-200 px-2 py-1 rounded text-sm">
              {asset.qr_code}
            </code>
          </td>
          <td>{new Date(asset.created_at).toLocaleDateString()}</td>
          <td>{asset.scan_count || 0}</td>
          <td>
            {asset.last_scanned_at
              ? new Date(asset.last_scanned_at).toLocaleDateString()
              : "Never"}
          </td>
          <td>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(qrUrl)}
                className="btn btn-xs btn-ghost"
                data-tooltip-id="tooltip"
                data-tooltip-content="Copy QR URL"
              >
                Copy
              </button>
              <Link
                href={`/dashboard/assets/${asset.id}?type=qr`}
                className="btn btn-xs btn-ghost"
                data-tooltip-id="tooltip"
                data-tooltip-content="View analytics"
              >
                Analytics
              </Link>
              <button
                onClick={() => handleDelete(asset.id)}
                className="btn btn-xs btn-ghost text-error"
                data-tooltip-id="tooltip"
                data-tooltip-content="Delete"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      );
    } else if (activeTab === "markdown") {
      return (
        <tr key={asset.id} className="hover">
          <td>
            <div>
              <div className="font-bold">{asset.title || "Untitled"}</div>
              <div className="text-sm opacity-70">Markdown Conversion</div>
            </div>
          </td>
          <td>-</td>
          <td>{new Date(asset.created_at).toLocaleDateString()}</td>
          <td>{asset.download_count || 0}</td>
          <td>
            {asset.last_downloaded_at
              ? new Date(asset.last_downloaded_at).toLocaleDateString()
              : "Never"}
          </td>
          <td>
            <div className="flex gap-2">
              <Link
                href={`/dashboard/assets/${asset.id}?type=markdown`}
                className="btn btn-xs btn-ghost"
                data-tooltip-id="tooltip"
                data-tooltip-content="View details"
              >
                Details
              </Link>
              <button
                onClick={() => handleDelete(asset.id)}
                className="btn btn-xs btn-ghost text-error"
                data-tooltip-id="tooltip"
                data-tooltip-content="Delete"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      );
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 pb-24 bg-base-200">
      <section className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">My Assets</h1>
            <p className="text-base-content/70 mt-1">
              Manage all your URLs, QR codes, and conversions
            </p>
          </div>
          <Link href="/dashboard" className="btn btn-ghost">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Tabs */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div role="tablist" className="tabs tabs-boxed mb-6">
              <a
                role="tab"
                className={`tab ${activeTab === "urls" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("urls")}
              >
                Short URLs
              </a>
              <a
                role="tab"
                className={`tab ${activeTab === "qr" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("qr")}
              >
                QR Codes
              </a>
              <a
                role="tab"
                className={`tab ${activeTab === "markdown" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("markdown")}
              >
                Markdown Files
              </a>
            </div>

            {/* Table */}
            {loading ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : assets.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-base-content/70 mb-4">
                  No {activeTab === "urls" ? "URLs" : activeTab === "qr" ? "QR codes" : "markdown files"} yet
                </p>
                <Link
                  href={
                    activeTab === "urls"
                      ? "/shorten"
                      : activeTab === "qr"
                      ? "/qr-generator"
                      : "/markdown"
                  }
                  className="btn btn-primary"
                >
                  Create your first one
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name / URL</th>
                      <th>Code</th>
                      <th>Created</th>
                      <th>Total Scans</th>
                      <th>Last Scan</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>{assets.map(renderAssetRow)}</tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
