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

  const downloadQRCode = (qrCode, targetUrl) => {
    try {
      const canvas = document.getElementById(`qr-canvas-${qrCode}`);
      if (!canvas) {
        toast.error('Failed to download QR code');
        return;
      }

      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-code-${qrCode}.png`;
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
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Target URL</th>
                      <th>QR Code</th>
                      <th>Scans</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {qrCodes.map((qr) => (
                      <tr key={qr.id}>
                        <td>
                          <div className="font-medium">
                            {qr.title || 'Untitled'}
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <a
                              href={qr.target_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="link link-primary truncate max-w-xs"
                            >
                              {qr.target_url}
                            </a>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <code className="bg-base-200 px-2 py-1 rounded">
                              {window.location.origin}/q/{qr.qr_code}
                            </code>
                            <button
                              onClick={() => copyToClipboard(`${window.location.origin}/q/${qr.qr_code}`)}
                              className="btn btn-ghost btn-xs"
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
                          <div className="badge badge-ghost">
                            {qr.scan_count || 0} scans
                          </div>
                        </td>
                        <td>{formatDate(qr.created_at)}</td>
                        <td>
                          <div className="flex gap-2">
                            <Link
                              href={`/qr-generator?url=${encodeURIComponent(qr.target_url)}&title=${encodeURIComponent(qr.title || '')}`}
                              className="btn btn-ghost btn-xs"
                              title="View QR code"
                            >
                              View
                            </Link>
                            <button
                              onClick={() => downloadQRCode(qr.qr_code, qr.target_url)}
                              className="btn btn-ghost btn-xs"
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
                                value={`${window.location.origin}/q/${qr.qr_code}`}
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
