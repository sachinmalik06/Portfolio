-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT UNIQUE,
  image TEXT,
  is_admin BOOLEAN DEFAULT false,
  role TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pages table
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expertise cards table
CREATE TABLE IF NOT EXISTS public.expertise_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT NOT NULL,
  icon TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  "order" INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Timeline entries table
CREATE TABLE IF NOT EXISTS public.timeline_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  content JSONB,
  images TEXT[] DEFAULT '{}',
  "order" INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON public.site_settings(key);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON public.pages(slug);
CREATE INDEX IF NOT EXISTS idx_expertise_cards_order ON public.expertise_cards("order");
CREATE INDEX IF NOT EXISTS idx_timeline_entries_order ON public.timeline_entries("order");

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expertise_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
-- NOTE: We removed "Admins can view all users" policy because it causes infinite recursion
-- (It queries the users table from within a users table policy)

-- Policy 1: Allow email lookup for authentication (before user is logged in)
-- This is needed to check if user exists during login
DROP POLICY IF EXISTS "Allow email lookup for authentication" ON public.users;
CREATE POLICY "Allow email lookup for authentication"
  ON public.users FOR SELECT
  USING (true);  -- Allow public read for email lookup during login

-- Policy 2: Users can view their own data (after login)
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
CREATE POLICY "Users can view their own data"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- NOTE: Admin access to all users is handled by the "Allow email lookup" policy above
-- Admins can access all data through that policy (it allows public read)
-- If you need more restrictive admin-only access later, use a function-based approach

-- RLS Policies for site_settings (public read, admin write)
DROP POLICY IF EXISTS "Anyone can view site settings" ON public.site_settings;
CREATE POLICY "Anyone can view site settings"
  ON public.site_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;
CREATE POLICY "Admins can manage site settings"
  ON public.site_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for pages (public read, admin write)
DROP POLICY IF EXISTS "Anyone can view pages" ON public.pages;
CREATE POLICY "Anyone can view pages"
  ON public.pages FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage pages" ON public.pages;
CREATE POLICY "Admins can manage pages"
  ON public.pages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for expertise_cards (public read active, admin write)
DROP POLICY IF EXISTS "Anyone can view active expertise cards" ON public.expertise_cards;
CREATE POLICY "Anyone can view active expertise cards"
  ON public.expertise_cards FOR SELECT
  USING (active = true);

DROP POLICY IF EXISTS "Admins can view all expertise cards" ON public.expertise_cards;
CREATE POLICY "Admins can view all expertise cards"
  ON public.expertise_cards FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can manage expertise cards" ON public.expertise_cards;
CREATE POLICY "Admins can manage expertise cards"
  ON public.expertise_cards FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for timeline_entries (public read active, admin write)
DROP POLICY IF EXISTS "Anyone can view active timeline entries" ON public.timeline_entries;
CREATE POLICY "Anyone can view active timeline entries"
  ON public.timeline_entries FOR SELECT
  USING (active = true);

DROP POLICY IF EXISTS "Admins can view all timeline entries" ON public.timeline_entries;
CREATE POLICY "Admins can view all timeline entries"
  ON public.timeline_entries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can manage timeline entries" ON public.timeline_entries;
CREATE POLICY "Admins can manage timeline entries"
  ON public.timeline_entries FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pages_updated_at ON public.pages;
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_expertise_cards_updated_at ON public.expertise_cards;
CREATE TRIGGER update_expertise_cards_updated_at BEFORE UPDATE ON public.expertise_cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_timeline_entries_updated_at ON public.timeline_entries;
CREATE TRIGGER update_timeline_entries_updated_at BEFORE UPDATE ON public.timeline_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create default admin user
-- Note: This will create the user in auth.users and public.users
-- You'll need to set the password manually in Supabase Auth dashboard or use the SQL below
-- The email is: harshjeswani30@gmail.com
-- After creating the user in Supabase Auth dashboard, run this to set them as admin:
-- 
-- INSERT INTO public.users (id, email, is_admin)
-- SELECT id, email, true
-- FROM auth.users
-- WHERE email = 'harshjeswani30@gmail.com'
-- ON CONFLICT (id) DO UPDATE SET is_admin = true;

-- Function to automatically create user profile when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create profile if user email is in the allowed list
  -- For now, we'll create it but set is_admin = false by default
  -- Admin status will be set manually
  INSERT INTO public.users (id, email, is_admin)
  VALUES (NEW.id, NEW.email, false)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

