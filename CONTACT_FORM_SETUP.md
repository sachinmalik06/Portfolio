# Contact Form Setup Instructions

## Step 1: Run the Database Migration

The contact form requires a database table to store submissions. Follow these steps:

1. **Open your Supabase Project Dashboard**
   - Go to https://supabase.com
   - Select your project

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Paste the Migration**
   - Copy the entire contents from `supabase/migrations/007_contact_submissions.sql`
   - Paste it into the SQL Editor
   - Click "Run" or press Ctrl+Enter

4. **Verify the Table was Created**
   - Go to "Table Editor" in the left sidebar
   - Look for the `contact_submissions` table
   - You should see the table with columns: id, name, email, subject, message, status, created_at, updated_at

## Step 2: Test the Contact Form

1. Go to your website's home page
2. Scroll to the contact section
3. Fill out the form with test data
4. Click "Send Message"
5. You should see a success message

## Step 3: View Submissions in Admin

1. Go to `/admin/contact` in your admin panel
2. You should see all form submissions
3. You can mark them as read, replied, or archived
4. You can also delete submissions

## Troubleshooting

### Error: "relation 'contact_submissions' does not exist"
- The migration hasn't been run yet
- Go to Supabase SQL Editor and run the migration from step 1

### Error: "Failed to send message"
- Check browser console for detailed error
- Verify Supabase environment variables are set in `.env.local`:
  ```
  VITE_SUPABASE_URL=your_project_url
  VITE_SUPABASE_ANON_KEY=your_anon_key
  ```
- Ensure RLS policies are enabled (they're included in the migration)

### Error: "new row violates row-level security policy"
- The anon user needs INSERT permission
- Re-run the migration to ensure RLS policies are created
- Or manually add this policy in Supabase Dashboard:
  ```sql
  CREATE POLICY "Allow public to submit contact forms"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);
  ```

## Migration SQL (for reference)

The migration file is located at: `supabase/migrations/007_contact_submissions.sql`

It creates:
- `contact_submissions` table
- Row Level Security policies
- Indexes for performance
- Auto-update trigger for `updated_at` field
