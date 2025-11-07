import { NextResponse } from 'next/server';
import { createClient } from '@/libs/supabase/server';
import { generateShortCode, isValidUrl, normalizeUrl } from '@/libs/shortener';
import { checkSubscription } from '@/libs/subscription';

// Helper function to detect content type
function detectContentType(input) {
  // Try to normalize and validate as URL
  const normalized = normalizeUrl(input);
  if (isValidUrl(normalized)) {
    return 'url';
  }

  // If not a valid URL, treat as plain text
  return 'text';
}

export async function POST(req) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { targetUrl, title, trackingEnabled } = body;

    // Validate input
    if (!targetUrl) {
      return NextResponse.json(
        { error: 'Target content is required' },
        { status: 400 }
      );
    }

    // Detect content type and normalize if URL
    const contentType = detectContentType(targetUrl);
    let normalizedContent = targetUrl;

    if (contentType === 'url') {
      normalizedContent = normalizeUrl(targetUrl);
    }

    // Get user (optional - anonymous users allowed)
    const { data: { user } } = await supabase.auth.getUser();

    // Check if user has subscription (required for tracking)
    let canEnableTracking = false;
    if (user?.id) {
      const { hasAccess } = await checkSubscription(user.id);
      canEnableTracking = hasAccess;
    }

    // Only enable tracking if user has subscription and requested it
    const shouldEnableTracking = trackingEnabled && canEnableTracking;

    // Generate unique QR code
    let qrCode;
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      qrCode = generateShortCode();

      // Check if QR code already exists
      const { data: existing } = await supabase
        .from('qr_codes')
        .select('id')
        .eq('qr_code', qrCode)
        .maybeSingle();

      if (!existing) {
        break; // Found a unique code
      }

      attempts++;
    }

    if (attempts >= maxAttempts) {
      return NextResponse.json(
        { error: 'Failed to generate unique QR code. Please try again.' },
        { status: 500 }
      );
    }

    // Create QR code record
    const { data: qrCodeData, error: insertError } = await supabase
      .from('qr_codes')
      .insert([
        {
          user_id: user?.id || null,
          qr_code: qrCode,
          target_url: normalizedContent,
          title: title || null,
          is_active: true,
          tracking_enabled: shouldEnableTracking,
          content_type: contentType,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating QR code:', insertError);
      return NextResponse.json(
        { error: 'Failed to create QR code' },
        { status: 500 }
      );
    }

    // Get base URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
                    `${req.headers.get('x-forwarded-proto') || 'http'}://${req.headers.get('host')}`;

    // Determine QR URL based on tracking setting
    // If tracking is enabled, encode the tracking redirect URL
    // Otherwise, encode the direct content (URL or plain text)
    const qrUrl = shouldEnableTracking
      ? `${baseUrl}/qr/${qrCodeData.qr_code}`
      : qrCodeData.target_url;

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        id: qrCodeData.id,
        qrCode: qrCodeData.qr_code,
        qrUrl: qrUrl,
        targetUrl: qrCodeData.target_url,
        title: qrCodeData.title,
        createdAt: qrCodeData.created_at,
        trackingEnabled: shouldEnableTracking,
      },
    });

  } catch (error) {
    console.error('Error in /api/qr/create:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
