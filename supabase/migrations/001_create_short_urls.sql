-- Create short_urls table for URL shortener functionality
CREATE TABLE IF NOT EXISTS short_urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  title VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  click_count INTEGER DEFAULT 0,
  last_clicked_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);

-- Create index on short_code for fast lookups
CREATE INDEX IF NOT EXISTS idx_short_urls_short_code ON short_urls(short_code);

-- Create index on user_id for user's URL list
CREATE INDEX IF NOT EXISTS idx_short_urls_user_id ON short_urls(user_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_short_urls_created_at ON short_urls(created_at DESC);

-- Enable Row Level Security
ALTER TABLE short_urls ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active short URLs (for redirect)
CREATE POLICY "Anyone can read active short URLs"
  ON short_urls
  FOR SELECT
  USING (is_active = true);

-- Policy: Authenticated users can insert their own URLs
CREATE POLICY "Users can insert their own URLs"
  ON short_urls
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Users can update their own URLs
CREATE POLICY "Users can update their own URLs"
  ON short_urls
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own URLs
CREATE POLICY "Users can delete their own URLs"
  ON short_urls
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to increment click count
CREATE OR REPLACE FUNCTION increment_click_count(short_code_param VARCHAR)
RETURNS void AS $$
BEGIN
  UPDATE short_urls
  SET click_count = click_count + 1,
      last_clicked_at = NOW()
  WHERE short_code = short_code_param
    AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
