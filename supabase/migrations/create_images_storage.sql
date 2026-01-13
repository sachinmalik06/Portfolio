-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to images bucket
CREATE POLICY "Public Access for Images" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'images');

-- Policy: Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'images' 
    AND auth.role() = 'authenticated'
  );

-- Policy: Allow authenticated users to update their own images
CREATE POLICY "Authenticated users can update images" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'images' 
    AND auth.role() = 'authenticated'
  );

-- Policy: Allow authenticated users to delete their own images
CREATE POLICY "Authenticated users can delete images" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'images' 
    AND auth.role() = 'authenticated'
  );
