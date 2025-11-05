-- Create markdown_conversions table for standalone markdown to HTML converter
CREATE TABLE IF NOT EXISTS markdown_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  markdown_content TEXT NOT NULL,
  html_content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_public BOOLEAN DEFAULT false
);

-- Create index on user_id for listing user's conversions
CREATE INDEX IF NOT EXISTS idx_markdown_conversions_user_id ON markdown_conversions(user_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_markdown_conversions_created_at ON markdown_conversions(created_at DESC);

-- Create index on is_public for filtering public conversions
CREATE INDEX IF NOT EXISTS idx_markdown_conversions_is_public ON markdown_conversions(is_public);

-- Enable Row Level Security
ALTER TABLE markdown_conversions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read public conversions
CREATE POLICY "Anyone can read public conversions"
  ON markdown_conversions
  FOR SELECT
  USING (is_public = true);

-- Policy: Authenticated users can read their own conversions
CREATE POLICY "Users can read their own conversions"
  ON markdown_conversions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Authenticated users and anonymous users can insert conversions
CREATE POLICY "Anyone can insert conversions"
  ON markdown_conversions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Users can update their own conversions
CREATE POLICY "Users can update their own conversions"
  ON markdown_conversions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own conversions
CREATE POLICY "Users can delete their own conversions"
  ON markdown_conversions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_markdown_conversion_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_markdown_conversion_timestamp
  BEFORE UPDATE ON markdown_conversions
  FOR EACH ROW
  EXECUTE FUNCTION update_markdown_conversion_timestamp();
