-- ============================================================
-- 003_seed_programs.sql
-- Seeds all program data: categories, programs, features,
-- phases, and pricing tiers for Transformer Hub Institute
-- ============================================================

-- Categories
INSERT INTO public.categories (id, slug, label, sort_order) VALUES
  ('9d13d5d3-a3de-4192-b3a5-f7f6445e7a5c', 'all', 'All Programs', 0),
  ('3d9a6429-0e37-4739-99aa-073cd68c712e', 'executive', 'Executive', 1),
  ('efb0e950-29d2-4df6-b295-4a211a3de74f', 'workforce', 'Workforce', 2),
  ('780534bd-dd3a-44bb-8191-79099a484baf', 'faith', 'Faith', 3),
  ('c8a65721-bf2a-467a-a2d6-ddde7c046e7c', 'youth', 'Youth', 4),
  ('3f5ccb22-d580-4780-a844-ffab5c18fd71', 'enterprise', 'Enterprise', 5)
ON CONFLICT (id) DO NOTHING;

-- Programs
INSERT INTO public.programs (id, slug, name, tagline, short_description, long_description, category, category_slug, color, badge, duration, audience, leaders, sort_order, is_active) VALUES
  (
    '5fd75a32-24ba-445d-b13a-12df04e45bd4',
    'signal-90',
    'Leadership Reboot SIGNAL™ 90-Day Framework',
    '90-Day Leadership Transformation',
    'A 90-day guided system using the SIGNAL™ framework, micro-content, daily reflection, and performance-aligned action to elevate senior executives.',
    'Transformer Hub Institute SIGNAL™ is a 90-day guided system that uses the SIGNAL™ framework, micro-content, daily reflection, and performance-aligned action to elevate senior executives and top industry leaders. Designed to take the mindset shifts we discover in our workshops and turn them into permanent habits.',
    'Executive',
    'executive',
    '#0d9488',
    'Flagship',
    '90 Days',
    'Senior Executives',
    '["Satya Nadella","Jensen Huang","Howard Schultz","Tim Cook","Reed Hastings","Pat Gelsinger","Ray Dalio","Bob Iger","Karen Lynch","Jamie Dimon","Mary Barra","Sundar Pichai","Ginni Rometty","Jeff Bezos"]',
    1,
    true
  ),
  (
    '9bd03989-26a5-4dc7-b818-37337c1d179c',
    'workforce-ready',
    'Workforce Ready™',
    '21-Day Workforce Acceleration',
    'A 21-day accelerated program preparing graduates and early-career professionals with essential workforce skills, mindset, and confidence.',
    'Workforce Ready is a 21-day intensive designed for graduates and early-career professionals. Build essential communication, leadership, and career readiness skills through daily micro-lessons, reflection prompts, and real-world action steps.',
    'Workforce',
    'workforce',
    '#2563eb',
    'Popular',
    '21 Days',
    'Graduates & Early-Career',
    '[]',
    2,
    true
  ),
  (
    '2ffd8e2c-afb7-4a5b-8be5-ed8b9b3bdb59',
    'enterprise-signal',
    'Enterprise SIGNAL™ Cohort',
    'Team-Based Leadership Development',
    'A customizable cohort-based program for organizations seeking to develop leadership capacity at scale.',
    'Enterprise SIGNAL brings the power of the SIGNAL framework to your entire organization. Customizable cohorts, manager dashboards, and enterprise-grade security make it easy to develop leadership at scale.',
    'Enterprise',
    'enterprise',
    '#7c3aed',
    'Enterprise',
    'Custom',
    'Organizations & Teams',
    '[]',
    3,
    true
  ),
  (
    '28e3b7c4-4ae3-4ae2-a91e-cb66c11e3f15',
    'faith-and-leadership',
    'Faith & Leadership Pathway',
    'Purpose-Driven Leadership',
    'A faith-integrated leadership journey combining biblical principles with modern leadership frameworks.',
    'The Faith & Leadership Pathway integrates timeless biblical wisdom with the SIGNAL framework. Designed for ministry leaders, church teams, and faith-driven professionals who want to lead with purpose, integrity, and spiritual alignment.',
    'Faith',
    'faith',
    '#d97706',
    'New',
    '40 Days',
    'Ministry & Faith Leaders',
    '[]',
    4,
    true
  ),
  (
    '0e716d55-5285-457e-9d3e-cc1abb03ced6',
    'youth-leadership',
    'Youth Leadership Launchpad',
    'Empowering Next-Gen Leaders',
    'A 30-day interactive program designed for young leaders aged 14-21 to build confidence, character, and leadership skills.',
    'Youth Leadership Launchpad is a 30-day interactive experience designed for teens and young adults. Through gamified challenges, peer community, and mentorship prompts, participants develop emotional intelligence, public speaking skills, and a personal leadership identity.',
    'Youth',
    'youth',
    '#e11d48',
    'Coming Soon',
    '30 Days',
    'Ages 14-21',
    '[]',
    5,
    true
  )
ON CONFLICT (id) DO NOTHING;

-- Program Phases (SIGNAL framework)
-- Leadership Reboot SIGNAL 90-Day
INSERT INTO public.program_phases (id, program_id, letter, name, days, description, sort_order) VALUES
  ('5dcd2720-95c2-46eb-a50a-8d877f77bd96', '5fd75a32-24ba-445d-b13a-12df04e45bd4', 'S', 'Self-Awareness', 'Days 1-15', 'Understand your mental patterns and leadership triggers', 1),
  ('a0fb2381-9b0d-46ef-9526-c013ad6c6340', '5fd75a32-24ba-445d-b13a-12df04e45bd4', 'I', 'Interpretation', 'Days 16-30', 'Reframe challenges as opportunities for growth', 2),
  ('e2305198-07ec-4fbc-8dd5-ee388dfdda14', '5fd75a32-24ba-445d-b13a-12df04e45bd4', 'G', 'Goals & Strategy', 'Days 31-45', 'Align vision with actionable strategic intent', 3),
  ('b856e44f-4332-4b18-bdd7-33d915ff5fe6', '5fd75a32-24ba-445d-b13a-12df04e45bd4', 'N', 'Navigation', 'Days 46-60', 'Lead through complexity and organizational change', 4),
  ('9c46e902-fff2-458d-b5a7-dd51fe9170d3', '5fd75a32-24ba-445d-b13a-12df04e45bd4', 'A', 'Action & Execution', 'Days 61-75', 'Drive results with decisive leadership action', 5),
  ('9ffd7fc8-1611-433e-852a-615272dd5b64', '5fd75a32-24ba-445d-b13a-12df04e45bd4', 'L', 'Legacy & Impact', 'Days 76-90', 'Build lasting impact and develop future leaders', 6)
ON CONFLICT (id) DO NOTHING;

-- Workforce Ready phases
INSERT INTO public.program_phases (id, program_id, letter, name, days, description, sort_order) VALUES
  ('d5c0b49e-9e38-41c9-80f5-f53b8b69d1fb', '9bd03989-26a5-4dc7-b818-37337c1d179c', 'F', 'Foundation', 'Days 1-7', 'Build professional identity and ownership mindset', 1),
  ('efe1309e-6bb0-4b55-a6a6-33e3d03a64e6', '9bd03989-26a5-4dc7-b818-37337c1d179c', 'A', 'Acceleration', 'Days 8-14', 'Develop resilience and strategic thinking', 2),
  ('05f71e1b-0e1f-4750-abf7-8e2a1ded3e54', '9bd03989-26a5-4dc7-b818-37337c1d179c', 'L', 'Launch Ready', 'Days 15-21', 'Master executive presence and career launch', 3)
ON CONFLICT (id) DO NOTHING;

-- Enterprise SIGNAL phases
INSERT INTO public.program_phases (id, program_id, letter, name, days, description, sort_order) VALUES
  ('2f21e7e8-3cdb-4a6e-9e46-f03a4bfecece', '2ffd8e2c-afb7-4a5b-8be5-ed8b9b3bdb59', 'D', 'Discovery', 'Week 1-2', 'Assess organizational leadership gaps and culture', 1),
  ('23e1f71a-7bc3-4a9e-bcc7-b970e094d3b4', '2ffd8e2c-afb7-4a5b-8be5-ed8b9b3bdb59', 'B', 'Build', 'Week 3-6', 'Custom cohort curriculum and team formation', 2),
  ('0c1adb69-f3f0-4c9b-ac15-a2e5b459d54e', '2ffd8e2c-afb7-4a5b-8be5-ed8b9b3bdb59', 'S', 'Scale', 'Week 7-12', 'Roll out across departments with manager dashboards', 3)
ON CONFLICT (id) DO NOTHING;

-- Faith & Leadership phases
INSERT INTO public.program_phases (id, program_id, letter, name, days, description, sort_order) VALUES
  ('eb3e42c9-4697-4e3e-889c-ae7ea20e3d2d', '28e3b7c4-4ae3-4ae2-a91e-cb66c11e3f15', 'R', 'Rooted', 'Days 1-10', 'Ground your leadership in biblical principles', 1),
  ('bc2e8bdf-ecdd-4a16-af75-a19816d80a3e', '28e3b7c4-4ae3-4ae2-a91e-cb66c11e3f15', 'R', 'Rising', 'Days 11-25', 'Apply faith-driven decision making to real challenges', 2),
  ('a2568ec7-4cca-47d6-916d-7f0b2efa5cef', '28e3b7c4-4ae3-4ae2-a91e-cb66c11e3f15', 'R', 'Releasing', 'Days 26-40', 'Multiply your impact through servant leadership', 3)
ON CONFLICT (id) DO NOTHING;

-- Youth Leadership phases
INSERT INTO public.program_phases (id, program_id, letter, name, days, description, sort_order) VALUES
  ('c87397f3-b8b0-41e0-a540-6b4e4d0f1aab', '0e716d55-5285-457e-9d3e-cc1abb03ced6', 'I', 'Identity', 'Days 1-10', 'Discover your strengths and leadership style', 1),
  ('f64b1789-6a7e-476e-8e05-cc3b00df6da4', '0e716d55-5285-457e-9d3e-cc1abb03ced6', 'G', 'Growth', 'Days 11-20', 'Build communication and emotional intelligence', 2),
  ('edf29fe2-3ca7-4327-afcf-a4ceee13c34b', '0e716d55-5285-457e-9d3e-cc1abb03ced6', 'L', 'Launch', 'Days 21-30', 'Create your personal leadership action plan', 3)
ON CONFLICT (id) DO NOTHING;

-- Program Features
-- Youth Leadership Launchpad
INSERT INTO public.program_features (id, program_id, icon, title, description, sort_order) VALUES
  ('f7283dc7-75b2-4d3b-a303-db5cba5d3951', '0e716d55-5285-457e-9d3e-cc1abb03ced6', 'Zap', 'Interactive Challenges', 'Engaging daily activities designed to build confidence and leadership habits.', 1),
  ('9e6ff876-177c-4603-a47c-16f19ad70699', '0e716d55-5285-457e-9d3e-cc1abb03ced6', 'Users', 'Peer Community', 'Connect with a supportive community of young leaders on the same journey.', 2),
  ('0a2c2e53-178a-48c5-9160-c9cbaa4e8f0f', '0e716d55-5285-457e-9d3e-cc1abb03ced6', 'MessageSquare', 'Mentorship Access', 'Guided mentorship prompts and peer accountability partnerships.', 3),
  ('e255ed12-2e62-4e29-b96c-1dd3a5111085', '0e716d55-5285-457e-9d3e-cc1abb03ced6', 'Lightbulb', 'Emotional Intelligence', 'Develop self-awareness, empathy, and conflict resolution skills.', 4),
  ('a964ba7a-b895-49ff-a011-7d472b024ca3', '0e716d55-5285-457e-9d3e-cc1abb03ced6', 'TrendingUp', 'Progress Badges', 'Earn badges and track progress with gamified milestones.', 5)
ON CONFLICT (id) DO NOTHING;

-- Faith & Leadership
INSERT INTO public.program_features (id, program_id, icon, title, description, sort_order) VALUES
  ('f9073a86-3e9c-46c7-aab2-f1575e1b7deb', '28e3b7c4-4ae3-4ae2-a91e-cb66c11e3f15', 'BookOpen', 'Scripture Integration', 'Daily leadership lessons grounded in biblical wisdom and practical application.', 1),
  ('d0d4ae82-4a80-4c73-baa8-d8a4bde4bb22', '28e3b7c4-4ae3-4ae2-a91e-cb66c11e3f15', 'Heart', 'Servant Leadership', 'Learn to lead with humility, compassion, and purpose-driven conviction.', 2),
  ('adf94cda-30e2-4b86-87ad-ffa17e2e4e9a', '28e3b7c4-4ae3-4ae2-a91e-cb66c11e3f15', 'Users', 'Ministry Teams', 'Tools and frameworks designed for church leaders and ministry team development.', 3),
  ('1cf7e1b1-e098-457b-b5c4-3cddbb7e8c85', '28e3b7c4-4ae3-4ae2-a91e-cb66c11e3f15', 'Compass', 'Values Alignment', 'Align your professional decisions with your core faith values.', 4),
  ('3da66afa-71aa-4fb1-80f2-4511d94c8a5e', '28e3b7c4-4ae3-4ae2-a91e-cb66c11e3f15', 'Lightbulb', 'Reflection Journals', 'Guided spiritual and leadership reflection prompts for deeper insight.', 5)
ON CONFLICT (id) DO NOTHING;

-- Enterprise SIGNAL
INSERT INTO public.program_features (id, program_id, icon, title, description, sort_order) VALUES
  ('c5b2b2c1-9771-4fb0-bab7-ad4e0e7f9e9e', '2ffd8e2c-afb7-4a5b-8be5-ed8b9b3bdb59', 'Building2', 'Cohort Management', 'Organize teams into cohorts with dedicated facilitators and custom timelines.', 1),
  ('15b4c68c-1d73-4a9e-bad1-f32eea63f70d', '2ffd8e2c-afb7-4a5b-8be5-ed8b9b3bdb59', 'BarChart3', 'Analytics Dashboard', 'Real-time leadership development metrics with manager roll-up reports.', 2),
  ('0f3b5f83-c576-4b8f-a7b5-b15f2d6fde5f', '2ffd8e2c-afb7-4a5b-8be5-ed8b9b3bdb59', 'Shield', 'Enterprise Security', 'SSO integration, data encryption, and compliance-ready infrastructure.', 3),
  ('2c7f6a1e-a3d1-4d27-b8e4-fd2a2b5c6d3e', '2ffd8e2c-afb7-4a5b-8be5-ed8b9b3bdb59', 'Puzzle', 'LMS Integration', 'Seamless integration with existing learning management systems.', 4),
  ('d8e4f2a1-b5c6-4d3e-a7f8-9c1b2d3e4f5a', '2ffd8e2c-afb7-4a5b-8be5-ed8b9b3bdb59', 'Headphones', 'Concierge Support', 'Dedicated account manager and priority support for your organization.', 5)
ON CONFLICT (id) DO NOTHING;

-- Leadership Reboot SIGNAL 90-Day
INSERT INTO public.program_features (id, program_id, icon, title, description, sort_order) VALUES
  ('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', '5fd75a32-24ba-445d-b13a-12df04e45bd4', 'Brain', 'SIGNAL™ Framework', 'Six-phase leadership transformation system backed by behavioral science.', 1),
  ('b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', '5fd75a32-24ba-445d-b13a-12df04e45bd4', 'Target', 'Daily Micro-Actions', 'Bite-sized daily actions that compound into transformational leadership habits.', 2),
  ('c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', '5fd75a32-24ba-445d-b13a-12df04e45bd4', 'TrendingUp', 'Executive Coaching', 'Access to executive coaching prompts and peer accountability groups.', 3),
  ('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', '5fd75a32-24ba-445d-b13a-12df04e45bd4', 'Award', 'Digital Credentials', 'Earn verified digital credentials upon completing each SIGNAL phase.', 4),
  ('e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', '5fd75a32-24ba-445d-b13a-12df04e45bd4', 'Sparkles', 'AI Insights', 'Personalized leadership insights powered by AI analysis of your reflections.', 5)
ON CONFLICT (id) DO NOTHING;

-- Workforce Ready
INSERT INTO public.program_features (id, program_id, icon, title, description, sort_order) VALUES
  ('f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c', '9bd03989-26a5-4dc7-b818-37337c1d179c', 'Briefcase', 'Career Readiness', 'Practical frameworks for interviews, networking, and workplace navigation.', 1),
  ('a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d', '9bd03989-26a5-4dc7-b818-37337c1d179c', 'MessageSquare', 'Communication Skills', 'Master professional communication, email etiquette, and presentation skills.', 2),
  ('b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e', '9bd03989-26a5-4dc7-b818-37337c1d179c', 'Users', 'Peer Accountability', 'Connect with fellow participants for motivation and shared learning.', 3),
  ('c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', '9bd03989-26a5-4dc7-b818-37337c1d179c', 'CheckCircle', 'Daily Action Steps', 'Three actionable steps each day to apply what you learn immediately.', 4),
  ('d0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', '9bd03989-26a5-4dc7-b818-37337c1d179c', 'Award', 'Completion Certificate', 'Earn a verified WorkforceReady credential upon completing all 21 days.', 5)
ON CONFLICT (id) DO NOTHING;

-- Program Pricing
-- Youth Leadership
INSERT INTO public.program_pricing (id, program_id, tier, name, subtitle, price, original_price, price_note, features, cta_label, cta_href, highlighted, sort_order) VALUES
  ('04b203c0-7cf4-4882-84dd-4e199588ae15', '0e716d55-5285-457e-9d3e-cc1abb03ced6', 'Individual', 'Youth Access', '30-Day Youth Empowerment Program', '$19', NULL, 'one-time payment', '["30-day guided curriculum","Daily interactive challenges","Peer community access","Mentorship prompts","Progress badges","Digital Leadership Portfolio"]', 'Get Started', '/signin', false, 1),
  ('25670953-11d7-4f8b-ac83-1eb92fb626ad', '0e716d55-5285-457e-9d3e-cc1abb03ced6', 'Organization', 'School/Org License', 'For schools & youth organizations', NULL, NULL, NULL, '["Everything in Youth Access, plus:","Bulk enrollment management","Instructor/mentor dashboard","Custom branding","Parent progress reports","Priority support"]', 'Contact Sales', '/organizations', true, 2)
ON CONFLICT (id) DO NOTHING;

-- Enterprise SIGNAL
INSERT INTO public.program_pricing (id, program_id, tier, name, subtitle, price, original_price, price_note, features, cta_label, cta_href, highlighted, sort_order) VALUES
  ('c1629a16-5ded-4be6-8a7d-d609624a3add', '2ffd8e2c-afb7-4a5b-8be5-ed8b9b3bdb59', 'Enterprise', 'Enterprise License', 'Custom pricing for your organization', NULL, NULL, NULL, '["Custom curriculum design","Dedicated cohort facilitation","Manager roll-up dashboards","SSO & enterprise security","LMS integration","Performance analytics","Concierge support"]', 'Contact Sales', '/organizations', true, 1)
ON CONFLICT (id) DO NOTHING;

-- Faith & Leadership
INSERT INTO public.program_pricing (id, program_id, tier, name, subtitle, price, original_price, price_note, features, cta_label, cta_href, highlighted, sort_order) VALUES
  ('e24e4dc6-16c7-491e-a2d7-da6fe1be4e4c', '28e3b7c4-4ae3-4ae2-a91e-cb66c11e3f15', 'Individual', 'Personal Journey', '40-Day Faith & Leadership Program', '$39', NULL, 'one-time payment', '["40-day scripture-integrated curriculum","Daily reflection journals","Servant leadership frameworks","Values alignment exercises","Digital credential"]', 'Get Started', '/signin', false, 1),
  ('39a23fb2-d2ca-4f73-8be3-85c308ab3e0f', '28e3b7c4-4ae3-4ae2-a91e-cb66c11e3f15', 'Church', 'Church License', 'For churches & ministry teams', NULL, NULL, NULL, '["Everything in Personal Journey, plus:","Ministry team management","Custom devotional content","Church branding","Group facilitation tools","Dedicated support"]', 'Contact Sales', '/organizations', true, 2)
ON CONFLICT (id) DO NOTHING;

-- Leadership Reboot SIGNAL 90-Day
INSERT INTO public.program_pricing (id, program_id, tier, name, subtitle, price, original_price, price_note, features, cta_label, cta_href, highlighted, sort_order) VALUES
  ('51f6c2d8-2e48-4f4f-8c4d-67e10f4cb7f2', '5fd75a32-24ba-445d-b13a-12df04e45bd4', 'Individual', 'Executive Access', '90-Day SIGNAL™ Leadership Program', '$197', '$297', 'one-time payment', '["Full 90-day SIGNAL™ curriculum","Daily micro-actions & reflections","Executive coaching prompts","Peer accountability group","6 digital phase credentials","AI-powered leadership insights"]', 'Get Started', '/signin', false, 1),
  ('1a67f8b3-d49e-4c7a-9f5b-23a1b4c5d6e7', '5fd75a32-24ba-445d-b13a-12df04e45bd4', 'Team', 'Team License', 'For leadership teams (5-20 people)', '$147', '$247', 'per person', '["Everything in Executive Access, plus:","Team progress dashboard","Group facilitation guide","Custom branding","Priority support","Bulk enrollment"]', 'Contact Sales', '/organizations', true, 2),
  ('2b78a9c4-e5af-4d8b-0a6c-34b2c5d6e7f8', '5fd75a32-24ba-445d-b13a-12df04e45bd4', 'Enterprise', 'Enterprise', 'Unlimited seats, custom deployment', NULL, NULL, NULL, '["Everything in Team License, plus:","Unlimited enrollments","SSO & enterprise security","LMS integration","Dedicated account manager","Custom curriculum modules","Performance analytics"]', 'Contact Sales', '/organizations', false, 3)
ON CONFLICT (id) DO NOTHING;

-- Workforce Ready
INSERT INTO public.program_pricing (id, program_id, tier, name, subtitle, price, original_price, price_note, features, cta_label, cta_href, highlighted, sort_order) VALUES
  ('3c89b0d5-f6ba-4e9c-1b7d-45c3d6e7f8a9', '9bd03989-26a5-4dc7-b818-37337c1d179c', 'Individual', 'Individual', '21-Day Workforce Acceleration', '$49', '$79', 'one-time payment', '["Full 21-day curriculum","Daily keynotes & implementation guides","3 action steps per day","Progress tracking & streaks","Digital completion credential","Peer community access"]', 'Get Started', '/signin', false, 1),
  ('4d9ac1e6-a7cb-4fad-2c8e-56d4e7f8a9b0', '9bd03989-26a5-4dc7-b818-37337c1d179c', 'Institutional', 'Institution License', 'For schools, bootcamps & career centers', NULL, NULL, NULL, '["Everything in Individual, plus:","Bulk enrollment management","Instructor dashboard","Custom branding","Student progress reports","Priority support"]', 'Contact Sales', '/organizations', true, 2)
ON CONFLICT (id) DO NOTHING;
