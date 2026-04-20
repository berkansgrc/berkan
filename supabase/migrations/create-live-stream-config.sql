-- Canlı Ders Yapılandırma Tablosu (Live Stream Config)
CREATE TABLE public.live_stream_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    youtube_video_id TEXT,
    youtube_chat_id TEXT,
    is_live BOOLEAN DEFAULT false,
    lesson_title TEXT,
    lesson_description TEXT,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS (Row Level Security) Aktifleştirme
ALTER TABLE public.live_stream_config ENABLE ROW LEVEL SECURITY;

-- Öğrenciler (ve anonim kullanıcılar) için sadece görüntüleme izinleri (SELECT)
CREATE POLICY "Allow public read-only access on live_stream_config" 
    ON public.live_stream_config 
    FOR SELECT 
    USING (true);

-- Not: Ekleme/Güncelleme/Silme işlemleri kod tarafında Service Role Key kullanılarak 
-- RLS politikalarını by-pass edeceği için ekstra bir policy yazmaya gerek yoktur.
