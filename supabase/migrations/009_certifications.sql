-- Create certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT,
  credential_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments for documentation
COMMENT ON TABLE certifications IS 'Professional certifications and achievements';
COMMENT ON COLUMN certifications.title IS 'Certification or achievement title';
COMMENT ON COLUMN certifications.issuer IS 'Issuing organization or institution';
COMMENT ON COLUMN certifications.date IS 'Year or date of certification';
COMMENT ON COLUMN certifications.description IS 'Brief description of the certification';
COMMENT ON COLUMN certifications.credential_url IS 'Link to certificate verification or credential';
COMMENT ON COLUMN certifications.order_index IS 'Display order';
COMMENT ON COLUMN certifications.is_active IS 'Whether to show on website';

-- Enable Row Level Security
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- Public read access for active certifications
CREATE POLICY "Public can view active certifications"
  ON certifications
  FOR SELECT
  TO public
  USING (is_active = true);

-- Authenticated users (admins) can manage certifications
CREATE POLICY "Authenticated users can insert certifications"
  ON certifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update certifications"
  ON certifications
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete certifications"
  ON certifications
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_certifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER certifications_updated_at
  BEFORE UPDATE ON certifications
  FOR EACH ROW
  EXECUTE FUNCTION update_certifications_updated_at();
