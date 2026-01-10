-- Contact Form Submissions Table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (submit contact form) - using public for both anon and authenticated
CREATE POLICY "Allow anyone to submit contact forms"
    ON contact_submissions
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Policy: Allow authenticated users to view all submissions
CREATE POLICY "Allow authenticated users to view contact submissions"
    ON contact_submissions
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Allow authenticated users to update submissions
CREATE POLICY "Allow authenticated users to update contact submissions"
    ON contact_submissions
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy: Allow authenticated users to delete submissions
CREATE POLICY "Allow authenticated users to delete contact submissions"
    ON contact_submissions
    FOR DELETE
    TO authenticated
    USING (true);

-- Create index for faster queries
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);

-- Add updated_at trigger
CREATE TRIGGER update_contact_submissions_updated_at
    BEFORE UPDATE ON contact_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
