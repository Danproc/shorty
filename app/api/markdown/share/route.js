import { NextResponse } from 'next/server';
import { createClient } from '@/libs/supabase/server';
import { nanoid } from 'nanoid';

/**
 * POST /api/markdown/share
 * Create a shareable link for a markdown file
 */
export async function POST(req) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { file_id } = await req.json();

    if (!file_id) {
      return NextResponse.json({ error: 'file_id is required' }, { status: 400 });
    }

    // Verify the file belongs to the user
    const { data: file, error: fileError } = await supabase
      .from('markdown_conversions')
      .select('id')
      .eq('id', file_id)
      .eq('user_id', user.id)
      .single();

    if (fileError || !file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Check if share already exists
    const { data: existingShare } = await supabase
      .from('markdown_shares')
      .select('slug')
      .eq('file_id', file_id)
      .single();

    if (existingShare) {
      return NextResponse.json({
        success: true,
        slug: existingShare.slug,
        url: `/shared/${existingShare.slug}`,
      });
    }

    // Generate unique slug
    const slug = nanoid(10);

    // Create share
    const { data: share, error: shareError } = await supabase
      .from('markdown_shares')
      .insert({
        file_id,
        slug,
        is_public: true,
      })
      .select()
      .single();

    if (shareError) {
      console.error('Error creating share:', shareError);
      return NextResponse.json(
        { error: 'Failed to create share link' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      slug: share.slug,
      url: `/shared/${share.slug}`,
    });
  } catch (error) {
    console.error('Error in share API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/markdown/share?slug=xxx
 * Get share information by slug
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get share with file data
    const { data: share, error: shareError } = await supabase
      .from('markdown_shares')
      .select(`
        *,
        markdown_conversions (
          id,
          title,
          markdown_content,
          html_content,
          settings,
          created_at,
          updated_at
        )
      `)
      .eq('slug', slug)
      .eq('is_public', true)
      .single();

    if (shareError || !share) {
      return NextResponse.json({ error: 'Share not found' }, { status: 404 });
    }

    // Increment view count
    await supabase.rpc('increment_share_view_count', { share_slug: slug });

    return NextResponse.json({
      success: true,
      share: {
        slug: share.slug,
        created_at: share.created_at,
        view_count: share.view_count + 1, // Include the increment
        file: share.markdown_conversions,
      },
    });
  } catch (error) {
    console.error('Error in share GET API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
