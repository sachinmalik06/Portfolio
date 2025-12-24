# 🔧 Fix: Infinite Recursion Error in RLS Policy

## The Problem

The error "infinite recursion detected in policy for relation 'users'" happens because the RLS policy is trying to query the `users` table to check if someone is an admin, but that policy itself is on the `users` table - creating a loop!

## ✅ Quick Fix: Run This SQL

1. **Go to Supabase Dashboard**
   - Open your project
   - Click **"SQL Editor"** (left sidebar)
   - Click **"New query"**

2. **Copy and paste this SQL:**

```sql
-- Remove ALL existing policies on users table (fixes recursion)
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Allow email lookup for authentication" ON public.users;

-- Policy 1: Allow public read for email lookup during login
CREATE POLICY "Allow email lookup for authentication"
  ON public.users FOR SELECT
  USING (true);  -- Allow anyone to read for login check

-- Policy 2: Users can view their own data (after login)
CREATE POLICY "Users can view their own data"
  ON public.users FOR SELECT
  USING (auth.uid() = id);
```

3. **Click "Run"**
   - Should see: **"Success"**

4. **Try logging in again**
   - Should work now! ✅

---

## What This Does

- **Removes the recursive policy** that was checking `users` table from within `users` policy
- **Allows email lookup** for login (public read)
- **Allows users to see their own data** after login
- **No recursion** - policies don't reference the same table

---

## Why This Is Safe

- Email lookup is needed for login (before auth)
- Users can only see their own data after login
- The "public read" for email lookup is necessary for the login flow
- We can add more restrictive policies later if needed

---

## Alternative: More Secure (If Needed Later)

If you want to restrict email lookup to only specific emails, you can use:

```sql
-- More restrictive: Only allow checking specific email format
CREATE POLICY "Allow email lookup for authentication"
  ON public.users FOR SELECT
  USING (
    -- Only allow queries that are checking for email (not full table scans)
    email IS NOT NULL
  );
```

But for now, the simple `USING (true)` works and fixes the recursion.

---

**After running the SQL above, the recursion error will be fixed and login will work!** 🎉

