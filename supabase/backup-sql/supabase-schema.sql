-- ============================================================
-- Adım 1: profiles tablosu
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  TEXT,
  role       TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'teacher', 'student')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Yeni kayıt olunca otomatik profil oluştur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Adım 2: exams tablosu
-- ============================================================
CREATE TABLE IF NOT EXISTS exams (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT NOT NULL,
  description      TEXT,
  duration_minutes INT NOT NULL DEFAULT 40,
  created_by       UUID REFERENCES profiles(id),
  access_mode      TEXT NOT NULL DEFAULT 'private' CHECK (access_mode IN ('public', 'private')),
  share_code       TEXT UNIQUE DEFAULT upper(substr(md5(random()::text), 1, 9)),
  is_published     BOOLEAN DEFAULT false,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Adım 3: questions tablosu
-- ============================================================
CREATE TABLE IF NOT EXISTS questions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id        UUID REFERENCES exams(id) ON DELETE CASCADE,
  body           TEXT NOT NULL,
  option_count   INT NOT NULL DEFAULT 4 CHECK (option_count IN (4, 5)),
  options        JSONB NOT NULL,
  correct_option TEXT NOT NULL,
  order_index    INT NOT NULL,
  image_url      TEXT,
  created_at     TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Adım 4: exam_results tablosu
-- ============================================================
CREATE TABLE IF NOT EXISTS exam_results (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id      UUID REFERENCES exams(id),
  user_id      UUID REFERENCES profiles(id),
  guest_name   TEXT,
  answers      JSONB NOT NULL DEFAULT '{}',
  score        NUMERIC,
  correct      INT,
  wrong        INT,
  blank        INT,
  started_at   TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Adım 5: RLS Politikaları
-- ============================================================
ALTER TABLE profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams         ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results  ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Güvenli Rol Kontrol Fonksiyonları
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_teacher_or_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher')
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

-- Profiles: Herkes kendi profilini okur, admin hepsini okur
DROP POLICY IF EXISTS "profiles_self_read" ON profiles;
CREATE POLICY "profiles_self_read" ON profiles
  FOR SELECT USING (
    id = auth.uid() OR public.is_admin()
  );

DROP POLICY IF EXISTS "profiles_self_update" ON profiles;
CREATE POLICY "profiles_self_update" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- Exams: Public sınavlar herkes okuyabilir
DROP POLICY IF EXISTS "exams_public_read" ON exams;
CREATE POLICY "exams_public_read" ON exams
  FOR SELECT USING (access_mode = 'public' AND is_published = true);

-- Exams: Öğretmen kendi sınavlarını yönetir, admin hepsini
DROP POLICY IF EXISTS "exams_owner_all" ON exams;
CREATE POLICY "exams_owner_all" ON exams
  FOR ALL USING (
    created_by = auth.uid() OR public.is_admin()
  );

-- Questions: Sınav sahipleri sorularını yönetir
DROP POLICY IF EXISTS "questions_exam_owner" ON questions;
CREATE POLICY "questions_exam_owner" ON questions
  FOR ALL USING (
    exam_id IN (
      SELECT id FROM exams WHERE created_by = auth.uid() OR public.is_admin()
    )
  );

-- Questions: Public sınav soruları herkese açık
DROP POLICY IF EXISTS "questions_public_read" ON questions;
CREATE POLICY "questions_public_read" ON questions
  FOR SELECT USING (
    exam_id IN (SELECT id FROM exams WHERE access_mode = 'public' AND is_published = true)
  );

-- Exam results: Kullanıcı kendi sonuçlarını okur, öğretmen/admin hepsini
DROP POLICY IF EXISTS "results_self_read" ON exam_results;
CREATE POLICY "results_self_read" ON exam_results
  FOR SELECT USING (
    user_id = auth.uid() OR public.is_teacher_or_admin()
  );

DROP POLICY IF EXISTS "results_insert" ON exam_results;
CREATE POLICY "results_insert" ON exam_results
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- Adım 6: Canlı Ders Etkileşim Tabloları
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

-- RLS: Canlı anketler
ALTER TABLE live_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_question_upvotes ENABLE ROW LEVEL SECURITY;

-- Anketler: Herkes okuyabilir, admin/teacher oluşturur
DROP POLICY IF EXISTS "polls_read" ON live_polls;
CREATE POLICY "polls_read" ON live_polls FOR SELECT USING (true);

DROP POLICY IF EXISTS "polls_admin_all" ON live_polls;
CREATE POLICY "polls_admin_all" ON live_polls FOR ALL USING (
  public.is_teacher_or_admin()
);

-- Anket oyları: Herkes kendi oyunu verir, sonuçlar herkese açık
DROP POLICY IF EXISTS "poll_votes_read" ON live_poll_votes;
CREATE POLICY "poll_votes_read" ON live_poll_votes FOR SELECT USING (true);

DROP POLICY IF EXISTS "poll_votes_insert" ON live_poll_votes;
CREATE POLICY "poll_votes_insert" ON live_poll_votes FOR INSERT WITH CHECK (user_id = auth.uid());

-- Sorular: Herkes okur, giriş yapmış herkes yazar
DROP POLICY IF EXISTS "questions_read" ON live_questions;
CREATE POLICY "questions_read" ON live_questions FOR SELECT USING (true);

DROP POLICY IF EXISTS "questions_insert" ON live_questions;
CREATE POLICY "questions_insert" ON live_questions FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "questions_admin_update" ON live_questions;
CREATE POLICY "questions_admin_update" ON live_questions FOR UPDATE USING (
  user_id = auth.uid() OR public.is_teacher_or_admin()
);

-- Upvote'lar: Herkes okur, giriş yapmış herkes verir
DROP POLICY IF EXISTS "upvotes_read" ON live_question_upvotes;
CREATE POLICY "upvotes_read" ON live_question_upvotes FOR SELECT USING (true);

DROP POLICY IF EXISTS "upvotes_insert" ON live_question_upvotes;
CREATE POLICY "upvotes_insert" ON live_question_upvotes FOR INSERT WITH CHECK (user_id = auth.uid());

-- Supabase Realtime: Bu tabloları realtime'a ekle
ALTER PUBLICATION supabase_realtime ADD TABLE live_polls;
ALTER PUBLICATION supabase_realtime ADD TABLE live_poll_votes;
ALTER PUBLICATION supabase_realtime ADD TABLE live_questions;
