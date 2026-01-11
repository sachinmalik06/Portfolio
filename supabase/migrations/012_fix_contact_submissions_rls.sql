-- Fix contact_submissions RLS policy to allow anonymous users to insert
DROP POLICY IF EXISTS "Allow anyone to submit contact forms" ON contact_submissions;

CREATE POLICY "Allow anyone to submit contact forms"
    ON contact_submissions
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);
