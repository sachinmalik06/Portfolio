# Why the `users` Table is Needed (Admin-Only System)

## Important: This Table is NOT for Public Users!

The `users` table is **only for admins**. It's the core of your admin access control system.

---

## How It Works

### 1. **Admin Access Control**
The `users` table stores the `is_admin` flag that determines who can access the admin panel:

```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE,
  is_admin BOOLEAN DEFAULT false,  -- ← This is the key!
  name TEXT,
  ...
);
```

### 2. **Login Check (Auth.tsx)**
When someone tries to log in, the system checks:

```typescript
// Step 1: Check if user exists in users table
const { data: userData } = await supabase
  .from('users')
  .select('*')
  .eq('email', email)
  .single();

// Step 2: If user doesn't exist → DENY ACCESS
if (!userData) {
  setError("Access denied. Account not found.");
  return;
}

// Step 3: Check if user is admin
if (!userData.is_admin) {
  setError("Access denied. You don't have administrator privileges.");
  return;
}

// Step 4: Only if both checks pass → Allow login
```

### 3. **Admin Panel Protection (AdminLayout.tsx)**
Every admin route checks:

```typescript
const { isAdmin } = useAuth(); // ← Gets is_admin from users table

if (!isAdmin) {
  return <div>Access Denied</div>; // ← Blocks non-admins
}
```

### 4. **Database Security (RLS Policies)**
Row Level Security policies check the `users` table:

```sql
-- Only admins can write to pages
CREATE POLICY "Admins can manage pages"
  ON public.pages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true  -- ← Checks users table!
    )
  );
```

---

## What Happens Without the `users` Table?

❌ **No way to check if someone is admin**  
❌ **No way to block non-admins from admin panel**  
❌ **No way to enforce database security**  
❌ **Anyone who can authenticate could access admin panel**

---

## The Flow

```
User tries to login
    ↓
Check: Does email exist in `users` table?
    ↓ NO → "Access denied. Account not found."
    ↓ YES
Check: Is `is_admin = true`?
    ↓ NO → "Access denied. You don't have admin privileges."
    ↓ YES
Allow login → Redirect to /admin
    ↓
AdminLayout checks: `isAdmin` from users table
    ↓ NO → Show "Access Denied"
    ↓ YES → Show admin panel
```

---

## Summary

✅ **`users` table = Admin registry** (not public users)  
✅ **Only admins are in this table**  
✅ **`is_admin` flag controls all access**  
✅ **Without it, you can't protect the admin panel**

The table is **essential** for your admin-only system. It's the whitelist that determines who can access the admin panel.

---

## What Gets Stored

For your admin account:
- `id` - Links to Supabase auth
- `email` - `harshjeswani30@gmail.com`
- `is_admin` - `true` (this is what grants access!)
- `name` - `Harsh Jeswani`

That's it! Only admin data, no public users.

