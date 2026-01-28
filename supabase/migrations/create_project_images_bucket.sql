-- Create storage bucket for project images
-- This bucket will store images uploaded through the Gallery Manager admin panel

-- Create the project-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-images',
  'project-images',
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- Enable Row Level Security
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to allow re-running the script)
DROP POLICY IF EXISTS "Public Access for Project Images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload project images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update project images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete project images" ON storage.objects;

-- Policy: Public read access for all images in project-images bucket
CREATE POLICY "Public Access for Project Images" 
ON storage.objects
FOR SELECT
USING (bucket_id = 'project-images');

-- Policy: Authenticated users can upload images
CREATE POLICY "Authenticated users can upload project images" 
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'project-images' AND auth.role() = 'authenticated');

-- Policy: Authenticated users can update their uploaded images
CREATE POLICY "Authenticated users can update project images" 
ON storage.objects
FOR UPDATE
USING (bucket_id = 'project-images' AND auth.role() = 'authenticated');

-- Policy: Authenticated users can delete images
CREATE POLICY "Authenticated users can delete project images" 
ON storage.objects
FOR DELETE
USING (bucket_id = 'project-images' AND auth.role() = 'authenticated');
