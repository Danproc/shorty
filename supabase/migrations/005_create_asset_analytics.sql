-- Create asset_analytics table to track all interactions with assets
CREATE TABLE IF NOT EXISTS asset_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Asset identification
  asset_type VARCHAR(20) NOT NULL CHECK (asset_type IN ('short_url', 'qr_code', 'markdown')),
  asset_id UUID NOT NULL,

  -- Event information
  event_type VARCHAR(50) NOT NULL, -- 'visit', 'scan', 'download', 'view'
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Request metadata (no PII)
  referer TEXT,
  user_agent_hash VARCHAR(64), -- Hashed user agent for privacy
  country_code VARCHAR(2),
  city VARCHAR(100),

  -- Session tracking (for unique visitor calculation)
  session_id VARCHAR(64),

  -- Additional metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_asset_analytics_asset ON asset_analytics(asset_type, asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_analytics_created_at ON asset_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_asset_analytics_session ON asset_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_asset_analytics_composite ON asset_analytics(asset_type, asset_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE asset_analytics ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can insert analytics (server-side only)
CREATE POLICY "Service role can insert analytics"
  ON asset_analytics
  FOR INSERT
  WITH CHECK (true);

-- Policy: Users can read analytics for their own assets
CREATE POLICY "Users can read their asset analytics"
  ON asset_analytics
  FOR SELECT
  USING (
    CASE asset_type
      WHEN 'short_url' THEN
        EXISTS (
          SELECT 1 FROM short_urls
          WHERE short_urls.id = asset_analytics.asset_id
          AND short_urls.user_id = auth.uid()
        )
      WHEN 'qr_code' THEN
        EXISTS (
          SELECT 1 FROM qr_codes
          WHERE qr_codes.id = asset_analytics.asset_id
          AND qr_codes.user_id = auth.uid()
        )
      WHEN 'markdown' THEN
        EXISTS (
          SELECT 1 FROM markdown_conversions
          WHERE markdown_conversions.id = asset_analytics.asset_id
          AND markdown_conversions.user_id = auth.uid()
        )
      ELSE false
    END
  );

-- Helper function to record an analytics event
CREATE OR REPLACE FUNCTION record_asset_event(
  p_asset_type VARCHAR,
  p_asset_id UUID,
  p_event_type VARCHAR,
  p_referer TEXT DEFAULT NULL,
  p_user_agent_hash VARCHAR DEFAULT NULL,
  p_country_code VARCHAR DEFAULT NULL,
  p_city VARCHAR DEFAULT NULL,
  p_session_id VARCHAR DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO asset_analytics (
    asset_type,
    asset_id,
    event_type,
    referer,
    user_agent_hash,
    country_code,
    city,
    session_id,
    metadata
  ) VALUES (
    p_asset_type,
    p_asset_id,
    p_event_type,
    p_referer,
    p_user_agent_hash,
    p_country_code,
    p_city,
    p_session_id,
    p_metadata
  )
  RETURNING id INTO event_id;

  RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a view for dashboard analytics summary
CREATE OR REPLACE VIEW asset_analytics_summary AS
SELECT
  asset_type,
  asset_id,
  COUNT(*) as total_events,
  COUNT(DISTINCT session_id) as unique_visitors,
  MIN(created_at) as first_event,
  MAX(created_at) as last_event,
  COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as events_last_7_days,
  COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as events_last_30_days
FROM asset_analytics
GROUP BY asset_type, asset_id;

-- Grant access to the view
GRANT SELECT ON asset_analytics_summary TO authenticated;
