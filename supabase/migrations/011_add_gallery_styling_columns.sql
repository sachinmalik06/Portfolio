-- Add styling columns to gallery_items table
ALTER TABLE gallery_items
ADD COLUMN IF NOT EXISTS title_styles jsonb DEFAULT '{"fontSize": "lg", "fontWeight": "bold", "color": ""}',
ADD COLUMN IF NOT EXISTS description_styles jsonb DEFAULT '{"fontSize": "base", "fontWeight": "normal", "color": ""}',
ADD COLUMN IF NOT EXISTS detailed_description_styles jsonb DEFAULT '{"fontSize": "base", "fontWeight": "normal", "color": ""}';

-- Update existing entries to have default styling
UPDATE gallery_items
SET 
  title_styles = '{"fontSize": "lg", "fontWeight": "bold", "color": ""}',
  description_styles = '{"fontSize": "base", "fontWeight": "normal", "color": ""}',
  detailed_description_styles = '{"fontSize": "base", "fontWeight": "normal", "color": ""}'
WHERE title_styles IS NULL OR description_styles IS NULL OR detailed_description_styles IS NULL;
