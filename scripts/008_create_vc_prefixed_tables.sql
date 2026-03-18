-- ============================================================
-- 008_create_vc_prefixed_tables.sql
-- Creates all tables with VC_ prefix for Vinings College
-- Includes: core tables, program tables, user progress, lab tables
-- ============================================================

-- ============================================================
-- CORE TABLES
-- ============================================================

-- VC_categories: Program categories
CREATE TABLE IF NOT EXISTS public.VC_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.VC_categories ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'vc_categories_public_read') THEN
    CREATE POLICY "vc_categories_public_read" ON public.VC_categories FOR SELECT USING (true);
  END IF;
END $$;

-- VC_profiles: User profiles (auto-created via trigger on auth.users)
CREATE TABLE IF NOT EXISTS public.VC_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.VC_profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'vc_profiles_select_own') THEN
    CREATE POLICY "vc_profiles_select_own" ON public.VC_profiles FOR SELECT USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'vc_profiles_insert_own') THEN
    CREATE POLICY "vc_profiles_insert_own" ON public.VC_profiles FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'vc_profiles_update_own') THEN
    CREATE POLICY "vc_profiles_update_own" ON public.VC_profiles FOR UPDATE USING (auth.uid() = id);
  END IF;
END $$;

-- Auto-create profile on sign-up trigger for VC_profiles
CREATE OR REPLACE FUNCTION public.handle_new_user_vc()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.VC_profiles (id, first_name, last_name)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', null),
    coalesce(new.raw_user_meta_data ->> 'last_name', null)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_vc ON auth.users;

CREATE TRIGGER on_auth_user_created_vc
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_vc();

-- ============================================================
-- PROGRAM TABLES
-- ============================================================

-- VC_programs: Main programs table
CREATE TABLE IF NOT EXISTS public.VC_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tagline TEXT,
  short_description TEXT,
  long_description TEXT,
  category TEXT,
  category_slug TEXT,
  color TEXT DEFAULT '#0d9488',
  badge TEXT,
  duration TEXT,
  audience TEXT,
  hero_image TEXT,
  leaders JSONB DEFAULT '[]'::jsonb,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.VC_programs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'vc_programs_public_read') THEN
    CREATE POLICY "vc_programs_public_read" ON public.VC_programs FOR SELECT USING (true);
  END IF;
END $$;

-- VC_program_features: Features for each program
CREATE TABLE IF NOT EXISTS public.VC_program_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES public.VC_programs(id) ON DELETE CASCADE,
  icon TEXT,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.VC_program_features ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'vc_program_features_public_read') THEN
    CREATE POLICY "vc_program_features_public_read" ON public.VC_program_features FOR SELECT USING (true);
  END IF;
END $$;

-- VC_program_phases: SIGNAL framework phases
CREATE TABLE IF NOT EXISTS public.VC_program_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES public.VC_programs(id) ON DELETE CASCADE,
  letter TEXT,
  name TEXT NOT NULL,
  days TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.VC_program_phases ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'vc_program_phases_public_read') THEN
    CREATE POLICY "vc_program_phases_public_read" ON public.VC_program_phases FOR SELECT USING (true);
  END IF;
END $$;

-- VC_program_pricing: Pricing tiers for each program
CREATE TABLE IF NOT EXISTS public.VC_program_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES public.VC_programs(id) ON DELETE CASCADE,
  tier TEXT NOT NULL,
  name TEXT NOT NULL,
  subtitle TEXT,
  price TEXT,
  original_price TEXT,
  price_note TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  cta_label TEXT DEFAULT 'Get Started',
  cta_href TEXT DEFAULT '/signin',
  highlighted BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.VC_program_pricing ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'vc_program_pricing_public_read') THEN
    CREATE POLICY "vc_program_pricing_public_read" ON public.VC_program_pricing FOR SELECT USING (true);
  END IF;
END $$;

-- ============================================================
-- USER PROGRESS TABLES
-- ============================================================

-- VC_enrollments: Tracks which user is enrolled in which program
CREATE TABLE IF NOT EXISTS public.VC_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.VC_programs(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  current_day INTEGER NOT NULL DEFAULT 1,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, program_id)
);

ALTER TABLE public.VC_enrollments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'vc_enrollments_select_own') THEN
    CREATE POLICY "vc_enrollments_select_own" ON public.VC_enrollments FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'vc_enrollments_insert_own') THEN
    CREATE POLICY "vc_enrollments_insert_own" ON public.VC_enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'vc_enrollments_update_own') THEN
    CREATE POLICY "vc_enrollments_update_own" ON public.VC_enrollments FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

-- VC_user_day_progress: Tracks completion per day within a program
CREATE TABLE IF NOT EXISTS public.VC_user_day_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES public.VC_enrollments(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL CHECK (day_number >= 1),
  keynote_read BOOLEAN DEFAULT false,
  implementation_read BOOLEAN DEFAULT false,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(enrollment_id, day_number)
);

ALTER TABLE public.VC_user_day_progress ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'vc_day_progress_select_own') THEN
    CREATE POLICY "vc_day_progress_select_own" ON public.VC_user_day_progress FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'vc_day_progress_insert_own') THEN
    CREATE POLICY "vc_day_progress_insert_own" ON public.VC_user_day_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'vc_day_progress_update_own') THEN
    CREATE POLICY "vc_day_progress_update_own" ON public.VC_user_day_progress FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

-- VC_user_actions: Tracks individual action checkbox completion
CREATE TABLE IF NOT EXISTS public.VC_user_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES public.VC_enrollments(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL CHECK (day_number >= 1),
  action_index INTEGER NOT NULL CHECK (action_index >= 0),
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(enrollment_id, day_number, action_index)
);

ALTER TABLE public.VC_user_actions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'vc_user_actions_select_own') THEN
    CREATE POLICY "vc_user_actions_select_own" ON public.VC_user_actions FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'vc_user_actions_insert_own') THEN
    CREATE POLICY "vc_user_actions_insert_own" ON public.VC_user_actions FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'vc_user_actions_update_own') THEN
    CREATE POLICY "vc_user_actions_update_own" ON public.VC_user_actions FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

-- VC_subscriptions: Tracks payment and subscription status
CREATE TABLE IF NOT EXISTS public.VC_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.VC_programs(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_payment_intent_id TEXT,
  plan_tier TEXT NOT NULL DEFAULT 'individual' CHECK (plan_tier IN ('individual', 'team', 'enterprise', 'institutional', 'church', 'organization')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'trialing', 'past_due', 'cancelled', 'expired', 'incomplete')),
  amount_cents INTEGER,
  currency TEXT DEFAULT 'usd',
  interval TEXT DEFAULT 'one_time' CHECK (interval IN ('one_time', 'monthly', 'yearly')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.VC_subscriptions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'vc_subscriptions_select_own') THEN
    CREATE POLICY "vc_subscriptions_select_own" ON public.VC_subscriptions FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'vc_subscriptions_insert_own') THEN
    CREATE POLICY "vc_subscriptions_insert_own" ON public.VC_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'vc_subscriptions_update_own') THEN
    CREATE POLICY "vc_subscriptions_update_own" ON public.VC_subscriptions FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

-- VC_user_streaks: Tracks daily login/activity streaks
CREATE TABLE IF NOT EXISTS public.VC_user_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES public.VC_enrollments(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, enrollment_id)
);

ALTER TABLE public.VC_user_streaks ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'vc_user_streaks_select_own') THEN
    CREATE POLICY "vc_user_streaks_select_own" ON public.VC_user_streaks FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'vc_user_streaks_insert_own') THEN
    CREATE POLICY "vc_user_streaks_insert_own" ON public.VC_user_streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'vc_user_streaks_update_own') THEN
    CREATE POLICY "vc_user_streaks_update_own" ON public.VC_user_streaks FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

-- ============================================================
-- LAB / OFFICE HOURS TABLES
-- ============================================================

-- VC_office_hours: Scheduled office hours sessions
CREATE TABLE IF NOT EXISTS public.VC_office_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES public.VC_programs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  meeting_url TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.VC_office_hours ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'vc_office_hours_public_read') THEN
    CREATE POLICY "vc_office_hours_public_read" ON public.VC_office_hours FOR SELECT USING (true);
  END IF;
END $$;

-- VC_lab_submissions: User lab challenge submissions
CREATE TABLE IF NOT EXISTS public.VC_lab_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.VC_programs(id) ON DELETE CASCADE,
  office_hours_id UUID REFERENCES public.VC_office_hours(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN ('career-challenge', 'workplace-conflict', 'leadership-dilemma', 'professional-growth')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'selected', 'discussed', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.VC_lab_submissions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'vc_lab_submissions_select_own') THEN
    CREATE POLICY "vc_lab_submissions_select_own" ON public.VC_lab_submissions FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'vc_lab_submissions_insert_own') THEN
    CREATE POLICY "vc_lab_submissions_insert_own" ON public.VC_lab_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'vc_lab_submissions_update_own') THEN
    CREATE POLICY "vc_lab_submissions_update_own" ON public.VC_lab_submissions FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

-- ============================================================
-- CURRICULUM CONTENT TABLE
-- ============================================================

-- VC_workforce_mindset_21day: 21-day curriculum content
CREATE TABLE IF NOT EXISTS public.VC_workforce_mindset_21day (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_number INTEGER NOT NULL UNIQUE CHECK (day_number >= 1 AND day_number <= 21),
  title TEXT NOT NULL,
  key_theme TEXT NOT NULL,
  motivational_keynote TEXT,
  how_to_implement TEXT,
  three_actions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.VC_workforce_mindset_21day ENABLE ROW LEVEL SECURITY;

-- Authenticated users with active workforce-ready subscription can read all content
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'vc_workforce_subscribed_read') THEN
    CREATE POLICY "vc_workforce_subscribed_read"
      ON public.VC_workforce_mindset_21day
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1
          FROM public.VC_subscriptions s
          JOIN public.VC_programs p ON s.program_id = p.id
          WHERE s.user_id = auth.uid()
            AND s.status = 'active'
            AND p.slug = 'workforce-ready'
            AND (s.current_period_end IS NULL OR s.current_period_end > now())
        )
      );
  END IF;
END $$;

-- Anonymous users can read (for curriculum preview on public program page)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'vc_workforce_public_preview') THEN
    CREATE POLICY "vc_workforce_public_preview"
      ON public.VC_workforce_mindset_21day
      FOR SELECT
      TO anon
      USING (true);
  END IF;
END $$;

-- ============================================================
-- PERFORMANCE INDEXES
-- ============================================================

-- Program table indexes
CREATE INDEX IF NOT EXISTS idx_vc_programs_slug ON public.VC_programs(slug);
CREATE INDEX IF NOT EXISTS idx_vc_programs_category_slug ON public.VC_programs(category_slug);
CREATE INDEX IF NOT EXISTS idx_vc_program_features_program_id ON public.VC_program_features(program_id);
CREATE INDEX IF NOT EXISTS idx_vc_program_phases_program_id ON public.VC_program_phases(program_id);
CREATE INDEX IF NOT EXISTS idx_vc_program_pricing_program_id ON public.VC_program_pricing(program_id);

-- Enrollment indexes
CREATE INDEX IF NOT EXISTS idx_vc_enrollments_user_id ON public.VC_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_vc_enrollments_program_id ON public.VC_enrollments(program_id);
CREATE INDEX IF NOT EXISTS idx_vc_enrollments_status ON public.VC_enrollments(status);

-- Progress indexes
CREATE INDEX IF NOT EXISTS idx_vc_day_progress_enrollment_id ON public.VC_user_day_progress(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_vc_day_progress_user_id ON public.VC_user_day_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_vc_user_actions_enrollment_id ON public.VC_user_actions(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_vc_user_actions_user_id ON public.VC_user_actions(user_id);

-- Subscription indexes
CREATE INDEX IF NOT EXISTS idx_vc_subscriptions_user_id ON public.VC_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_vc_subscriptions_stripe_customer ON public.VC_subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_vc_subscriptions_status ON public.VC_subscriptions(status);

-- Streak indexes
CREATE INDEX IF NOT EXISTS idx_vc_user_streaks_user_id ON public.VC_user_streaks(user_id);

-- Lab indexes
CREATE INDEX IF NOT EXISTS idx_vc_lab_submissions_user ON public.VC_lab_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_vc_lab_submissions_program ON public.VC_lab_submissions(program_id);
CREATE INDEX IF NOT EXISTS idx_vc_office_hours_program ON public.VC_office_hours(program_id);
CREATE INDEX IF NOT EXISTS idx_vc_office_hours_scheduled ON public.VC_office_hours(scheduled_at);

-- Curriculum index
CREATE INDEX IF NOT EXISTS idx_vc_workforce_day_number ON public.VC_workforce_mindset_21day(day_number);
