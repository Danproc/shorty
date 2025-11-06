import { NextResponse } from 'next/server';
import { createClient } from '@/libs/supabase/server';
import { generateShortCode, isValidUrl, normalizeUrl } from '@/libs/shortener';

export async function POST(req) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { targetUrl, title } = body;

    // Validate URL
    if (!targetUrl) {
      return NextResponse.json(
        { error: 'Target URL is required' },
        { status: 400 }
      );
    }

    // Normalize URL if it's a valid URL
    let normalizedUrl = targetUrl;
    if (isValidUrl(normalizeUrl(targetUrl))) {
      normalizedUrl = normalizeUrl(targetUrl);
    }

    // Get user (optional - anonymous users allowed)
    const { data: { user } } = await supabase.auth.getUser();

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
        .single();

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
          target_url: normalizedUrl,
          title: title || null,
          is_active: true,
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

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        id: qrCodeData.id,
        qrCode: qrCodeData.qr_code,
        qrUrl: `${baseUrl}/qr/${qrCodeData.qr_code}`,
        targetUrl: qrCodeData.target_url,
        title: qrCodeData.title,
        createdAt: qrCodeData.created_at,
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
