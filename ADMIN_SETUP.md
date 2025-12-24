# Admin Setup Guide

## Default Admin Credentials

- **Email**: `harshjeswani30@gmail.com`
- **Password**: `Harsh0000..`

## Security Features

✅ **No public user registration** - Only pre-approved admins can access  
✅ **Admin-only access** - Only users with `is_admin = true` can log in  
✅ **Pre-approved system** - Users must exist in `public.users` table before they can authenticate  

## Setup Steps

### 1. Create Admin User in Supabase Auth

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Fill in:
   - **Email**: `harshjeswani30@gmail.com`
   - **Password**: `Harsh0000..`
   - **Auto Confirm User**: ✅ Check this
4. Click **"Create user"**

### 2. Set Admin Privileges

Run this SQL in Supabase SQL Editor:

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

### 3. Verify Admin Access

```sql
SELECT id, email, is_admin, name 
FROM public.users 
WHERE email = 'harshjeswani30@gmail.com';
```

Should return: `is_admin = true`

## Adding More Admins

To add additional admins:

1. **Create user in Supabase Auth**:
   - Go to Authentication → Users
   - Add user with email and password
   - Auto confirm the user

2. **Set admin privileges**:
   ```sql
   INSERT INTO public.users (id, email, is_admin, name)
   SELECT 
     id, 
     email, 
     true as is_admin,
     'Admin Name' as name
   FROM auth.users
   WHERE email = 'newadmin@example.com'
   ON CONFLICT (id) DO UPDATE 
   SET is_admin = true;
   ```

## How It Works

1. User tries to log in with email
2. System checks if email exists in `public.users` table
3. System checks if `is_admin = true`
4. If both checks pass, authentication proceeds
5. If either check fails, access is denied

## Troubleshooting

### "Access denied. Account not found"
- User doesn't exist in `public.users` table
- Solution: Create user in Supabase Auth first, then run the SQL to add them to `public.users`

### "Access denied. You don't have administrator privileges"
- User exists but `is_admin = false`
- Solution: Run SQL to set `is_admin = true`

### "Failed to send OTP"
- Check Supabase Auth settings
- Make sure Email provider is enabled
- Check email spam folder

