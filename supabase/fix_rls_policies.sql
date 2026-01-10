-- Fix RLS Policies for Public Read Access
-- Run this in your Supabase SQL Editor

-- Ensure RLS is enabled
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expertise_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_entries ENABLE ROW LEVEL SECURITY;

-- Drop and recreate site_settings policies
DROP POLICY IF EXISTS "Anyone can view site settings" ON public.site_settings;
CREATE POLICY "Anyone can view site settings"
  ON public.site_settings FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;
CREATE POLICY "Admins can manage site settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Drop and recreate gallery_items policies
DROP POLICY IF EXISTS "Anyone can view active gallery items" ON public.gallery_items;
CREATE POLICY "Anyone can view active gallery items"
  ON public.gallery_items FOR SELECT
  TO public
  USING (active = true);

DROP POLICY IF EXISTS "Admins can view all gallery items" ON public.gallery_items;
CREATE POLICY "Admins can view all gallery items"
  ON public.gallery_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can manage gallery items" ON public.gallery_items;
CREATE POLICY "Admins can manage gallery items"
  ON public.gallery_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Drop and recreate expertise_cards policies
DROP POLICY IF EXISTS "Anyone can view active expertise cards" ON public.expertise_cards;
CREATE POLICY "Anyone can view active expertise cards"
  ON public.expertise_cards FOR SELECT
  TO public
  USING (active = true);

DROP POLICY IF EXISTS "Admins can view all expertise cards" ON public.expertise_cards;
CREATE POLICY "Admins can view all expertise cards"
  ON public.expertise_cards FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can manage expertise cards" ON public.expertise_cards;
CREATE POLICY "Admins can manage expertise cards"
  ON public.expertise_cards FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Drop and recreate timeline_entries policies
DROP POLICY IF EXISTS "Anyone can view active timeline entries" ON public.timeline_entries;
CREATE POLICY "Anyone can view active timeline entries"
  ON public.timeline_entries FOR SELECT
  TO public
  USING (active = true);

DROP POLICY IF EXISTS "Admins can view all timeline entries" ON public.timeline_entries;
CREATE POLICY "Admins can view all timeline entries"
  ON public.timeline_entries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can manage timeline entries" ON public.timeline_entries;
CREATE POLICY "Admins can manage timeline entries"
  ON public.timeline_entries FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );
