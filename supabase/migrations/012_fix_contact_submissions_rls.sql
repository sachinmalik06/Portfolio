-- Fix contact_submissions RLS policy to allow anonymous users to insert
-- This allows both anonymous (anon) and authenticated users to submit contact forms

-- First, drop any existing policies
DROP POLICY IF EXISTS "Allow anyone to submit contact forms" ON contact_submissions;
DROP POLICY IF EXISTS "Enable insert for all users" ON contact_submissions;

-- Create a new policy that explicitly allows both anon and authenticated roles
CREATE POLICY "Allow anyone to submit contact forms"
    ON contact_submissions
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Verify RLS is enabled
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
