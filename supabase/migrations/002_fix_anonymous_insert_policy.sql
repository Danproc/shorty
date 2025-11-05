-- Fix RLS policy to properly allow anonymous user inserts
-- The issue: When both auth.uid() and user_id are NULL, the check "auth.uid() = user_id"
-- returns NULL (not TRUE) in SQL, which fails the policy check

-- Drop the existing policy
DROP POLICY IF EXISTS "Users can insert their own URLs" ON short_urls;

-- Create updated policy that explicitly handles anonymous users
CREATE POLICY "Users can insert their own URLs"
  ON short_urls
  FOR INSERT
  WITH CHECK (
    -- Allow authenticated users to insert with their own user_id
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR
    -- Allow anonymous users to insert with NULL user_id
    (auth.uid() IS NULL AND user_id IS NULL)
  );
