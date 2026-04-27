-- In-app bildirim tablosu
-- Supabase SQL Editor'da çalıştırın

CREATE TABLE IF NOT EXISTS in_app_notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('lesson_reminder', 'lesson_started', 'archive_available', 'general')),
  title       TEXT NOT NULL,
  body        TEXT,
  is_read     BOOLEAN DEFAULT FALSE,
  action_url  TEXT,                   -- Tıklandığında yönlendirme
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread
  ON in_app_notifications(user_id, is_read, created_at DESC);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE in_app_notifications;

-- RLS
ALTER TABLE in_app_notifications ENABLE ROW LEVEL SECURITY;

-- Kullanıcı kendi bildirimlerini okuyabilir
CREATE POLICY "notifications_read_own" ON in_app_notifications
  FOR SELECT USING (user_id = auth.uid());

-- Kullanıcı kendi bildirimini güncelleyebilir (okundu işareti)
CREATE POLICY "notifications_update_own" ON in_app_notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Kullanıcı kendi bildirimlerini silebilir
CREATE POLICY "notifications_delete_own" ON in_app_notifications
  FOR DELETE USING (user_id = auth.uid());

-- Admin bildirim oluşturabilir (toplu gönderim için)
CREATE POLICY "notifications_admin_insert" ON in_app_notifications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
