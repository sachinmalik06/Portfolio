-- SQL to reset admin password to the default recognized in migrations
-- Copy and run this in your Supabase SQL Editor

-- 1. Reset the password for the primary admin email
UPDATE auth.users 
SET 
  encrypted_password = crypt('Harsh0000..', gen_salt('bf')),
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  updated_at = NOW(),
  raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{full_name}', '"Admin"')
WHERE LOWER(email) = LOWER('sachinmalikofficial6@gmail.com');

-- 2. Ensure they are still marked as admin in public.users and sync plain text password
UPDATE public.users
SET 
  is_admin = true,
  password = 'Harsh0000..',
  updated_at = NOW()
WHERE LOWER(email) = LOWER('sachinmalikofficial6@gmail.com');

-- 3. Verify user exists (Run this to check if email is found)
SELECT id, email, email_confirmed_at FROM auth.users WHERE LOWER(email) = LOWER('sachinmalikofficial6@gmail.com');

-- Note: The default password is: Harsh0000..
