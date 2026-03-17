-- ============================================================
-- Script: 006_workforce_curriculum_queries.sql
-- Purpose: Common queries for pulling workforce_mindset_21day data
-- Table: public.workforce_mindset_21day
-- ============================================================

-- 1. Get all 21 days ordered for full curriculum display
SELECT
  day_number,
  title,
  key_theme,
  motivational_keynote,
  how_to_implement,
  three_actions
FROM public.workforce_mindset_21day
ORDER BY day_number;

-- 2. Get a single day by day_number (for daily view)
-- SELECT
--   day_number,
--   title,
--   key_theme,
--   motivational_keynote,
--   how_to_implement,
--   three_actions
-- FROM public.workforce_mindset_21day
-- WHERE day_number = :day_number;

-- 3. Get curriculum preview (titles + themes only, no full content)
-- Used on program landing page for non-subscribers
SELECT
  day_number,
  title,
  key_theme
FROM public.workforce_mindset_21day
ORDER BY day_number;

-- 4. Get curriculum grouped by week for weekly view
-- Week 1: days 1-7, Week 2: days 8-14, Week 3: days 15-21
SELECT
  CEIL(day_number::decimal / 7) AS week_number,
  json_agg(
    json_build_object(
      'day_number', day_number,
      'title', title,
      'key_theme', key_theme,
      'motivational_keynote', motivational_keynote,
      'how_to_implement', how_to_implement,
      'three_actions', three_actions
    ) ORDER BY day_number
  ) AS days
FROM public.workforce_mindset_21day
GROUP BY week_number
ORDER BY week_number;

-- 5. Get action count per day (for progress tracking)
SELECT
  day_number,
  title,
  jsonb_array_length(three_actions) AS action_count
FROM public.workforce_mindset_21day
ORDER BY day_number;
