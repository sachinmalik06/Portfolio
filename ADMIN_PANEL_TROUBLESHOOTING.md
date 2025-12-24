# Admin Panel Troubleshooting Guide

## Common Issues and Fixes

### ❌ "Missing Supabase environment variables"

**Error**: Console shows "Missing Supabase environment variables"

**Fix**:
1. Create `.env.local` file in project root
2. Add:
   ```env
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Restart dev server: `pnpm dev`

---

### ❌ Admin Panel Shows "Loading..." Forever

**Possible Causes**:
1. Supabase not configured
2. Environment variables missing
3. Network error connecting to Supabase

**Fix**:
1. Check browser console for errors
2. Verify `.env.local` exists and has correct values
3. Check Supabase project is active
4. Restart dev server

---

### ❌ "Access Denied. Account not found"

**Error**: When trying to log in

**Fix**:
1. Make sure you created the user in Supabase Auth (Step 4 of setup)
2. Make sure you ran the admin setup SQL (Step 5 of setup)
3. Verify email matches exactly: `harshjeswani30@gmail.com`

**Check in Supabase**:
- Go to Authentication → Users
- Verify user exists
- Go to SQL Editor and run:
  ```sql
  SELECT * FROM public.users WHERE email = 'harshjeswani30@gmail.com';
  ```
- Should show `is_admin = true`

---

### ❌ "Access Denied. You don't have admin privileges"

**Error**: User exists but can't access admin

**Fix**:
Run this SQL in Supabase:
```sql
UPDATE public.users 
SET is_admin = true 
WHERE email = 'harshjeswani30@gmail.com';
```

---

### ❌ Admin Panel Redirects to /auth Immediately

**Possible Causes**:
1. Not logged in
2. Session expired
3. Supabase auth not working

**Fix**:
1. Go to `/auth` and log in
2. Check browser console for errors
3. Verify Supabase environment variables are set
4. Check Supabase project is active

---

### ❌ "Failed to send OTP"

**Error**: OTP email not received

**Fix**:
1. Check Supabase Auth → Settings → Email provider is enabled
2. Check your email spam folder
3. Verify email address is correct
4. For development, Supabase emails may be delayed

---

### ❌ TypeScript/Compilation Errors

**Error**: Build fails with type errors

**Fix**:
1. Make sure all files are saved
2. Restart TypeScript server in your IDE
3. Run `pnpm install` to ensure dependencies are installed
4. Check for missing imports

---

## Quick Health Check

Run these checks:

1. **Environment Variables**:
   ```bash
   # Check if .env.local exists
   cat .env.local
   ```
   Should show `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

2. **Supabase Connection**:
   - Open browser console
   - Go to `/admin`
   - Check for errors
   - Look for Supabase connection errors

3. **Database**:
   - Go to Supabase Dashboard → Table Editor
   - Verify `users` table exists
   - Check if your admin user has `is_admin = true`

4. **Authentication**:
   - Go to Supabase Dashboard → Authentication → Users
   - Verify your user exists
   - Check "Auto Confirm User" was checked when creating

---

## Step-by-Step Debug

1. **Check Console Errors**:
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for red errors
   - Share the error message

2. **Check Network Tab**:
   - Open DevTools → Network tab
   - Try to access `/admin`
   - Look for failed requests (red)
   - Check if Supabase requests are failing

3. **Verify Setup**:
   - Follow `SUPABASE_SETUP_STEPS.md` again
   - Make sure all steps completed successfully
   - Double-check SQL migrations ran

---

## Still Not Working?

If none of the above fixes work:

1. **Check Browser Console** - Share any error messages
2. **Check Network Tab** - See if requests are failing
3. **Verify Supabase Project** - Make sure project is active
4. **Check Environment Variables** - Make sure they're loaded

The most common issue is **missing environment variables**. Make sure `.env.local` exists and has the correct values!

