-- Migration to add a password column to public.users
-- This allows the admin to see their current password in the Supabase dashboard if forgotten.

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password TEXT;

COMMENT ON COLUMN public.users.password IS 'Plain text password for admin recovery. Warning: High security risk if table is compromised.';
