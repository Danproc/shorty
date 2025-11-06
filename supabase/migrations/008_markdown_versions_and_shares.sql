-- Create markdown_versions table for version history
CREATE TABLE IF NOT EXISTS markdown_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id UUID NOT NULL REFERENCES markdown_conversions(id) ON DELETE CASCADE,
  markdown_content TEXT NOT NULL,
  html_content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on file_id for listing file versions
CREATE INDEX IF NOT EXISTS idx_markdown_versions_file_id ON markdown_versions(file_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE markdown_versions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read versions of their own files
CREATE POLICY "Users can read their own file versions"
  ON markdown_versions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM markdown_conversions mc
      WHERE mc.id = markdown_versions.file_id
      AND mc.user_id = auth.uid()
    )
  );

-- Policy: Users can insert versions for their own files
CREATE POLICY "Users can insert versions for their own files"
  ON markdown_versions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM markdown_conversions mc
      WHERE mc.id = markdown_versions.file_id
      AND mc.user_id = auth.uid()
    )
  );

-- Policy: Users can delete versions of their own files
CREATE POLICY "Users can delete their own file versions"
  ON markdown_versions
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM markdown_conversions mc
      WHERE mc.id = markdown_versions.file_id
      AND mc.user_id = auth.uid()
    )
  );

-- Create markdown_shares table for public shareable links
CREATE TABLE IF NOT EXISTS markdown_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id UUID NOT NULL REFERENCES markdown_conversions(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT true,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_markdown_shares_slug ON markdown_shares(slug);

-- Create index on file_id
CREATE INDEX IF NOT EXISTS idx_markdown_shares_file_id ON markdown_shares(file_id);

-- Enable Row Level Security
ALTER TABLE markdown_shares ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read public shares
CREATE POLICY "Anyone can read public shares"
  ON markdown_shares
  FOR SELECT
  USING (is_public = true AND (expires_at IS NULL OR expires_at > NOW()));

-- Policy: Users can read shares of their own files
CREATE POLICY "Users can read their own file shares"
  ON markdown_shares
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM markdown_conversions mc
      WHERE mc.id = markdown_shares.file_id
      AND mc.user_id = auth.uid()
    )
  );

-- Policy: Users can create shares for their own files
CREATE POLICY "Users can create shares for their own files"
  ON markdown_shares
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM markdown_conversions mc
      WHERE mc.id = markdown_shares.file_id
      AND mc.user_id = auth.uid()
    )
  );

-- Policy: Users can update shares of their own files
CREATE POLICY "Users can update their own file shares"
  ON markdown_shares
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM markdown_conversions mc
      WHERE mc.id = markdown_shares.file_id
      AND mc.user_id = auth.uid()
    )
  );

-- Policy: Users can delete shares of their own files
CREATE POLICY "Users can delete their own file shares"
  ON markdown_shares
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM markdown_conversions mc
      WHERE mc.id = markdown_shares.file_id
      AND mc.user_id = auth.uid()
    )
  );

-- Function to increment share view count
CREATE OR REPLACE FUNCTION increment_share_view_count(share_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE markdown_shares
  SET view_count = view_count + 1
  WHERE slug = share_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add settings column to markdown_conversions for storing user preferences
ALTER TABLE markdown_conversions
ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}';
