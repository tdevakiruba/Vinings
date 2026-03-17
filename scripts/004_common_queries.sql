-- ============================================================
-- 004_common_queries.sql
-- Common read queries used by the application.
-- These are NOT migrations -- they document the queries the
-- app runs so they are version-controlled alongside the schema.
-- ============================================================

-- ──────────────────────────────────────────────
-- LANDING PAGE: Fetch all active programs with features, phases, pricing
-- ──────────────────────────────────────────────

-- All programs (public, no auth required)
-- SELECT * FROM public.programs WHERE is_active = true ORDER BY sort_order;

-- Program features for a specific program
-- SELECT * FROM public.program_features WHERE program_id = :program_id ORDER BY sort_order;

-- Program phases for a specific program
-- SELECT * FROM public.program_phases WHERE program_id = :program_id ORDER BY sort_order;

-- Program pricing for a specific program
-- SELECT * FROM public.program_pricing WHERE program_id = :program_id ORDER BY sort_order;

-- All categories
-- SELECT * FROM public.categories ORDER BY sort_order;

-- ──────────────────────────────────────────────
-- DASHBOARD: Subscription check (requires auth)
-- ──────────────────────────────────────────────

-- Check if user has an active subscription
-- SELECT id, status, current_period_start, current_period_end, plan_tier
-- FROM public.subscriptions
-- WHERE user_id = auth.uid()
--   AND status = 'active'
--   AND (current_period_end IS NULL OR current_period_end > now())
-- LIMIT 1;

-- ──────────────────────────────────────────────
-- DASHBOARD: Enrollment data (requires auth)
-- ──────────────────────────────────────────────

-- Get user's enrollment for a program
-- SELECT e.*, p.name as program_name, p.slug as program_slug
-- FROM public.enrollments e
-- JOIN public.programs p ON e.program_id = p.id
-- WHERE e.user_id = auth.uid()
--   AND e.status = 'active'
-- ORDER BY e.started_at DESC
-- LIMIT 1;

-- ──────────────────────────────────────────────
-- DASHBOARD: Progress tracking (requires auth)
-- ──────────────────────────────────────────────

-- Get all completed actions for an enrollment
-- SELECT * FROM public.user_actions
-- WHERE enrollment_id = :enrollment_id
-- ORDER BY day_number, action_index;

-- Get day progress for an enrollment
-- SELECT * FROM public.user_day_progress
-- WHERE enrollment_id = :enrollment_id
-- ORDER BY day_number;

-- Get streak info
-- SELECT * FROM public.user_streaks
-- WHERE enrollment_id = :enrollment_id;

-- ──────────────────────────────────────────────
-- ENROLLMENT API: Create subscription + enrollment
-- ──────────────────────────────────────────────

-- Insert subscription (start_date = now, end_date = now + 21 days)
-- INSERT INTO public.subscriptions (user_id, program_id, plan_tier, status, amount_cents, current_period_start, current_period_end)
-- VALUES (auth.uid(), :program_id, :plan_tier, 'active', :amount_cents, now(), now() + interval '21 days');

-- Insert enrollment
-- INSERT INTO public.enrollments (user_id, program_id, status, current_day, started_at)
-- VALUES (auth.uid(), :program_id, 'active', 1, now())
-- ON CONFLICT (user_id, program_id) DO UPDATE SET status = 'active', started_at = now(), current_day = 1;

-- Insert streak tracker
-- INSERT INTO public.user_streaks (user_id, enrollment_id, current_streak, longest_streak, last_activity_date)
-- VALUES (auth.uid(), :enrollment_id, 0, 0, CURRENT_DATE)
-- ON CONFLICT (user_id, enrollment_id) DO NOTHING;
