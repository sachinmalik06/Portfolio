-- Temporarily disable RLS on contact_submissions to test
-- ONLY FOR DEBUGGING - DO NOT USE IN PRODUCTION

ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;

-- After testing, re-enable with:
-- ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
