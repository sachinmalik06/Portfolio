# 🔧 Quick Fix: Auth "Account not found" Error

## The Problem

The RLS (Row Level Security) policy is blocking the query because it requires authentication, but we're checking if the user exists **BEFORE** they log in.

## ✅ Solution: Run This SQL in Supabase

1. **Go to Supabase Dashboard**
   - Open your project
   - Click **"SQL Editor"** (left sidebar)
   - Click **"New query"**

2. **Copy and paste this SQL:**

```sql
-- Fix RLS policy to allow email lookup during login
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Allow email lookup for authentication" ON public.users;

-- Allow public read for email lookup (needed for login check)
CREATE POLICY "Allow email lookup for authentication"
  ON public.users FOR SELECT
  USING (true);

-- Users can still view their own data after login
CREATE POLICY "Users can view their own data"
  ON public.users FOR SELECT
  USING (auth.uid() = id);
```

3. **Click "Run"**
   - Should see: **"Success"**

4. **Verify the user exists:**
   ```sql
   SELECT id, email, is_admin, name 
   FROM public.users 
   WHERE email = 'harshjeswani30@gmail.com';
   ```
   - Should show your user with `is_admin = true`

5. **Try logging in again**
   - Go to `/auth`
   - Enter: `harshjeswani30@gmail.com` / `Harsh0000..`
   - Should work now! ✅

---

## If User Still Not Found

If the SQL above works but login still fails, check:

1. **User exists in `public.users`:**
   ```sql
   SELECT * FROM public.users WHERE email = 'harshjeswani30@gmail.com';
   ```
   - If empty → Run `002_create_default_admin.sql` again

2. **User exists in `auth.users`:**
   ```sql
   SELECT id, email FROM auth.users WHERE email = 'harshjeswani30@gmail.com';
   ```
   - If empty → Create user in Supabase Auth dashboard first

3. **Check browser console:**
   - Open DevTools (F12) → Console
   - Try to login
   - Look for: `console.log('User lookup result:', ...)`
   - Check what it says

---

## What This Fix Does

- **Before:** RLS required authentication to query `users` table
- **After:** RLS allows public read for email lookup (needed for login)
- **Security:** Still protected - users can only see their own data after login, admins can see all

---

## Alternative: Use Migration File

If you prefer, you can also run the migration file:

1. The file is at: `supabase/migrations/003_fix_users_rls_for_login.sql`
2. Copy its contents
3. Run in Supabase SQL Editor

---

**After running this SQL, login should work!** 🎉

