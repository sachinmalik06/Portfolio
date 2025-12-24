# Supabase Migration Setup Instructions

## Quick Start

You only need to do **2 things**:

1. **Run the SQL migration in Supabase**
2. **Add environment variables**

That's it! The code is already migrated.

---

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: Your project name
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to you
5. Click "Create new project"
6. Wait for project to be ready (~2 minutes)

---

## Step 2: Run Database Migration

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open the file `supabase/migrations/001_initial_schema.sql` from this project
4. Copy **ALL** the SQL code from that file
5. Paste it into the Supabase SQL Editor
6. Click **"Run"** (or press Ctrl+Enter)
7. You should see "Success. No rows returned"

This creates all the tables, indexes, and security policies you need.

---

## Step 3: Add Environment Variables

1. In Supabase dashboard, go to **Settings** → **API** (left sidebar)
2. You'll see:
   - **Project URL** (something like `https://xxxxx.supabase.co`)
   - **anon public** key (a long string starting with `eyJ...`)

3. Create a `.env.local` file in your project root (if it doesn't exist):

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Replace the values with your actual Supabase URL and anon key.

---

## Step 4: Create Default Admin User

The default admin credentials are:
- **Email**: `harshjeswani30@gmail.com`
- **Password**: `Harsh0000..`

### Create the Admin User:

1. In Supabase dashboard, go to **Authentication** → **Users** (left sidebar)
2. Click **"Add user"** → **"Create new user"**
3. Enter:
   - **Email**: `harshjeswani30@gmail.com`
   - **Password**: `Harsh0000..`
   - **Auto Confirm User**: ✅ Check this
4. Click **"Create user"**

5. Now go to **SQL Editor** again and run the migration:

```sql
-- Run the migration file: supabase/migrations/002_create_default_admin.sql
-- Or copy and paste this:

INSERT INTO public.users (id, email, is_admin, name)
SELECT 
  id, 
  email, 
  true as is_admin,
  'Harsh Jeswani' as name
FROM auth.users
WHERE email = 'harshjeswani30@gmail.com'
ON CONFLICT (id) DO UPDATE 
SET 
  is_admin = true,
  email = EXCLUDED.email,
  name = COALESCE(public.users.name, EXCLUDED.name);
```

6. Verify the admin was created:

```sql
SELECT id, email, is_admin, name 
FROM public.users 
WHERE email = 'harshjeswani30@gmail.com';
```

You should see `is_admin = true`.

### Important Security Notes:

- **No public signups**: Only pre-approved admins can access the admin panel
- **Default admin**: The email `harshjeswani30@gmail.com` is the default admin
- **To add more admins**: Create them in Supabase Auth, then set `is_admin = true` in the `users` table

---

## Step 5: Test It!

1. Start your dev server:
   ```bash
   pnpm dev
   ```

2. Go to `http://localhost:5173/auth`
3. Enter your admin email
4. You should receive an OTP code (check your email)
5. Enter the OTP to log in
6. You should be redirected to `/admin`

---

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env.local` exists in the project root
- Make sure the variable names are exactly `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart your dev server after adding env variables

### "Account not found"
- Make sure you created the user in Supabase Authentication
- Make sure you ran the SQL to set `is_admin = true`
- Check that the email matches exactly (case-sensitive)

### "Failed to send OTP"
- Check Supabase dashboard → Authentication → Settings
- Make sure Email provider is enabled
- Check your email spam folder

### Tables don't exist
- Make sure you ran the SQL migration
- Check Supabase dashboard → Table Editor to see if tables exist

---

## What Changed?

- ✅ All admin components now use Supabase
- ✅ All frontend pages now use Supabase
- ✅ Authentication uses Supabase Auth (OTP)
- ✅ Database is PostgreSQL (Supabase) instead of Convex
- ✅ Same CMS functionality, different backend

---

## Next Steps

1. Migrate your existing data from Convex (if you have any)
2. Set up email templates in Supabase (optional)
3. Configure storage buckets if you need file uploads (optional)

---

## Need Help?

Check the `MIGRATION_GUIDE.md` for more detailed information about the migration.

