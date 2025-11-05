import { NextResponse } from 'next/server';
import { createClient } from '@/libs/supabase/server';

/**
 * GET /api/markdown/list
 * Get user's saved markdown conversions
 */
export async function GET(req) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Get user (required for this endpoint)
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Fetch user's conversions
    const { data: conversions, error: fetchError, count } = await supabase
      .from('markdown_conversions')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (fetchError) {
      console.error('Error fetching markdown conversions:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch conversions' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: conversions,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error in markdown list API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
