-- Check current RLS policies for contact_submissions table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'contact_submissions';

-- This will show you the current policies and which roles they apply to
-- Look for the "roles" column - it should show {anon,authenticated} for the INSERT policy
