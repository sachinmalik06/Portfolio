-- Fix Contact Form RLS Policy
-- Run this in Supabase SQL Editor to fix the 403 error

-- Drop the existing policy
DROP POLICY IF EXISTS "Allow public to submit contact forms" ON contact_submissions;

-- Create a new policy that works for both anonymous and authenticated users
CREATE POLICY "Allow anyone to submit contact forms"
    ON contact_submissions
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Also allow authenticated users to insert (backup policy)
CREATE POLICY "Allow authenticated users to submit contact forms"
    ON contact_submissions
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Verify the policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename = 'contact_submissions';
