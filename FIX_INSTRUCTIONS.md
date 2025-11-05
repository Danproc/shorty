# Fix for URL Shortener 500 Error

## Problem
When trying to create a shortened URL, you're getting a **500 Internal Server Error**. This is caused by a Row Level Security (RLS) policy issue in the Supabase database.

## Root Cause
The INSERT policy on the `short_urls` table has a flaw when handling anonymous users (users who are not logged in):

```sql
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
```

When both `auth.uid()` and `user_id` are `NULL` (anonymous user case), the SQL expression `NULL = NULL` returns `NULL`/`UNKNOWN` rather than `TRUE`, which causes the policy check to fail.

## Solution
A new migration file has been created to fix this issue: `supabase/migrations/002_fix_anonymous_insert_policy.sql`

This migration updates the policy to explicitly handle both authenticated and anonymous users:

```sql
WITH CHECK (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR
  (auth.uid() IS NULL AND user_id IS NULL)
);
```

## How to Apply the Fix

### Option 1: Using Supabase CLI (Recommended)

1. Make sure you have the Supabase CLI installed:
   ```bash
   npm install -g supabase
   ```

2. Link your project (if not already linked):
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

3. Push the migration to your database:
   ```bash
   supabase db push
   ```

### Option 2: Using Supabase Dashboard (SQL Editor)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/002_fix_anonymous_insert_policy.sql`
4. Paste it into a new query
5. Click **Run** to execute the migration

### Option 3: Manual SQL Execution

Connect to your Supabase database and run:

```sql
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
```

## Verification

After applying the fix:

1. Restart your Next.js development server (if running)
2. Try creating a shortened URL again
3. The error should be resolved, and you should see a success message

## Additional Notes

- This fix maintains the security model where:
  - Authenticated users can only create URLs associated with their user ID
  - Anonymous users can only create URLs with no user ID
- No existing data is affected by this change
- The fix only modifies the RLS policy, not the table structure
