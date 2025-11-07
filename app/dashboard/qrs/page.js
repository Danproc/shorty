"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/libs/supabase/client";
import { QRCodeCanvas } from "qrcode.react";
import toast from "react-hot-toast";

export default function QRsPage() {
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchQRCodes = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('qr_codes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching QR codes:', error);
        } else {
          setQrCodes(data || []);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQRCodes();
  }, [supabase]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const getQRCodeUrl = (qr) => {
    // If tracking is enabled, use redirect URL. Otherwise, use direct target URL.
    return qr.tracking_enabled
      ? `${window.location.origin}/qr/${qr.qr_code}`
      : qr.target_url;
  };

  const downloadQRCode = (qr) => {
    try {
      const canvas = document.getElementById(`qr-canvas-${qr.qr_code}`);
      if (!canvas) {
        toast.error('Failed to download QR code');
        return;
      }

      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-code-${qr.qr_code}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('QR code downloaded!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download QR code');
    }
  };

  return (
    <main className="p-4 md:p-8 pb-24 bg-base-200">
      <section className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold">QR Codes</h1>
          <p className="text-base-content/70 mt-1">
            Manage your QR codes and track their performance
          </p>
        </div>

        <div className="card bg-base-100 shadow-xl rounded-xl">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title">Your QR Codes</h2>
              <Link href="/qr-generator" className="btn btn-sm btn-primary rounded-lg">
                Create New QR Code
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : qrCodes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-base-content/60">No QR codes yet. Create your first one!</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-base-300">
                <table className="table w-full">
                  <thead className="bg-base-200">
                    <tr className="border-b border-base-300">
                      <th className="font-semibold text-sm uppercase tracking-wide">Title</th>
                      <th className="font-semibold text-sm uppercase tracking-wide">Target URL</th>
                      <th className="font-semibold text-sm uppercase tracking-wide">QR Code</th>
                      <th className="font-semibold text-sm uppercase tracking-wide">Tracking</th>
                      <th className="font-semibold text-sm uppercase tracking-wide">Scans</th>
                      <th className="font-semibold text-sm uppercase tracking-wide">Created</th>
                      <th className="font-semibold text-sm uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {qrCodes.map((qr) => (
                      <tr key={qr.id} className="border-b border-base-200 hover:bg-base-100 transition-colors">
                        <td className="font-medium">
                          {qr.title || 'Untitled'}
                        </td>
                        <td>
                          <a
                            href={qr.target_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link link-primary truncate max-w-xs inline-block hover:underline"
                          >
                            {qr.target_url}
                          </a>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <code className="bg-base-200 px-3 py-1.5 rounded-lg text-sm font-mono border border-base-300 max-w-xs truncate">
                              {qr.tracking_enabled ? `/qr/${qr.qr_code}` : qr.target_url}
                            </code>
                            <button
                              onClick={() => copyToClipboard(getQRCodeUrl(qr))}
                              className="btn btn-ghost btn-sm rounded-lg hover:bg-base-200"
                              title="Copy to clipboard"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                        <td>
                          {qr.tracking_enabled ? (
                            <div className="badge badge-success badge-sm gap-1 rounded-lg">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Enabled
                            </div>
                          ) : (
                            <div className="badge badge-ghost badge-sm gap-1 rounded-lg">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                              </svg>
                              Disabled
                            </div>
                          )}
                        </td>
                        <td>
                          {qr.tracking_enabled ? (
                            <div className="badge badge-ghost badge-lg rounded-lg">
                              {qr.scan_count || 0}
                            </div>
                          ) : (
                            <div className="text-sm text-base-content/50">—</div>
                          )}
                        </td>
                        <td className="text-sm text-base-content/70">{formatDate(qr.created_at)}</td>
                        <td>
                          <div className="flex gap-2">
                            <Link
                              href={`/qr-generator?url=${encodeURIComponent(qr.target_url)}&title=${encodeURIComponent(qr.title || '')}`}
                              className="btn btn-sm btn-ghost rounded-lg hover:bg-base-200"
                              title="View QR code"
                            >
                              View
                            </Link>
                            <button
                              onClick={() => downloadQRCode(qr)}
                              className="btn btn-sm btn-ghost rounded-lg hover:bg-base-200"
                              title="Download QR code"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                                />
                              </svg>
                            </button>
                            {/* Hidden canvas for QR code generation */}
                            <div style={{ display: 'none' }}>
                              <QRCodeCanvas
                                id={`qr-canvas-${qr.qr_code}`}
                                value={getQRCodeUrl(qr)}
                                size={512}
                                level="M"
                                includeMargin={true}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
