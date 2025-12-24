# Portfolio Access Model

## ✅ Current Setup (Correct)

### Public Access (No Login Required)
Anyone can view these pages without authentication:
- **Landing Page** (`/`) - Home/Portfolio showcase
- **About Page** (`/about`) - About section with timeline
- **Contact Page** (`/contact`) - Contact information
- **Expertise Page** (`/expertise`) - Services/expertise cards

All portfolio content is **publicly accessible** - no login needed to view.

---

### Admin Access (Login Required)
Only authenticated admins can access:
- **Admin Panel** (`/admin/*`) - All admin routes require:
  1. ✅ User must be logged in (authentication)
  2. ✅ User must have `is_admin = true` in database

**Admin Routes:**
- `/admin` - Dashboard
- `/admin/expertise` - Manage expertise cards
- `/admin/timeline` - Manage timeline entries
- `/admin/pages` - Edit page content
- `/admin/media` - Media management
- `/admin/settings` - Admin account settings

**Login Page:**
- `/auth` - Admin login page

---

## 🔐 Default Admin Credentials

- **Email**: `harshjesswani30@gmail.com`
- **Password**: `Harsh0000..`

---

## How It Works

### Public Pages
1. User visits `/`, `/about`, `/contact`, or `/expertise`
2. ✅ **No authentication check** - page loads immediately
3. Content is fetched from Supabase (public read access via RLS)
4. Anyone can view the portfolio

### Admin Panel
1. User tries to access `/admin/*`
2. `AdminLayout` component checks:
   - Is user authenticated? → If no, redirect to `/auth`
   - Is user admin? → If no, show "Access Denied"
3. ✅ Only if both checks pass → Admin panel loads

### Authentication Flow
1. Admin goes to `/auth`
2. Enters email: `harshjesswani30@gmail.com`
3. Receives OTP code via email
4. Enters OTP to verify
5. ✅ Logged in → Redirected to `/admin`

---

## Security Features

✅ **Public portfolio** - No barriers for viewers  
✅ **Admin-only editing** - Only pre-approved admins can edit  
✅ **No public signups** - Only existing admins can log in  
✅ **RLS Policies** - Database enforces read/write permissions  
✅ **Email verification** - OTP-based login for security  

---

## Summary

- **Portfolio = Public** 🌐 (Anyone can view)
- **Admin Panel = Private** 🔒 (Only you can edit)

This is exactly how it's set up! Your portfolio is accessible to everyone, and only you (with admin credentials) can edit it through the admin panel.

