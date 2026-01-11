-- Drop and recreate the INSERT policy with explicit permissions
-- This ensures anon users can insert contact submissions

DROP POLICY IF EXISTS "Allow anyone to submit contact forms" ON contact_submissions;

-- Create policy that explicitly allows INSERT for anon role
CREATE POLICY "Allow anon insert contact" 
ON contact_submissions 
AS PERMISSIVE
FOR INSERT 
TO anon
WITH CHECK (true);

-- Also allow authenticated users to insert
CREATE POLICY "Allow authenticated insert contact" 
ON contact_submissions 
AS PERMISSIVE
FOR INSERT 
TO authenticated
WITH CHECK (true);
