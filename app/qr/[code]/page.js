import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/libs/supabase/server';
import { hashString, getSessionId } from '@/libs/analytics';
import { trackServerEvent } from '@/libs/posthog/server';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function QRRedirectPage({ params }) {
  const { code } = await params;

  if (!code) {
    redirect('/');
  }

  const supabase = await createClient();

  let qrCode;

  try {
    // Fetch the QR code record
    const { data, error: fetchError } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('qr_code', code)
      .single();

    // Handle not found
    if (fetchError || !data) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
          <div className="card bg-base-100 shadow-xl max-w-md">
            <div className="card-body text-center">
              <h1 className="text-4xl font-bold text-error mb-4">404</h1>
              <h2 className="text-2xl font-semibold mb-2">QR Code Not Found</h2>
              <p className="text-base-content/70 mb-6">
                This QR code does not exist or has been deleted.
              </p>
              <Link href="/" className="btn btn-primary">
                Go to Homepage
              </Link>
            </div>
          </div>
        </div>
      );
    }

    qrCode = data;

  } catch (error) {
    console.error('Error fetching QR code:', error);

    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card bg-base-100 shadow-xl max-w-md">
          <div className="card-body text-center">
            <h1 className="text-4xl font-bold text-error mb-4">❌</h1>
            <h2 className="text-2xl font-semibold mb-2">Something Went Wrong</h2>
            <p className="text-base-content/70 mb-6">
              We encountered an error while processing your request.
            </p>
            <Link href="/" className="btn btn-primary">
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check if QR code is active
  if (!qrCode.is_active) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card bg-base-100 shadow-xl max-w-md">
          <div className="card-body text-center">
            <h1 className="text-4xl font-bold text-warning mb-4">⚠️</h1>
            <h2 className="text-2xl font-semibold mb-2">QR Code Deactivated</h2>
            <p className="text-base-content/70 mb-6">
              This QR code has been deactivated by its owner.
            </p>
            <Link href="/" className="btn btn-primary">
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Increment scan count (fire and forget)
  supabase.rpc('increment_qr_scan_count', {
    qr_code_param: code
  }).then(({ error }) => {
    if (error) {
      console.error('Error incrementing scan count:', error);
    }
  });

  // Track analytics event (fire and forget)
  const trackAnalytics = async () => {
    try {
      const headersList = await headers();
      const userAgent = headersList.get('user-agent') || '';
      const referer = headersList.get('referer') || headersList.get('referrer') || null;
      const countryCode = headersList.get('cf-ipcountry') || null;

      // Create a mock request object for analytics functions
      const mockReq = {
        headers: {
          get: (key) => headersList.get(key)
        }
      };

      const sessionId = getSessionId(mockReq);
      const userAgentHash = hashString(userAgent);

      // Record in Supabase
      await supabase.rpc('record_asset_event', {
        p_asset_type: 'qr_code',
        p_asset_id: qrCode.id,
        p_event_type: 'scan',
        p_referer: referer,
        p_user_agent_hash: userAgentHash,
        p_country_code: countryCode,
        p_session_id: sessionId,
      });

      // Track in PostHog
      await trackServerEvent('Asset Visited', {
        distinctId: sessionId,
        properties: {
          asset_id: qrCode.id,
          asset_type: 'qr_code',
          qr_code: code,
          referer: referer,
          country: countryCode,
        }
      });
    } catch (error) {
      console.error('Error tracking analytics:', error);
    }
  };

  trackAnalytics(); // Fire and forget

  // Redirect to target URL
  redirect(qrCode.target_url);
}
