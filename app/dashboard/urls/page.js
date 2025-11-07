"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/libs/supabase/client";

export default function URLsPage() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchURLs = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('short_urls')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching URLs:', error);
        } else {
          setUrls(data || []);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchURLs();
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

  return (
    <main className="p-4 md:p-8 pb-24 bg-base-200">
      <section className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold">Short URLs</h1>
          <p className="text-base-content/70 mt-1">
            Manage your shortened URLs and view analytics
          </p>
        </div>

        <div className="card bg-base-100 shadow-xl rounded-xl">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title">Your URLs</h2>
              <Link href="/shorten" className="btn btn-sm btn-primary rounded-lg">
                Create Short URL
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : urls.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-base-content/60">No shortened URLs yet. Create your first one!</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-base-300">
                <table className="table w-full">
                  <thead className="bg-base-200">
                    <tr className="border-b border-base-300">
                      <th className="font-semibold text-sm uppercase tracking-wide">Title</th>
                      <th className="font-semibold text-sm uppercase tracking-wide">Original URL</th>
                      <th className="font-semibold text-sm uppercase tracking-wide">Short URL</th>
                      <th className="font-semibold text-sm uppercase tracking-wide">Clicks</th>
                      <th className="font-semibold text-sm uppercase tracking-wide">Created</th>
                      <th className="font-semibold text-sm uppercase tracking-wide">Status</th>
                      <th className="font-semibold text-sm uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {urls.map((url) => (
                      <tr key={url.id} className="border-b border-base-200 hover:bg-base-100 transition-colors">
                        <td className="font-medium">
                          {url.title || 'Untitled'}
                        </td>
                        <td>
                          <a
                            href={url.original_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link link-primary truncate max-w-xs inline-block hover:underline"
                          >
                            {url.original_url}
                          </a>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <code className="bg-base-200 px-3 py-1.5 rounded-lg text-sm font-mono border border-base-300">
                              {window.location.origin}/{url.short_code}
                            </code>
                            <button
                              onClick={() => copyToClipboard(`${window.location.origin}/${url.short_code}`)}
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
                          <div className="badge badge-ghost badge-lg rounded-lg">
                            {url.click_count || 0}
                          </div>
                        </td>
                        <td className="text-sm text-base-content/70">{formatDate(url.created_at)}</td>
                        <td>
                          {url.is_active ? (
                            <div className="badge badge-sm rounded-full bg-green-500 text-black border-0 font-medium">
                              <span className="text-xs">Active</span>
                            </div>
                          ) : (
                            <div className="badge badge-ghost badge-sm rounded-full font-medium">
                              <span className="text-xs">Inactive</span>
                            </div>
                          )}
                        </td>
                        <td>
                          <a
                            href={`/${url.short_code}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-ghost rounded-lg hover:bg-base-200"
                          >
                            Visit
                          </a>
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
