-- Migration: Add content_type column to qr_codes table
-- This enables support for different QR code content types (URL, plain text, etc.)

-- Add content_type column (defaults to 'url' for existing records)
ALTER TABLE qr_codes
ADD COLUMN content_type VARCHAR(20) DEFAULT 'url' NOT NULL;

-- Create index for filtering by content type
CREATE INDEX idx_qr_codes_content_type ON qr_codes(content_type);

-- Add comment for documentation
COMMENT ON COLUMN qr_codes.content_type IS 'Type of content in the QR code (url, text, email, phone, wifi, etc.)';

-- Update existing records to have 'url' content type
UPDATE qr_codes SET content_type = 'url';
