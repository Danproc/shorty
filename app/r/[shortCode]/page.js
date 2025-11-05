import { redirect } from 'next/navigation';
import { createClient } from '@/libs/supabase/server';
import { isExpired } from '@/libs/shortener';

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

  // Redirect to original URL
  // IMPORTANT: This must be outside try-catch because redirect() throws NEXT_REDIRECT
  redirect(shortUrl.original_url);
}
