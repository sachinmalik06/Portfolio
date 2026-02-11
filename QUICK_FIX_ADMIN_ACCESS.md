# Quick Fix: Grant Admin Access

If you've logged in with a new email but are seeing "Access denied. You don't have administrator privileges," you need to authorize that email in your database.

## How to Authorize Your Email

1. Go to your **Supabase Dashboard**.
2. Open the **SQL Editor** from the left sidebar.
3. Paste and run the following SQL (replace `YOUR_EMAIL@EXAMPLE.COM` with your actual email):

```sql
-- Replace 'YOUR_EMAIL@EXAMPLE.COM' with your actual email
UPDATE public.users 
SET is_admin = true 
WHERE email = 'YOUR_EMAIL@EXAMPLE.COM';

-- If the user doesn't exist in public.users yet, use this instead:
INSERT INTO public.users (id, email, is_admin)
SELECT id, email, true
FROM auth.users
WHERE email = 'YOUR_EMAIL@EXAMPLE.COM'
ON CONFLICT (id) DO UPDATE SET is_admin = true;
```

4. Try logging in again.

## Why this is necessary
For security, even though you can now "log in" with any email, the **Admin Dashboard** is still protected. You must manually grant admin rights to any email you want to use for managing the site.
