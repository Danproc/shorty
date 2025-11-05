import { NextResponse } from 'next/server';
import { markdownToHtml, validateMarkdown } from '@/libs/markdown';

/**
 * POST /api/markdown/convert
 * Convert markdown to sanitized HTML
 */
export async function POST(req) {
  try {
    const { markdown } = await req.json();

    // Validate markdown input
    const validation = validateMarkdown(markdown);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Convert markdown to HTML
    const html = markdownToHtml(markdown);

    return NextResponse.json({
      html,
      markdown,
      success: true,
    });
  } catch (error) {
    console.error('Error in markdown conversion API:', error);
    return NextResponse.json(
      { error: 'Failed to convert markdown' },
      { status: 500 }
    );
  }
}
