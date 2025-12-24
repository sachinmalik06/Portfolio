# Complete Supabase Setup Guide - Step by Step

Follow these steps in order to set up your Supabase backend.

---

## Step 1: Create Supabase Account & Project

1. **Go to Supabase**
   - Visit: https://supabase.com
   - Click **"Start your project"** or **"Sign in"**

2. **Sign Up / Sign In**
   - Sign up with GitHub, Google, or email
   - Complete the verification if needed

3. **Create New Project**
   - Click **"New Project"** button (top right)
   - Fill in the form:
     - **Name**: `portfolio-aesthetic` (or any name you prefer)
     - **Database Password**: Create a strong password (save it somewhere safe!)
       - Example: `MySecurePassword123!@#`
     - **Region**: Choose closest to you (e.g., `US East`, `EU West`)
     - **Pricing Plan**: Free tier is fine for development
   - Click **"Create new project"**

4. **Wait for Project Setup**
   - This takes 1-2 minutes
   - You'll see "Setting up your project..." message
   - Wait until you see "Project is ready"

---

## Step 2: Get Your API Keys

1. **Go to Project Settings**
   - In your Supabase dashboard, click **Settings** (gear icon) in the left sidebar
   - Click **API** in the settings menu

2. **Copy Your Credentials**
   - You'll see two important values:
     - **Project URL**: Something like `https://xxxxx.supabase.co`
     - **anon public** key: A long string starting with `eyJ...`
   
3. **Save These Values**
   - Copy both values
   - You'll need them in Step 5

---

## Step 3: Run Database Migration

1. **Open SQL Editor**
   - In Supabase dashboard, click **SQL Editor** in the left sidebar
   - Click **"New query"** button (top right)

2. **Copy Migration SQL**
   - Open the file: `supabase/migrations/001_initial_schema.sql`
   - Copy **ALL** the SQL code (Ctrl+A, Ctrl+C)

3. **Paste and Run**
   - Paste the SQL into the Supabase SQL Editor
   - Click **"Run"** button (or press Ctrl+Enter)
   - Wait for it to complete
   - You should see: **"Success. No rows returned"** or similar

4. **Verify Tables Were Created**
   - Click **Table Editor** in the left sidebar
   - You should see these tables:
     - ✅ `users`
     - ✅ `site_settings`
     - ✅ `pages`
     - ✅ `expertise_cards`
     - ✅ `timeline_entries`

---

## Step 4: Create Admin User

1. **Go to Authentication**
   - Click **Authentication** in the left sidebar
   - Click **Users** tab

2. **Create New User**
   - Click **"Add user"** button (top right)
   - Select **"Create new user"**

3. **Fill in Admin Details**
   - **Email**: `harshjeswani30@gmail.com`
   - **Password**: `Harsh0000..`
   - **Auto Confirm User**: ✅ **Check this box** (important!)
   - Leave other fields as default

4. **Create User**
   - Click **"Create user"** button
   - You should see the user appear in the list

---

## Step 5: Set Admin Privileges

1. **Go Back to SQL Editor**
   - Click **SQL Editor** in the left sidebar
   - Click **"New query"**

2. **Run Admin Setup SQL**
   - Copy and paste this SQL:

```sql
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

3. **Run the Query**
   - Click **"Run"** button
   - Should see: **"Success. 1 row affected"**

4. **Verify Admin Was Created**
   - Run this query to check:

```sql
SELECT id, email, is_admin, name 
FROM public.users 
WHERE email = 'harshjeswani30@gmail.com';
```

   - You should see: `is_admin = true`

---

## Step 6: Set Up Environment Variables

1. **Create `.env.local` File**
   - In your project root folder, create a file named `.env.local`
   - If it already exists, open it

2. **Add Your Supabase Credentials**
   - Paste these lines (replace with your actual values):

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

   - Replace `https://xxxxx.supabase.co` with your **Project URL** from Step 2
   - Replace `eyJ...` with your **anon public** key from Step 2

3. **Save the File**
   - Save `.env.local` in the project root (same folder as `package.json`)

---

## Step 7: Test the Setup

1. **Start Your Dev Server**
   ```bash
   pnpm dev
   ```

2. **Test Public Pages** (No login needed)
   - Open: http://localhost:5173
   - Should see your landing page
   - Try navigating to `/about`, `/contact`, `/expertise`
   - All should work without login ✅

3. **Test Admin Login**
   - Go to: http://localhost:5173/auth
   - Enter email: `harshjeswani30@gmail.com`
   - Click **"Send OTP"**
   - Check your email for the OTP code
   - Enter the OTP code
   - Should redirect to `/admin` ✅

4. **Test Admin Panel**
   - You should see the admin dashboard
   - Try navigating to different admin sections
   - Everything should work ✅

---

## Step 8: Configure Email (Optional but Recommended)

If OTP emails aren't working:

1. **Go to Authentication Settings**
   - Click **Authentication** → **Settings**
   - Scroll to **Email Templates**

2. **Configure SMTP (Optional)**
   - For production, set up custom SMTP
   - For development, Supabase's default email works

3. **Check Email Provider**
   - Make sure **Email** provider is enabled
   - Go to **Authentication** → **Providers**
   - Ensure **Email** is toggled ON

---

## Troubleshooting

### ❌ "Missing Supabase environment variables"
- Make sure `.env.local` exists in project root
- Check variable names are exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server after adding env variables

### ❌ "Access denied. Account not found"
- Make sure you created the user in Supabase Auth (Step 4)
- Make sure you ran the admin setup SQL (Step 5)
   - Check email matches exactly: `harshjeswani30@gmail.com`

### ❌ "Failed to send OTP"
- Check Supabase Auth → Settings → Email provider is enabled
- Check your email spam folder
- For development, Supabase sends emails (may be delayed)

### ❌ Tables don't exist
- Make sure you ran the migration SQL (Step 3)
- Check Table Editor to see if tables exist
- If missing, run the migration again

### ❌ "Policy already exists" error
- This is fine! The migration is idempotent
- Just continue - it means some parts already exist

---

## Quick Checklist

- [ ] Created Supabase project
- [ ] Got API keys (URL and anon key)
- [ ] Ran migration SQL (`001_initial_schema.sql`)
- [ ] Created admin user in Authentication
- [ ] Set `is_admin = true` in database
- [ ] Added environment variables to `.env.local`
- [ ] Tested public pages (no login)
- [ ] Tested admin login
- [ ] Tested admin panel

---

## Next Steps After Setup

1. **Add Content**
   - Log into admin panel
   - Add expertise cards
   - Add timeline entries
   - Edit page content

2. **Customize**
   - Update site settings
   - Change header title
   - Add your content

3. **Deploy**
   - When ready, deploy to production
   - Update environment variables in your hosting platform

---

## Summary

✅ **Public Portfolio** = Anyone can view (no login)  
✅ **Admin Panel** = Only you can edit (login required)  
✅ **Default Admin** = `harshjeswani30@gmail.com` / `Harsh0000..`

You're all set! 🎉

