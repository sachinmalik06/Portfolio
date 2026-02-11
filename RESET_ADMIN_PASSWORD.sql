-- SQL to reset admin password to the default recognized in migrations
-- Copy and run this in your Supabase SQL Editor

-- 1. Reset the password for the primary admin email
UPDATE auth.users 
SET encrypted_password = crypt('Harsh0000..', gen_salt('bf'))
WHERE email = 'sachinmalikofficial6@gmail.com';

-- 2. Ensure they are still marked as admin in public.users
UPDATE public.users
SET is_admin = true
WHERE email = 'sachinmalikofficial6@gmail.com';

-- 3. If you changed your email recently and forgot, check this:
-- SELECT email FROM auth.users;

-- Note: The default password is: Harsh0000..
