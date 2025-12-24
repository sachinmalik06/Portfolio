# Migration Guide: Convex to Supabase

This guide explains how to migrate from Convex to Supabase backend.

## Setup Steps

### 1. Create Supabase Project
1. Go to https://supabase.com and create a new project
2. Note your project URL and anon key
3. Add to `.env.local`:
   ```
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### 2. Run Database Migrations
```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

Or manually run the SQL in `supabase/migrations/001_initial_schema.sql` in your Supabase SQL editor.

### 3. Set Up Authentication
- In Supabase Dashboard, go to Authentication > Providers
- Enable Email provider
- Configure email templates for OTP if needed

### 4. Create Admin User
Run this SQL in Supabase SQL editor:
```sql
-- First, sign up a user through the auth UI, then run:
UPDATE public.users 
SET is_admin = true 
WHERE email = 'your-admin@email.com';
```

## Code Changes

### Replacing Convex Hooks

**Before (Convex):**
```typescript
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const data = useQuery(api.cms.getTimeline);
const create = useMutation(api.cms.createTimelineEntry);
```

**After (Supabase):**
```typescript
import { useTimeline, useCreateTimelineEntry } from "@/hooks/use-cms";

const { data, isLoading, error } = useTimeline();
const { mutate: create, isLoading: isCreating } = useCreateTimelineEntry();
```

### Authentication

**Before:**
```typescript
import { useAuth } from "@/hooks/use-auth";
const { isAuthenticated, signOut } = useAuth();
```

**After:**
```typescript
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
const { isAuthenticated, signOut, isAdmin } = useSupabaseAuth();
```

## Migration Checklist

- [x] Install Supabase dependencies
- [x] Create database schema
- [x] Create Supabase client
- [x] Create CMS service layer
- [x] Create React hooks
- [ ] Update main.tsx to use Supabase auth provider
- [ ] Update all admin components
- [ ] Update frontend pages (Landing, About, Contact, Expertise)
- [ ] Update Auth page
- [ ] Test all functionality
- [ ] Migrate existing data from Convex to Supabase

## Next Steps

1. Update `src/main.tsx` to replace ConvexAuthProvider with Supabase auth
2. Update each admin component one by one
3. Update frontend pages
4. Test thoroughly
5. Migrate data from Convex to Supabase

