import { NextResponse } from 'next/server';
import { createClient } from '@/libs/supabase/server';

export async function DELETE(req, { params }) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'URL ID is required' },
        { status: 400 }
      );
    }

    // Check if URL exists and belongs to user
    const { data: existingUrl, error: fetchError } = await supabase
      .from('short_urls')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingUrl) {
      return NextResponse.json(
        { error: 'URL not found or you do not have permission to delete it' },
        { status: 404 }
      );
    }

    // Delete the URL
    const { error: deleteError } = await supabase
      .from('short_urls')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error deleting URL:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete URL' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'URL deleted successfully',
    });

  } catch (error) {
    console.error('Error in /api/urls/[id] DELETE:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  try {
    const supabase = await createClient();

    // Get authenticated user (optional for GET)
    const { data: { user } } = await supabase.auth.getUser();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'URL ID is required' },
        { status: 400 }
      );
    }

    // Fetch URL details
    let query = supabase
      .from('short_urls')
      .select('*')
      .eq('id', id);

    // If user is authenticated, filter by user_id
    if (user) {
      query = query.eq('user_id', user.id);
    }

    const { data: url, error: fetchError } = await query.single();

    if (fetchError || !url) {
      return NextResponse.json(
        { error: 'URL not found' },
        { status: 404 }
      );
    }

    // Get base URL for constructing short URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
                    `${req.headers.get('x-forwarded-proto') || 'http'}://${req.headers.get('host')}`;

    return NextResponse.json({
      success: true,
      data: {
        id: url.id,
        shortCode: url.short_code,
        shortUrl: `${baseUrl}/r/${url.short_code}`,
        originalUrl: url.original_url,
        title: url.title,
        clickCount: url.click_count,
        lastClickedAt: url.last_clicked_at,
        createdAt: url.created_at,
        expiresAt: url.expires_at,
        isActive: url.is_active,
      },
    });

  } catch (error) {
    console.error('Error in /api/urls/[id] GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
