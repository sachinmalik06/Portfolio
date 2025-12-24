-- Add profile card image to site settings
-- This allows admins to update the profile card image from the CMS

INSERT INTO public.site_settings (key, value)
VALUES (
  'profile_card',
  '{
    "cardImageUrl": ""
  }'::jsonb
)
ON CONFLICT (key) DO UPDATE 
SET value = COALESCE(
  jsonb_build_object(
    'cardImageUrl', COALESCE((public.site_settings.value->>'cardImageUrl'), '')
  ),
  EXCLUDED.value
);

