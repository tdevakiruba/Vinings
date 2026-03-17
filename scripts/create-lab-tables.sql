-- Create office_hours table
CREATE TABLE IF NOT EXISTS office_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  meeting_url TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create lab_submissions table
CREATE TABLE IF NOT EXISTS lab_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  office_hours_id UUID REFERENCES office_hours(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN ('career-challenge', 'workplace-conflict', 'leadership-dilemma', 'professional-growth')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'selected', 'discussed', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_lab_submissions_user ON lab_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_lab_submissions_program ON lab_submissions(program_id);
CREATE INDEX IF NOT EXISTS idx_office_hours_program ON office_hours(program_id);
CREATE INDEX IF NOT EXISTS idx_office_hours_scheduled ON office_hours(scheduled_at);

-- Enable RLS
ALTER TABLE office_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_submissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for office_hours (everyone enrolled can view)
CREATE POLICY "Anyone can view office hours" ON office_hours
  FOR SELECT USING (true);

-- RLS policies for lab_submissions
CREATE POLICY "Users can view their own submissions" ON lab_submissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own submissions" ON lab_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions" ON lab_submissions
  FOR UPDATE USING (auth.uid() = user_id);

-- Seed a sample office hours session for workforce-ready
INSERT INTO office_hours (program_id, title, description, meeting_url, scheduled_at, duration_minutes, status)
SELECT 
  p.id,
  'Workforce Ready Decision Lab Office Hours',
  'Bring your toughest career challenges and professional dilemmas. Get expert guidance and peer feedback in a supportive environment.',
  'https://zoom.us/j/example',
  (now() + interval '5 days')::timestamptz,
  60,
  'scheduled'
FROM programs p
WHERE p.slug = 'workforce-ready'
ON CONFLICT DO NOTHING;
