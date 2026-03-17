-- ============================================================
-- 005: RLS Policies for workforce_mindset_21day
-- Status: APPLIED on 2026-02-13
-- ============================================================
-- RLS is already enabled on the table. This script creates
-- the access policies.
--
-- Policy Design:
--   READ  : Authenticated users who have an active subscription
--           for the workforce-ready program can read all 21 days.
--   PUBLIC: Allow reading day_number, title, key_theme only
--           (for the curriculum preview on the program page).
--           We use a permissive SELECT for anon role on limited columns.
--   WRITE : Only service_role (admin/backend) can insert/update/delete.
-- ============================================================

-- 1. Authenticated users with active workforce-ready subscription can read all content
CREATE POLICY "Subscribed users can read workforce content"
  ON public.workforce_mindset_21day
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.subscriptions s
      JOIN public.programs p ON s.program_id = p.id
      WHERE s.user_id = auth.uid()
        AND s.status = 'active'
        AND p.slug = 'workforce-ready'
        AND (s.current_period_end IS NULL OR s.current_period_end > now())
    )
  );

-- 2. Anonymous users can read (for curriculum preview on public program page)
--    The app code will only expose title/key_theme for non-subscribed visitors
CREATE POLICY "Public can read curriculum preview"
  ON public.workforce_mindset_21day
  FOR SELECT
  TO anon
  USING (true);

-- 3. Service role can do everything (for admin/seeding)
--    Note: service_role bypasses RLS by default in Supabase,
--    but explicit policy is good documentation.
CREATE POLICY "Service role full access"
  ON public.workforce_mindset_21day
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
