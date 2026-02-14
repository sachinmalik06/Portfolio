-- Migration to add credential_id and image_url to resume_certifications
ALTER TABLE public.resume_certifications 
ADD COLUMN IF NOT EXISTS credential_id TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update comments
COMMENT ON COLUMN public.resume_certifications.credential_id IS 'Unique identifier for the certification credential';
COMMENT ON COLUMN public.resume_certifications.image_url IS 'URL for the certification image/logo';
