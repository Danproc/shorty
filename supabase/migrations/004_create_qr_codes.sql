-- Create qr_codes table for QR code generator functionality
CREATE TABLE IF NOT EXISTS qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  qr_code VARCHAR(10) UNIQUE NOT NULL,
  target_url TEXT NOT NULL,
  title VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  scan_count INTEGER DEFAULT 0,
  last_scanned_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  -- Store QR code styling preferences
  qr_style JSONB DEFAULT '{}'::jsonb
);

-- Create index on qr_code for fast lookups
CREATE INDEX IF NOT EXISTS idx_qr_codes_qr_code ON qr_codes(qr_code);

-- Create index on user_id for user's QR code list
CREATE INDEX IF NOT EXISTS idx_qr_codes_user_id ON qr_codes(user_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_qr_codes_created_at ON qr_codes(created_at DESC);

-- Enable Row Level Security
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active QR codes (for scanning)
CREATE POLICY "Anyone can read active QR codes"
  ON qr_codes
  FOR SELECT
  USING (is_active = true);

-- Policy: Authenticated users can insert their own QR codes
CREATE POLICY "Users can insert their own QR codes"
  ON qr_codes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Users can update their own QR codes
CREATE POLICY "Users can update their own QR codes"
  ON qr_codes
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own QR codes
CREATE POLICY "Users can delete their own QR codes"
  ON qr_codes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to increment scan count
CREATE OR REPLACE FUNCTION increment_qr_scan_count(qr_code_param VARCHAR)
RETURNS void AS $$
BEGIN
  UPDATE qr_codes
  SET scan_count = scan_count + 1,
      last_scanned_at = NOW()
  WHERE qr_code = qr_code_param
    AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
