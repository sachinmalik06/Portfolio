-- Resume Hero Section CMS Database Schema
-- Run this SQL in your Supabase SQL Editor

-- 1. Resume Hero Table
CREATE TABLE IF NOT EXISTS resume_hero (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  social_links JSONB DEFAULT '[]'::jsonb,
  resume_url TEXT,
  professional_summary TEXT,
  summary_tags JSONB DEFAULT '[]'::jsonb,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resume_hero_active ON resume_hero(active);

-- Enable Row Level Security (RLS)
ALTER TABLE resume_hero ENABLE ROW LEVEL SECURITY;

-- Create policies (allow public read, authenticated write)
CREATE POLICY "Allow public read access" ON resume_hero FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON resume_hero FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON resume_hero FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete" ON resume_hero FOR DELETE USING (auth.role() = 'authenticated');

-- Add trigger for updated_at
CREATE TRIGGER update_resume_hero_updated_at BEFORE UPDATE ON resume_hero
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert seed data based on current Resume page hardcoded data
INSERT INTO resume_hero (
  name, 
  role, 
  bio, 
  email, 
  phone, 
  location, 
  social_links, 
  resume_url,
  professional_summary,
  summary_tags,
  active
)
VALUES (
  'Sachin Malik',
  'International Business Management Professional',
  'Internationally oriented and ambitious postgraduate student pursuing MSc in International Business Management at GISMA University, Berlin.',
  'sachinmalikofficial6@gmail.com',
  '+49 XXX XXX XXXX',
  'Berlin, Germany',
  '[
    {"platform": "LinkedIn", "url": "https://www.linkedin.com/in/sachinmalik6", "icon_name": "linkedin"},
    {"platform": "GitHub", "url": "https://github.com/sachinmalik06", "icon_name": "github"}
  ]'::jsonb,
  '',
  'Internationally oriented and ambitious postgraduate student pursuing MSc in International Business Management at GISMA University, Berlin. With 2+ years of hands-on experience in management and business operations, I bring a strong understanding of global business dynamics, strategic decision-making, and data-driven insights to drive organizational growth.',
  '["Business Analytics", "Strategic Planning", "Team Leadership", "Data-Driven", "International Business", "Process Optimization"]'::jsonb,
  true
);
