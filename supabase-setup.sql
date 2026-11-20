-- ============================================================
-- AQUARIA — Supabase Setup Script
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Create the site_data table (single-row JSON store)
CREATE TABLE IF NOT EXISTS public.site_data (
  id         INTEGER      PRIMARY KEY DEFAULT 1,
  data       JSONB        NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ  DEFAULT NOW()
);

-- 2. Enforce single-row constraint
CREATE UNIQUE INDEX IF NOT EXISTS site_data_singleton
  ON public.site_data ((true));

-- 3. Enable Row Level Security
ALTER TABLE public.site_data ENABLE ROW LEVEL SECURITY;

-- 4. Allow full access via service_role key (used by Vercel API functions)
DROP POLICY IF EXISTS "Service role full access" ON public.site_data;
CREATE POLICY "Service role full access" ON public.site_data
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. Seed an empty row (real data imported via: npm run seed)
INSERT INTO public.site_data (id, data)
VALUES (1, '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- STORAGE — uploads bucket
-- ============================================================

-- 6. Create a public storage bucket for uploaded images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'uploads',
  'uploads',
  true,
  10485760,   -- 10 MB per file
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- 7. Storage policies
DROP POLICY IF EXISTS "Public read uploads"   ON storage.objects;
DROP POLICY IF EXISTS "Service role upload"   ON storage.objects;
DROP POLICY IF EXISTS "Service role delete"   ON storage.objects;

-- Anyone can read (CDN public URLs)
CREATE POLICY "Public read uploads" ON storage.objects
  FOR SELECT USING (bucket_id = 'uploads');

-- Only service_role can upload (called from Vercel API)
CREATE POLICY "Service role upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'uploads');

-- Only service_role can delete
CREATE POLICY "Service role delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'uploads');

-- ============================================================
-- Done! Now run: npm run seed
-- to import your existing site-data.json into Supabase.
-- ============================================================
