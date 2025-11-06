-- Add storage_path and download_count to markdown_conversions
ALTER TABLE markdown_conversions
ADD COLUMN IF NOT EXISTS storage_path TEXT,
ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_downloaded_at TIMESTAMPTZ;

-- Create index on storage_path for lookups
CREATE INDEX IF NOT EXISTS idx_markdown_conversions_storage_path ON markdown_conversions(storage_path);

-- Function to increment download count
CREATE OR REPLACE FUNCTION increment_markdown_download_count(markdown_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE markdown_conversions
  SET download_count = download_count + 1,
      last_downloaded_at = NOW()
  WHERE id = markdown_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
