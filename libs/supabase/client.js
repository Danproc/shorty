import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Get environment variables with fallbacks for build time
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // During build/export, return a dummy client if env vars are missing
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials not found. Using placeholder client.');
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
