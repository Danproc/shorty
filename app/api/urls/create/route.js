import { NextResponse } from 'next/server';
import { createClient } from '@/libs/supabase/server';
import {
  generateShortCode,
  isValidUrl,
  normalizeUrl,
  isValidCustomSlug,
  isReservedSlug,
} from '@/libs/shortener';

export async function POST(req) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { url, customSlug, title } = body;

    // Validate URL
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Normalize and validate URL
    const normalizedUrl = normalizeUrl(url);
    if (!isValidUrl(normalizedUrl)) {
      return NextResponse.json(
        { error: 'Invalid URL format. Please include http:// or https://' },
        { status: 400 }
      );
    }

    // Get user (optional - anonymous users allowed)
    const { data: { user } } = await supabase.auth.getUser();

    // Generate or validate short code
    let shortCode;
    let attempts = 0;
    const maxAttempts = 5;

    if (customSlug) {
      // Validate custom slug
      if (!isValidCustomSlug(customSlug)) {
        return NextResponse.json(
          {
            error: 'Invalid custom slug. Use 3-20 alphanumeric characters, hyphens, or underscores only.'
          },
          { status: 400 }
        );
      }

      if (isReservedSlug(customSlug)) {
        return NextResponse.json(
          { error: 'This slug is reserved. Please choose a different one.' },
          { status: 400 }
        );
      }

      // Check if custom slug is available
      const { data: existing } = await supabase
        .from('short_urls')
        .select('id')
        .eq('short_code', customSlug)
        .single();

      if (existing) {
        return NextResponse.json(
          { error: 'This custom slug is already taken. Please choose a different one.' },
          { status: 409 }
        );
      }

      shortCode = customSlug;
    } else {
      // Generate unique short code
      while (attempts < maxAttempts) {
        shortCode = generateShortCode();

        // Check if short code already exists
        const { data: existing } = await supabase
          .from('short_urls')
          .select('id')
          .eq('short_code', shortCode)
          .single();

        if (!existing) {
          break; // Found a unique code
        }

        attempts++;
      }

      if (attempts >= maxAttempts) {
        return NextResponse.json(
          { error: 'Failed to generate unique short code. Please try again.' },
          { status: 500 }
        );
      }
    }

    // Create short URL record
    const { data: shortUrl, error: insertError } = await supabase
      .from('short_urls')
      .insert([
        {
          user_id: user?.id || null,
          short_code: shortCode,
          original_url: normalizedUrl,
          title: title || null,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating short URL:', insertError);
      return NextResponse.json(
        { error: 'Failed to create short URL' },
        { status: 500 }
      );
    }

    // Get base URL for constructing short URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
                    `${req.headers.get('x-forwarded-proto') || 'http'}://${req.headers.get('host')}`;

    // Return success response with short URL data
    return NextResponse.json({
      success: true,
      data: {
        id: shortUrl.id,
        shortCode: shortUrl.short_code,
        shortUrl: `${baseUrl}/r/${shortUrl.short_code}`,
        originalUrl: shortUrl.original_url,
        title: shortUrl.title,
        createdAt: shortUrl.created_at,
      },
    });

  } catch (error) {
    console.error('Error in /api/urls/create:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
