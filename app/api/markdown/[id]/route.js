import { NextResponse } from 'next/server';
import { createClient } from '@/libs/supabase/server';

/**
 * GET /api/markdown/[id]
 * Get a specific markdown conversion by ID
 */
export async function GET(req, { params }) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Fetch the conversion
    const { data: conversion, error: fetchError } = await supabase
      .from('markdown_conversions')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !conversion) {
      return NextResponse.json(
        { error: 'Conversion not found' },
        { status: 404 }
      );
    }

    // Check if user has access (public or owner)
    const { data: { user } } = await supabase.auth.getUser();

    if (!conversion.is_public && conversion.user_id !== user?.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: conversion,
    });
  } catch (error) {
    console.error('Error in markdown get API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/markdown/[id]
 * Delete a markdown conversion
 */
export async function DELETE(req, { params }) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Get user (required)
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Delete the conversion (RLS will ensure user owns it)
    const { error: deleteError } = await supabase
      .from('markdown_conversions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error deleting markdown conversion:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete conversion' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Conversion deleted successfully',
    });
  } catch (error) {
    console.error('Error in markdown delete API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
