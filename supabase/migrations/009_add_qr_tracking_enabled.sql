-- Migration: Add tracking_enabled column to qr_codes table
-- This enables users to opt-in to scan tracking (premium feature)

-- Add tracking_enabled column (defaults to false for existing records)
ALTER TABLE qr_codes
ADD COLUMN tracking_enabled BOOLEAN DEFAULT false NOT NULL;

-- Create index for filtering by tracking status
CREATE INDEX idx_qr_codes_tracking_enabled ON qr_codes(tracking_enabled);

-- Add comment for documentation
COMMENT ON COLUMN qr_codes.tracking_enabled IS 'Whether scan tracking is enabled for this QR code (premium feature)';
