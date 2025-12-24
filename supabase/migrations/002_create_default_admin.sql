-- Migration to set up default admin user
-- This should be run AFTER creating the user in Supabase Auth dashboard

-- Step 1: Create the user in Supabase Auth dashboard first:
-- 1. Go to Authentication > Users
-- 2. Click "Add user" > "Create new user"
-- 3. Email: harshjeswani30@gmail.com
-- 4. Password: Harsh0000..
-- 5. Check "Auto Confirm User"
-- 6. Click "Create user"

-- Step 2: Then run this SQL to set them as admin:
INSERT INTO public.users (id, email, is_admin, name)
SELECT 
  id, 
  email, 
  true as is_admin,
  'Harsh Jeswani' as name
FROM auth.users
WHERE email = 'harshjeswani30@gmail.com'
ON CONFLICT (id) DO UPDATE 
SET 
  is_admin = true,
  email = EXCLUDED.email,
  name = COALESCE(public.users.name, EXCLUDED.name);

-- Verify the admin was created
SELECT id, email, is_admin, name 
FROM public.users 
WHERE email = 'harshjeswani30@gmail.com';

