# Debugging Auth Issue: "Account not found"

## The Problem

You're getting "Access denied. Account not found" even though:
- The `users` table exists
- You've created the user in Supabase Auth
- You've run the admin setup SQL

## Possible Causes

### 1. Row Level Security (RLS) Blocking Query

The query might be blocked by RLS policies. Check:

**In Supabase Dashboard:**
1. Go to **Authentication** → **Policies**
2. Find the `users` table
3. Check if there's a policy that allows SELECT without authentication

**Or run this SQL to check:**
```sql
SELECT * FROM pg_policies WHERE tablename = 'users';
```

### 2. User Not in `public.users` Table

Even if the user exists in `auth.users`, they might not be in `public.users`.

**Check:**
```sql
-- Check auth.users
SELECT id, email FROM auth.users WHERE email = 'harshjeswani30@gmail.com';

-- Check public.users
SELECT id, email, is_admin FROM public.users WHERE email = 'harshjeswani30@gmail.com';
```

**If user exists in auth.users but NOT in public.users:**
Run the admin setup SQL again (from `002_create_default_admin.sql`)

### 3. Email Case Mismatch

The query uses `.toLowerCase()` but the database might have different casing.

**Check:**
```sql
SELECT email, LOWER(email) as lower_email 
FROM public.users 
WHERE LOWER(email) = 'harshjeswani30@gmail.com';
```

### 4. RLS Policy Issue

The RLS policy might require authentication, but we're querying BEFORE login.

**Fix:** Update the RLS policy to allow email lookup:

```sql
-- Drop existing policy
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Public can check email" ON public.users;

-- Create policy that allows email lookup (for login check)
CREATE POLICY "Allow email lookup for login"
  ON public.users FOR SELECT
  USING (true);  -- Allow anyone to check if email exists (for login)
```

**OR** make it more secure (only allow checking specific email):

```sql
CREATE POLICY "Allow email lookup for login"
  ON public.users FOR SELECT
  USING (
    -- Allow checking if a specific email exists (for login validation)
    email = current_setting('request.jwt.claims', true)::json->>'email'
    OR true  -- Temporarily allow all for debugging
  );
```

### 5. Supabase Client Not Connected

Check if Supabase is actually connected:

**In browser console:**
```javascript
// Check if Supabase is loaded
console.log(window.supabase || 'Not found');

// Try a test query
const { data, error } = await supabase.from('users').select('count');
console.log('Test query:', { data, error });
```

## Step-by-Step Debug

1. **Check if user exists:**
   ```sql
   SELECT * FROM public.users WHERE email = 'harshjeswani30@gmail.com';
   ```

2. **Check RLS policies:**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'users';
   ```

3. **Test query from SQL Editor:**
   ```sql
   SELECT * FROM public.users WHERE email = 'harshjeswani30@gmail.com';
   ```
   - If this works in SQL Editor but not in app → RLS issue
   - If this doesn't work → User doesn't exist

4. **Check browser console:**
   - Open DevTools → Console
   - Try to login
   - Look for the error: `console.error('User lookup error:', userError);`
   - Check what `userError` says

5. **Test Supabase connection:**
   - Check `.env.local` has correct values
   - Restart dev server after changing `.env.local`

## Quick Fix: Temporarily Disable RLS (For Testing Only)

**⚠️ WARNING: Only for testing! Re-enable after fixing.**

```sql
-- Temporarily disable RLS on users table
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Test login
-- If it works, the issue is RLS policies

-- Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

## Proper Fix: Update RLS Policy

```sql
-- Remove old policies
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;

-- Create new policy that allows email lookup for login
CREATE POLICY "Allow email lookup for authentication"
  ON public.users FOR SELECT
  USING (true);  -- Allow public read for email lookup during login

-- Keep admin write policy
DROP POLICY IF EXISTS "Admins can update users" ON public.users;
CREATE POLICY "Admins can update users"
  ON public.users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );
```

## Most Likely Issue

**RLS is blocking the query** because we're trying to query `public.users` BEFORE the user is authenticated.

**Solution:** Update RLS policy to allow SELECT on `users` table for email lookup (see above).

