-- Update meta_tags to use profile image for social media previews
-- This will set the og:image and twitter:image to use the profile card image

DO $$
DECLARE
    profile_image_url TEXT;
    current_meta jsonb;
BEGIN
    -- Get the profile image URL from site_settings
    SELECT value->>'imageUrl' 
    INTO profile_image_url
    FROM site_settings 
    WHERE key = 'profile_card';
    
    -- If profile image exists, update meta_tags
    IF profile_image_url IS NOT NULL AND profile_image_url != '' THEN
        -- Get current meta_tags
        SELECT value INTO current_meta FROM site_settings WHERE key = 'meta_tags';
        
        -- Update og:image and twitter:image
        current_meta := jsonb_set(
            COALESCE(current_meta, '{}'::jsonb),
            '{og,image}',
            to_jsonb(profile_image_url)
        );
        
        current_meta := jsonb_set(
            current_meta,
            '{twitter,image}',
            to_jsonb(profile_image_url)
        );
        
        -- Update or insert meta_tags
        INSERT INTO site_settings (key, value, updated_at)
        VALUES ('meta_tags', current_meta, NOW())
        ON CONFLICT (key) 
        DO UPDATE SET 
            value = current_meta,
            updated_at = NOW();
            
        RAISE NOTICE 'Updated meta tags with profile image: %', profile_image_url;
    ELSE
        RAISE NOTICE 'No profile image found in site_settings';
    END IF;
END $$;
