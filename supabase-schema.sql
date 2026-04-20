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
  share_code       TEXT UNIQUE DEFAULT substr(md5(random()::text), 1, 8),
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

-- Profiles: Herkes kendi profilini okur, admin hepsini okur
-- NOT: auth.jwt() kullanarak profiles tablosuna tekrar sorgu atmıyoruz (sonsuz döngü engellenir)
DROP POLICY IF EXISTS "profiles_self_read" ON profiles;
CREATE POLICY "profiles_self_read" ON profiles
  FOR SELECT USING (
    id = auth.uid()
    OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
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
    created_by = auth.uid() OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Questions: Sınav sahipleri sorularını yönetir
DROP POLICY IF EXISTS "questions_exam_owner" ON questions;
CREATE POLICY "questions_exam_owner" ON questions
  FOR ALL USING (
    exam_id IN (
      SELECT id FROM exams WHERE
        created_by = auth.uid() OR
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
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
    user_id = auth.uid() OR
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'teacher')
  );

DROP POLICY IF EXISTS "results_insert" ON exam_results;
CREATE POLICY "results_insert" ON exam_results
  FOR INSERT WITH CHECK (true);

