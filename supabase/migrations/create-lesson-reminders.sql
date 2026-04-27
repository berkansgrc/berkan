-- Ders hatırlatıcı tercihleri
-- Supabase SQL Editor'da çalıştırın

CREATE TABLE IF NOT EXISTS lesson_reminders (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_enabled      BOOLEAN DEFAULT TRUE,
  remind_before_minutes INTEGER DEFAULT 30,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE lesson_reminders ENABLE ROW LEVEL SECURITY;

-- Kullanıcı kendi tercihini okuyabilir
CREATE POLICY "reminders_read_own" ON lesson_reminders
  FOR SELECT USING (user_id = auth.uid());

-- Kullanıcı kendi tercihini oluşturabilir/güncelleyebilir
CREATE POLICY "reminders_write_own" ON lesson_reminders
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Admin tüm tercihleri okuyabilir (hatırlatma gönderimi için)
CREATE POLICY "reminders_admin_read" ON lesson_reminders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
