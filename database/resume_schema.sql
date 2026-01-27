-- Resume CMS Database Schema
-- Run this SQL in your Supabase SQL Editor

-- 1. Resume Experiences Table
CREATE TABLE IF NOT EXISTS resume_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  location TEXT,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  achievements JSONB DEFAULT '[]'::jsonb,
  technologies JSONB DEFAULT '[]'::jsonb,
  "order" INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Resume Projects Table
CREATE TABLE IF NOT EXISTS resume_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  technologies JSONB DEFAULT '[]'::jsonb,
  impact TEXT,
  icon_name TEXT DEFAULT 'Folder',
  "order" INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Resume Education Table
CREATE TABLE IF NOT EXISTS resume_education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  location TEXT,
  start_year TEXT NOT NULL,
  end_year TEXT,
  gpa TEXT,
  highlights JSONB DEFAULT '[]'::jsonb,
  coursework JSONB DEFAULT '[]'::jsonb,
  "order" INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Resume Skills Table
CREATE TABLE IF NOT EXISTS resume_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  proficiency INTEGER DEFAULT 50 CHECK (proficiency >= 0 AND proficiency <= 100),
  "order" INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Resume Certifications Table
CREATE TABLE IF NOT EXISTS resume_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  year TEXT NOT NULL,
  description TEXT,
  credential_url TEXT,
  "order" INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Resume Languages Table
CREATE TABLE IF NOT EXISTS resume_languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  level TEXT NOT NULL,
  proficiency INTEGER DEFAULT 50 CHECK (proficiency >= 0 AND proficiency <= 100),
  "order" INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Resume Stats Table
CREATE TABLE IF NOT EXISTS resume_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value INTEGER NOT NULL,
  suffix TEXT DEFAULT '',
  icon_name TEXT DEFAULT 'BarChart3',
  color TEXT DEFAULT 'text-primary',
  "order" INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resume_experiences_order ON resume_experiences("order");
CREATE INDEX IF NOT EXISTS idx_resume_experiences_active ON resume_experiences(active);
CREATE INDEX IF NOT EXISTS idx_resume_projects_order ON resume_projects("order");
CREATE INDEX IF NOT EXISTS idx_resume_projects_active ON resume_projects(active);
CREATE INDEX IF NOT EXISTS idx_resume_education_order ON resume_education("order");
CREATE INDEX IF NOT EXISTS idx_resume_education_active ON resume_education(active);
CREATE INDEX IF NOT EXISTS idx_resume_skills_order ON resume_skills("order");
CREATE INDEX IF NOT EXISTS idx_resume_skills_active ON resume_skills(active);
CREATE INDEX IF NOT EXISTS idx_resume_skills_category ON resume_skills(category);
CREATE INDEX IF NOT EXISTS idx_resume_certifications_order ON resume_certifications("order");
CREATE INDEX IF NOT EXISTS idx_resume_certifications_active ON resume_certifications(active);
CREATE INDEX IF NOT EXISTS idx_resume_languages_order ON resume_languages("order");
CREATE INDEX IF NOT EXISTS idx_resume_languages_active ON resume_languages(active);
CREATE INDEX IF NOT EXISTS idx_resume_stats_order ON resume_stats("order");
CREATE INDEX IF NOT EXISTS idx_resume_stats_active ON resume_stats(active);

-- Enable Row Level Security (RLS)
ALTER TABLE resume_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_stats ENABLE ROW LEVEL SECURITY;

-- Create policies (allow public read, authenticated write)
-- Experiences
CREATE POLICY "Allow public read access" ON resume_experiences FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON resume_experiences FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON resume_experiences FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete" ON resume_experiences FOR DELETE USING (auth.role() = 'authenticated');

-- Projects
CREATE POLICY "Allow public read access" ON resume_projects FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON resume_projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON resume_projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete" ON resume_projects FOR DELETE USING (auth.role() = 'authenticated');

-- Education
CREATE POLICY "Allow public read access" ON resume_education FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON resume_education FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON resume_education FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete" ON resume_education FOR DELETE USING (auth.role() = 'authenticated');

-- Skills
CREATE POLICY "Allow public read access" ON resume_skills FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON resume_skills FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON resume_skills FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete" ON resume_skills FOR DELETE USING (auth.role() = 'authenticated');

-- Certifications
CREATE POLICY "Allow public read access" ON resume_certifications FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON resume_certifications FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON resume_certifications FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete" ON resume_certifications FOR DELETE USING (auth.role() = 'authenticated');

-- Languages
CREATE POLICY "Allow public read access" ON resume_languages FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON resume_languages FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON resume_languages FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete" ON resume_languages FOR DELETE USING (auth.role() = 'authenticated');

-- Stats
CREATE POLICY "Allow public read access" ON resume_stats FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON resume_stats FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON resume_stats FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete" ON resume_stats FOR DELETE USING (auth.role() = 'authenticated');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_resume_experiences_updated_at BEFORE UPDATE ON resume_experiences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resume_projects_updated_at BEFORE UPDATE ON resume_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resume_education_updated_at BEFORE UPDATE ON resume_education
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resume_skills_updated_at BEFORE UPDATE ON resume_skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resume_certifications_updated_at BEFORE UPDATE ON resume_certifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resume_languages_updated_at BEFORE UPDATE ON resume_languages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resume_stats_updated_at BEFORE UPDATE ON resume_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert seed data based on current Resume page mock data

-- Experiences
INSERT INTO resume_experiences (company, position, location, description, start_date, end_date, is_current, achievements, technologies, "order", active)
VALUES 
  ('Dainik Bhaskar', 'Senior Management Associate', 'Panipat, India', 
   'Led cross-functional teams and drove strategic initiatives to enhance operational efficiency and market penetration.',
   '2022-01-01', '2023-09-01', false,
   '["Increased operational efficiency by 25% through process optimization", "Managed a team of 10+ professionals across multiple departments", "Developed data-driven strategies that improved market reach by 30%", "Implemented business intelligence tools reducing reporting time by 40%"]'::jsonb,
   '["Power BI", "Excel", "Data Analysis", "Strategic Planning"]'::jsonb,
   1, true),
  ('Freelance Consulting', 'Business Analyst & Consultant', 'Remote',
   'Provided strategic business consulting and data analysis services to SMEs and startups.',
   '2021-06-01', '2021-12-31', false,
   '["Consulted for 8+ clients across various industries", "Delivered actionable insights that increased revenue by average 20%", "Created comprehensive business plans and financial models", "Conducted market research and competitive analysis"]'::jsonb,
   '["Market Research", "Financial Modeling", "Business Strategy"]'::jsonb,
   2, true);

-- Projects
INSERT INTO resume_projects (title, description, technologies, impact, icon_name, "order", active)
VALUES
  ('Business Intelligence Dashboard', 'Developed comprehensive BI dashboard for real-time business metrics tracking and visualization',
   '["Power BI", "Excel", "Data Analytics"]'::jsonb, 'Reduced decision-making time by 50%', 'BarChart3', 1, true),
  ('Market Expansion Strategy', 'Created data-driven market expansion plan for entering new geographical markets',
   '["Market Research", "Strategic Planning", "Data Analysis"]'::jsonb, 'Identified 3 high-potential markets with 40% growth opportunity', 'Target', 2, true),
  ('Operational Efficiency Program', 'Designed and implemented process optimization framework across departments',
   '["Process Mapping", "Lean Management", "KPI Tracking"]'::jsonb, 'Achieved 25% cost reduction and 30% time savings', 'Zap', 3, true),
  ('Financial Planning System', 'Built comprehensive financial planning and budgeting system for SME clients',
   '["Financial Modeling", "Excel", "Forecasting"]'::jsonb, 'Improved budget accuracy by 35%', 'TrendingUp', 4, true);

-- Education
INSERT INTO resume_education (degree, institution, location, start_year, end_year, gpa, highlights, coursework, "order", active)
VALUES
  ('MSc International Business Management', 'GISMA University of Applied Sciences', 'Potsdam Campus, Berlin',
   '2024', '', '',
   '["Current", "Global Business", "Strategic Management", "International Markets"]'::jsonb,
   '["Global Strategy", "International Marketing", "Cross-Cultural Management", "Business Analytics"]'::jsonb,
   1, true),
  ('Master of Commerce (M.Com)', 'Kurukshetra University', 'India',
   '2021', '2023', 'First Division',
   '["Commerce", "Business Studies", "Finance"]'::jsonb,
   '["Advanced Accounting", "Financial Management", "Business Economics"]'::jsonb,
   2, true),
  ('Bachelor of Commerce (B.Com)', 'Kurukshetra University', 'India',
   '2016', '2019', 'First Division',
   '["Commerce", "Accounting", "Economics"]'::jsonb,
   '["Financial Accounting", "Business Law", "Economics", "Statistics"]'::jsonb,
   3, true);

-- Skills
INSERT INTO resume_skills (name, category, proficiency, "order", active)
VALUES
  ('Microsoft 365', 'Technical Skills', 90, 1, true),
  ('Power BI', 'Technical Skills', 85, 2, true),
  ('Data Analysis', 'Technical Skills', 88, 3, true),
  ('Excel (Advanced)', 'Technical Skills', 92, 4, true),
  ('Business Intelligence', 'Technical Skills', 85, 5, true),
  ('SQL', 'Technical Skills', 75, 6, true),
  ('Tableau', 'Technical Skills', 70, 7, true),
  ('Strategic Planning', 'Business Skills', 90, 8, true),
  ('Financial Planning', 'Business Skills', 85, 9, true),
  ('Team Leadership', 'Business Skills', 88, 10, true),
  ('Project Management', 'Business Skills', 87, 11, true),
  ('Cross-functional Collaboration', 'Business Skills', 90, 12, true),
  ('Operational Optimization', 'Business Skills', 87, 13, true),
  ('Market Research', 'Business Skills', 83, 14, true),
  ('Communication', 'Soft Skills', 92, 15, true),
  ('Problem Solving', 'Soft Skills', 90, 16, true),
  ('Critical Thinking', 'Soft Skills', 88, 17, true),
  ('Adaptability', 'Soft Skills', 90, 18, true);

-- Certifications
INSERT INTO resume_certifications (name, issuer, year, description, credential_url, "order", active)
VALUES
  ('Business Analytics Certificate', 'Google', '2023', 'Data analysis, visualization, and business intelligence', '', 1, true),
  ('Project Management Professional (PMP)', 'PMI', '2022', 'Project planning, execution, and stakeholder management', '', 2, true),
  ('Digital Marketing Certification', 'HubSpot', '2023', 'SEO, content marketing, and digital strategy', '', 3, true),
  ('Financial Modeling & Valuation', 'Corporate Finance Institute', '2022', 'Advanced financial modeling and business valuation', '', 4, true),
  ('Data Analytics Professional', 'IBM', '2023', 'Data analysis, Python, and statistical methods', '', 5, true),
  ('Lean Six Sigma Green Belt', 'ASQ', '2022', 'Process improvement and quality management', '', 6, true);

-- Languages
INSERT INTO resume_languages (name, level, proficiency, "order", active)
VALUES
  ('Hindi', 'Native', 100, 1, true),
  ('English', 'Proficient (C1)', 90, 2, true),
  ('German', 'Basic (A1)', 30, 3, true);

-- Stats
INSERT INTO resume_stats (label, value, suffix, icon_name, color, "order", active)
VALUES
  ('Years Experience', 2, '+', 'Briefcase', 'text-blue-500', 1, true),
  ('Projects Completed', 15, '+', 'Rocket', 'text-green-500', 2, true),
  ('Certifications', 6, '', 'Award', 'text-purple-500', 3, true),
  ('Success Rate', 95, '%', 'TrendingUp', 'text-primary', 4, true);
