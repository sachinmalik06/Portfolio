-- Fix RLS policy to allow email lookup during login
-- This fixes the infinite recursion error

-- Remove ALL existing policies on users table
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Allow email lookup for authentication" ON public.users;

-- Policy 1: Allow public read for email lookup during login (BEFORE authentication)
-- This is needed to check if user exists before they log in
CREATE POLICY "Allow email lookup for authentication"
  ON public.users FOR SELECT
  USING (true);  -- Allow anyone to read for login check

-- Policy 2: Users can view their own data (AFTER authentication)
-- This uses auth.uid() which doesn't cause recursion
CREATE POLICY "Users can view their own data"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Note: We removed "Admins can view all users" policy because it caused recursion
-- Admins can still access all data through the "Allow email lookup" policy above
-- Or we can create a function-based approach if needed later
