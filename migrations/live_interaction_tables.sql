-- ============================================================
-- Canlı Ders Etkileşim Tabloları
-- ============================================================

-- Canlı anketler (öğretmen oluşturur)
CREATE TABLE IF NOT EXISTS live_polls (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question   TEXT NOT NULL,
  options    JSONB NOT NULL DEFAULT '[]',
  is_active  BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Anket oyları
CREATE TABLE IF NOT EXISTS live_poll_votes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id         UUID REFERENCES live_polls(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES auth.users(id),
  selected_option TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(poll_id, user_id)
);

-- Öğrenci soruları (canlı ders sırasında)
CREATE TABLE IF NOT EXISTS live_questions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id),
  user_name   TEXT NOT NULL DEFAULT 'Anonim',
  question    TEXT NOT NULL,
  upvotes     INT DEFAULT 0,
  is_answered BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Soru upvote'ları
CREATE TABLE IF NOT EXISTS live_question_upvotes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES live_questions(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES auth.users(id),
  UNIQUE(question_id, user_id)
);

-- RLS
ALTER TABLE live_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_question_upvotes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "polls_read" ON live_polls;
CREATE POLICY "polls_read" ON live_polls FOR SELECT USING (true);

DROP POLICY IF EXISTS "polls_admin_all" ON live_polls;
CREATE POLICY "polls_admin_all" ON live_polls FOR ALL USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'teacher')
);

DROP POLICY IF EXISTS "poll_votes_read" ON live_poll_votes;
CREATE POLICY "poll_votes_read" ON live_poll_votes FOR SELECT USING (true);

DROP POLICY IF EXISTS "poll_votes_insert" ON live_poll_votes;
CREATE POLICY "poll_votes_insert" ON live_poll_votes FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "questions_read" ON live_questions;
CREATE POLICY "questions_read" ON live_questions FOR SELECT USING (true);

DROP POLICY IF EXISTS "questions_insert" ON live_questions;
CREATE POLICY "questions_insert" ON live_questions FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "questions_admin_update" ON live_questions;
CREATE POLICY "questions_admin_update" ON live_questions FOR UPDATE USING (
  user_id = auth.uid() OR (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'teacher')
);

DROP POLICY IF EXISTS "upvotes_read" ON live_question_upvotes;
CREATE POLICY "upvotes_read" ON live_question_upvotes FOR SELECT USING (true);

DROP POLICY IF EXISTS "upvotes_insert" ON live_question_upvotes;
CREATE POLICY "upvotes_insert" ON live_question_upvotes FOR INSERT WITH CHECK (user_id = auth.uid());

-- Supabase Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE live_polls;
ALTER PUBLICATION supabase_realtime ADD TABLE live_poll_votes;
ALTER PUBLICATION supabase_realtime ADD TABLE live_questions;
