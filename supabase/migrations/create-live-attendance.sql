-- Canlı Ders Katılım Takip Tablosu
-- Bu scripti Supabase SQL Editor'da çalıştırın

CREATE TABLE IF NOT EXISTS live_attendance (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id        TEXT NOT NULL,         -- live_stream_config.lesson_title (benzersiz tanımlayıcı)
  joined_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  left_at          TIMESTAMPTZ,           -- NULL = hala aktif
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_live_attendance_user   ON live_attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_live_attendance_lesson ON live_attendance(lesson_id);
CREATE INDEX IF NOT EXISTS idx_live_attendance_joined ON live_attendance(joined_at DESC);

-- RLS
ALTER TABLE live_attendance ENABLE ROW LEVEL SECURITY;

-- Öğrenci kendi kaydını okuyabilir
CREATE POLICY "attendance_read_own" ON live_attendance
  FOR SELECT USING (user_id = auth.uid());

-- Öğrenci kendi kaydını oluşturabilir
CREATE POLICY "attendance_insert_own" ON live_attendance
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Öğrenci kendi kaydını güncelleyebilir (left_at için)
CREATE POLICY "attendance_update_own" ON live_attendance
  FOR UPDATE USING (user_id = auth.uid());

-- Admin tüm kayıtları okuyabilir
CREATE POLICY "attendance_admin_read" ON live_attendance
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
