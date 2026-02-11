-- Migration to sync auth.users metadata changes back to public.users
-- This ensures that when auth.updateUser is called with metadata, the public profile stays in sync.

CREATE OR REPLACE FUNCTION public.sync_public_user_on_auth_update()
RETURNS TRIGGER AS $$
BEGIN
  -- We use COALESCE to keep existing values if metadata is missing
  -- We extract 'name' from full_name or name in raw_user_meta_data
  UPDATE public.users
  SET 
    email = NEW.email,
    name = COALESCE(
      NEW.raw_user_meta_data->>'full_name', 
      NEW.raw_user_meta_data->>'name', 
      public.users.name
    ),
    updated_at = NOW()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

-- Trigger on auth.users (requires migration in dashboard or supersu)
-- Note: In Supabase, triggers on auth.users are usually created via the dashboard SQL editor
-- but we include it here for completeness.
DROP TRIGGER IF EXISTS on_auth_user_updated_sync ON auth.users;
CREATE TRIGGER on_auth_user_updated_sync
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_public_user_on_auth_update();
