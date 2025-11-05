import { NextResponse } from 'next/server';
import { createClient } from '@/libs/supabase/server';

export async function GET(req) {
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

    // Get query parameters for pagination and sorting
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const offset = (page - 1) * limit;

    // Fetch user's shortened URLs
    const { data: urls, error: fetchError } = await supabase
      .from('short_urls')
      .select('*')
      .eq('user_id', user.id)
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);

    if (fetchError) {
      console.error('Error fetching URLs:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch URLs' },
        { status: 500 }
      );
    }

    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from('short_urls')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (countError) {
      console.error('Error counting URLs:', countError);
    }

    // Get base URL for constructing short URLs
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
                    `${req.headers.get('x-forwarded-proto') || 'http'}://${req.headers.get('host')}`;

    // Format URLs for response
    const formattedUrls = urls.map(url => ({
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
    }));

    return NextResponse.json({
      success: true,
      data: formattedUrls,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });

  } catch (error) {
    console.error('Error in /api/urls/list:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
