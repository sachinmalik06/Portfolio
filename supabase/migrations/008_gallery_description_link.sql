-- Add description, detailed_description and link columns to gallery_items table
ALTER TABLE gallery_items 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS detailed_description TEXT,
ADD COLUMN IF NOT EXISTS link TEXT;

-- Add comments for documentation
COMMENT ON COLUMN gallery_items.description IS 'Short description text for the gallery item/project (visible by default)';
COMMENT ON COLUMN gallery_items.detailed_description IS 'Detailed description text shown when project is expanded';
COMMENT ON COLUMN gallery_items.link IS 'External link URL for the project';
