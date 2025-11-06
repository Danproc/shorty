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
    <main className="min-h-screen p-4 md:p-8 pb-24 bg-base-200">
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
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Original URL</th>
                      <th>Short URL</th>
                      <th>Clicks</th>
                      <th>Created</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {urls.map((url) => (
                      <tr key={url.id}>
                        <td>
                          <div className="font-medium">
                            {url.title || 'Untitled'}
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <a
                              href={url.original_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="link link-primary truncate max-w-xs"
                            >
                              {url.original_url}
                            </a>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <code className="bg-base-200 px-2 py-1 rounded">
                              {window.location.origin}/{url.short_code}
                            </code>
                            <button
                              onClick={() => copyToClipboard(`${window.location.origin}/${url.short_code}`)}
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
                            {url.click_count || 0} clicks
                          </div>
                        </td>
                        <td>{formatDate(url.created_at)}</td>
                        <td>
                          <div className={`badge ${url.is_active ? 'badge-success' : 'badge-error'}`}>
                            {url.is_active ? 'Active' : 'Inactive'}
                          </div>
                        </td>
                        <td>
                          <a
                            href={`/${url.short_code}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-ghost btn-xs"
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
