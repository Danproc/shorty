import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function updateSession(request) {
  // Skip auth refresh for API routes that don't need authentication
  const { pathname } = request.nextUrl;
  const skipAuthRoutes = ['/api/webhook', '/api/lead'];

  if (skipAuthRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next({
      request,
    });
  }

  // Check if Supabase environment variables are configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // If Supabase is not configured, just pass through the request
    console.warn('Supabase environment variables not configured. Skipping auth middleware.');
    return NextResponse.next({
      request,
    });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // refreshing the auth token
    await supabase.auth.getUser();
  } catch (error) {
    // Log error but don't crash the middleware
    console.error('Error in auth middleware:', error);
  }

  return supabaseResponse;
}
