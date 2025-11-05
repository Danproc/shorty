import { NextResponse } from 'next/server';
import { createClient } from '@/libs/supabase/server';
import { markdownToHtml, validateMarkdown } from '@/libs/markdown';

/**
 * POST /api/markdown/save
 * Save a markdown conversion to the database
 */
export async function POST(req) {
  try {
    const supabase = await createClient();
    const { markdown, title, isPublic } = await req.json();

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

    // Get user (optional - anonymous users allowed)
    const { data: { user } } = await supabase.auth.getUser();

    // Save to database
    const { data: conversion, error: insertError } = await supabase
      .from('markdown_conversions')
      .insert([
        {
          user_id: user?.id || null,
          title: title || null,
          markdown_content: markdown,
          html_content: html,
          is_public: isPublic || false,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Error saving markdown conversion:', insertError);
      return NextResponse.json(
        { error: 'Failed to save conversion' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: conversion.id,
        title: conversion.title,
        markdown: conversion.markdown_content,
        html: conversion.html_content,
        isPublic: conversion.is_public,
        createdAt: conversion.created_at,
      },
    });
  } catch (error) {
    console.error('Error in markdown save API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
