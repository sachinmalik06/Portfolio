-- Function to sync email changes from public.users to auth.users
-- This function runs with SECURITY DEFINER to have permission to update auth.users
CREATE OR REPLACE FUNCTION public.sync_auth_email_on_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if the email has actually changed
  IF NEW.email IS DISTINCT FROM OLD.email THEN
    -- Update the auth.users table directly
    -- We set email_confirmed_at to NOW() to skip confirmation
    -- We also clear all email change tracking fields to prevent Supabase from sending confirmation emails
    UPDATE auth.users
    SET 
      email = NEW.email,
      email_confirmed_at = NOW(),
      updated_at = NOW(),
      -- Sync name to metadata as well
      raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{full_name}', to_jsonb(NEW.name)),
      -- Clear tracking fields to bypass Supabase internal confirmation flow
      email_change = NULL,
      new_email = NULL,
      email_change_token_new = NULL,
      email_change_sent_at = NULL,
      email_change_confirm_status = 0
    WHERE id = NEW.id;

    -- Update the identities table so logins work with the new email
    -- We update the identity_data JSONB field. We use COALESCE to handle potential NULLs.
    UPDATE auth.identities
    SET 
      identity_data = jsonb_set(COALESCE(identity_data, '{}'::jsonb), '{email}', to_jsonb(NEW.email)),
      updated_at = NOW()
    WHERE user_id = NEW.id AND provider = 'email';
    
    -- In some Supabase versions, identities also have a direct email column
    -- We use a dynamic approach to handle this if it exists
    BEGIN
      EXECUTE 'UPDATE auth.identities SET email = $1 WHERE user_id = $2 AND provider = ''email''' 
      USING NEW.email, NEW.id;
    EXCEPTION WHEN OTHERS THEN
      -- Ignore errors (likely means column doesn't exist or table structure is different)
      NULL;
    END;
  END IF;

  -- Sync name if changed (even if email didn't)
  IF NEW.name IS DISTINCT FROM OLD.name AND (NEW.email IS NOT DISTINCT FROM OLD.email) THEN
     UPDATE auth.users
     SET 
       raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{full_name}', to_jsonb(NEW.name)),
       updated_at = NOW()
     WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

-- Trigger to call the sync function when public.users is updated
DROP TRIGGER IF EXISTS on_public_user_email_update ON public.users;
CREATE TRIGGER on_public_user_sync
  AFTER UPDATE OF email, name ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_auth_email_on_update();

-- Add RLS policy to allow users to update their own profile (essential for email changes)
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
CREATE POLICY "Users can update their own data"
  ON public.users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

