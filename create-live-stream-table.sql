-- Canlı ders konfigürasyon tablosu
-- Bu tabloyu Supabase SQL Editor'da çalıştırın

CREATE TABLE IF NOT EXISTS live_stream_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  youtube_video_id TEXT,
  youtube_chat_id TEXT,
  is_live BOOLEAN DEFAULT FALSE,
  lesson_title TEXT,
  lesson_description TEXT,
  viewer_count INTEGER DEFAULT 0,
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Yalnızca tek bir satır olacak şekilde constraint ekle (singleton pattern)
-- Birden fazla ekleme yapılmasını önlemek için UNIQUE bir constraint
-- Bu tabloyu manuel olarak bir satırla başlatıyoruz:
INSERT INTO live_stream_config (
  youtube_video_id,
  youtube_chat_id,
  is_live,
  lesson_title,
  lesson_description
) VALUES (
  NULL,
  NULL,
  FALSE,
  'Canlı Ders',
  'Yakında canlı ders başlayacak.'
);

-- RLS Politikaları
ALTER TABLE live_stream_config ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir (herkese açık yayın sayfası için)
CREATE POLICY "live_stream_config_read_all" ON live_stream_config
  FOR SELECT USING (true);

-- Sadece admin güncelleyebilir
CREATE POLICY "live_stream_config_admin_write" ON live_stream_config
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
