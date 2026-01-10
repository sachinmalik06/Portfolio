-- Verify Contact Submissions Setup
-- Run this in Supabase SQL Editor to check your setup

-- 1. Check if table exists and view its structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'contact_submissions'
ORDER BY ordinal_position;

-- 2. Check RLS is enabled
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'contact_submissions';

-- 3. View all policies
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

-- 4. Test if anon can insert (this should succeed)
-- Run this to test: it will create a test submission
INSERT INTO contact_submissions (name, email, subject, message, status)
VALUES ('Test User', 'test@example.com', 'Test Subject', 'Test message from SQL', 'unread')
RETURNING *;

-- 5. View all submissions
SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 10;
