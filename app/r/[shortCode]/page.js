import { redirect } from 'next/navigation';
import { createClient } from '@/libs/supabase/server';
import { isExpired } from '@/libs/shortener';
import ReactMarkdown from 'react-markdown';

export const dynamic = 'force-dynamic';

export default async function RedirectPage({ params }) {
  const { shortCode } = await params;

  if (!shortCode) {
    redirect('/');
  }

  const supabase = await createClient();

  let shortUrl;

  try {
    // Fetch the short URL record
    const { data, error: fetchError } = await supabase
      .from('short_urls')
      .select('*')
      .eq('short_code', shortCode)
      .single();

    // Handle not found
    if (fetchError || !data) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
          <div className="card bg-base-100 shadow-xl max-w-md">
            <div className="card-body text-center">
              <h1 className="text-4xl font-bold text-error mb-4">404</h1>
              <h2 className="text-2xl font-semibold mb-2">Link Not Found</h2>
              <p className="text-base-content/70 mb-6">
                This short link does not exist or has been deleted.
              </p>
              <a href="/" className="btn btn-primary">
                Go to Homepage
              </a>
            </div>
          </div>
        </div>
      );
    }

    shortUrl = data;

  } catch (error) {
    console.error('Error fetching short URL:', error);

    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card bg-base-100 shadow-xl max-w-md">
          <div className="card-body text-center">
            <h1 className="text-4xl font-bold text-error mb-4">❌</h1>
            <h2 className="text-2xl font-semibold mb-2">Something Went Wrong</h2>
            <p className="text-base-content/70 mb-6">
              We encountered an error while processing your request.
            </p>
            <a href="/" className="btn btn-primary">
              Go to Homepage
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Check if URL is active
  if (!shortUrl.is_active) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card bg-base-100 shadow-xl max-w-md">
          <div className="card-body text-center">
            <h1 className="text-4xl font-bold text-warning mb-4">⚠️</h1>
            <h2 className="text-2xl font-semibold mb-2">Link Deactivated</h2>
            <p className="text-base-content/70 mb-6">
              This short link has been deactivated by its owner.
            </p>
            <a href="/" className="btn btn-primary">
              Go to Homepage
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Check if URL has expired
  if (isExpired(shortUrl.expires_at)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card bg-base-100 shadow-xl max-w-md">
          <div className="card-body text-center">
            <h1 className="text-4xl font-bold text-warning mb-4">⏰</h1>
            <h2 className="text-2xl font-semibold mb-2">Link Expired</h2>
            <p className="text-base-content/70 mb-6">
              This short link has expired and is no longer available.
            </p>
            <a href="/" className="btn btn-primary">
              Go to Homepage
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Increment click count (fire and forget)
  // We use rpc to call the database function for better performance
  supabase.rpc('increment_click_count', {
    short_code_param: shortCode
  }).then(({ error }) => {
    if (error) {
      console.error('Error incrementing click count:', error);
    }
  });

  // If there's markdown content, display it instead of redirecting
  if (shortUrl.markdown_content || shortUrl.html_content) {
    return (
      <div className="min-h-screen bg-base-200 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Card */}
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              {shortUrl.title && (
                <h1 className="text-3xl font-bold mb-4">{shortUrl.title}</h1>
              )}

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-base-content/60 mb-1">Original URL:</p>
                  <a
                    href={shortUrl.original_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline break-all font-mono text-sm"
                  >
                    {shortUrl.original_url}
                  </a>
                </div>

                <a
                  href={shortUrl.original_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm sm:btn-md whitespace-nowrap"
                >
                  Visit Link
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Markdown Content Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
                <ReactMarkdown>{shortUrl.markdown_content}</ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <a href="/" className="btn btn-ghost btn-sm">
              Create your own short link
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to original URL if no markdown content
  // IMPORTANT: This must be outside try-catch because redirect() throws NEXT_REDIRECT
  redirect(shortUrl.original_url);
}
