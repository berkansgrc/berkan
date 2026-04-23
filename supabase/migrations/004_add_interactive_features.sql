-- Add interactive features to contents table
ALTER TABLE public.contents ADD COLUMN IF NOT EXISTS description_rich TEXT;
ALTER TABLE public.contents ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Create content_quizzes table
CREATE TABLE IF NOT EXISTS public.content_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES public.contents(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of strings e.g. ["A", "B", "C", "D"]
  correct_option_index INTEGER NOT NULL,
  explanation TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create content_questions table (Q&A)
CREATE TABLE IF NOT EXISTS public.content_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES public.contents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  answer_text TEXT,
  answered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create content_views table (Analytics)
CREATE TABLE IF NOT EXISTS public.content_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES public.contents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL if anonymous/guest
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.content_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_views ENABLE ROW LEVEL SECURITY;

-- Allow public read-only access on quizzes
CREATE POLICY "Allow public read-only access on content_quizzes" ON public.content_quizzes FOR SELECT USING (true);

-- Allow public read-only access on questions
CREATE POLICY "Allow public read-only access on content_questions" ON public.content_questions FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert questions" ON public.content_questions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow anyone to insert views (analytics)
CREATE POLICY "Allow public insert on content_views" ON public.content_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin select on content_views" ON public.content_views FOR SELECT USING (true); -- For now, true, since we fetch with service key anyway in admin
