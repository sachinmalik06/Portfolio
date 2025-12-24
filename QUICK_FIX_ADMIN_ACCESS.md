# Quick Fix: Admin Access Denied

## The Problem
You're getting: **"Access denied. Account not found. Only pre-approved administrators can access."**

This means your user doesn't exist in the `public.users` table in Supabase.

---

## Solution: Set Up Admin User (2 Steps)

### Step 1: Create User in Supabase Auth

1. **Go to Supabase Dashboard**
   - Open your Supabase project
   - Click **"Authentication"** in the left sidebar
   - Click **"Users"** tab

2. **Create New User**
   - Click **"Add user"** button (top right)
   - Click **"Create new user"**
   - Fill in:
     - **Email**: `harshjeswani30@gmail.com`
     - **Password**: `Harsh0000..`
     - ✅ **Check "Auto Confirm User"** (IMPORTANT!)
   - Click **"Create user"**

---

### Step 2: Add User to Admin Table

1. **Go to SQL Editor**
   - Click **"SQL Editor"** in the left sidebar
   - Click **"New query"**

2. **Run This SQL**:
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

3. **Click "Run"**
   - Should see: **"Success. 1 row affected"**

---

### Step 3: Verify It Worked

Run this query to check:
```sql
SELECT id, email, is_admin, name 
FROM public.users 
WHERE email = 'harshjeswani30@gmail.com';
```

**Expected Result:**
- `email`: `harshjeswani30@gmail.com`
- `is_admin`: `true` ✅
- `name`: `Harsh Jeswani`

---

## Now Try Logging In

1. Go to `/auth` in your app
2. Enter:
   - **Email**: `harshjeswani30@gmail.com`
   - **Password**: `Harsh0000..`
3. Click **"Sign In"**

It should work now! 🎉

---

## Still Not Working?

### Check 1: User Exists in Auth?
Go to **Authentication → Users** and verify:
- User with email `harshjeswani30@gmail.com` exists
- Status is "Confirmed" (green checkmark)

### Check 2: User Exists in public.users?
Run this SQL:
```sql
SELECT * FROM public.users WHERE email = 'harshjeswani30@gmail.com';
```

If it returns nothing, run Step 2 again.

### Check 3: Email Matches Exactly?
- Make sure email is exactly: `harshjeswani30@gmail.com` (lowercase)
- No extra spaces
- No typos

### Check 4: Password Correct?
- Password should be: `Harsh0000..` (with two dots at the end)
- If you changed it, use the new password

---

## Alternative: Manual Insert (If Step 2 Fails)

If the SQL in Step 2 doesn't work, try this:

1. **Get the User ID from Auth:**
   ```sql
   SELECT id, email FROM auth.users WHERE email = 'harshjeswani30@gmail.com';
   ```
   Copy the `id` value (it's a UUID)

2. **Insert Manually:**
   ```sql
   INSERT INTO public.users (id, email, is_admin, name, created_at, updated_at)
   VALUES (
     'PASTE_THE_ID_HERE',
     'harshjeswani30@gmail.com',
     true,
     'Harsh Jeswani',
     NOW(),
     NOW()
   )
   ON CONFLICT (id) DO UPDATE 
   SET is_admin = true;
   ```

Replace `'PASTE_THE_ID_HERE'` with the actual ID from step 1.

---

## Need More Help?

Check `SUPABASE_SETUP_STEPS.md` for the full setup guide.

