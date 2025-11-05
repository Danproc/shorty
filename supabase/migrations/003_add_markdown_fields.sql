-- Add markdown and HTML fields to short_urls table
ALTER TABLE short_urls
ADD COLUMN markdown_content TEXT,
ADD COLUMN html_content TEXT;

-- Add index on markdown_content for full-text search (optional)
CREATE INDEX IF NOT EXISTS idx_short_urls_markdown_content ON short_urls USING gin(to_tsvector('english', markdown_content));
