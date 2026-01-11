-- Add styling columns to timeline_entries table
ALTER TABLE timeline_entries
ADD COLUMN IF NOT EXISTS year_styles jsonb DEFAULT '{"fontSize": "base", "fontWeight": "normal", "color": ""}',
ADD COLUMN IF NOT EXISTS title_styles jsonb DEFAULT '{"fontSize": "lg", "fontWeight": "bold", "color": ""}',
ADD COLUMN IF NOT EXISTS content_styles jsonb DEFAULT '{"fontSize": "base", "fontWeight": "normal", "color": ""}';

-- Update existing entries to have default styling
UPDATE timeline_entries
SET 
  year_styles = '{"fontSize": "base", "fontWeight": "normal", "color": ""}',
  title_styles = '{"fontSize": "lg", "fontWeight": "bold", "color": ""}',
  content_styles = '{"fontSize": "base", "fontWeight": "normal", "color": ""}'
WHERE year_styles IS NULL OR title_styles IS NULL OR content_styles IS NULL;
