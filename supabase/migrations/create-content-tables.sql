-- Drop old tables if they exist
DROP TABLE IF EXISTS public.lessons CASCADE;
DROP TABLE IF EXISTS public.topics CASCADE;
DROP TABLE IF EXISTS public.grades CASCADE;

-- 1. Courses Table (Sınıfların altındaki dersler: Matematik, Geometri vb.)
CREATE TABLE public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    grade_slug TEXT NOT NULL, -- '5-sinif', 'lgs', 'tyt-ayt' vb.
    name TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Topics Table (Derslerin altındaki konular: Kümeler, Çarpanlar vb.)
CREATE TABLE public.topics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Contents Table (Konunun içindeki Döküman, Uygulama, Video)
CREATE TABLE public.contents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    video_url TEXT,
    drive_file_url TEXT,
    app_url TEXT,
    is_published BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS (Row Level Security)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contents ENABLE ROW LEVEL SECURITY;

-- Öğrenciler (ve anonim kullanıcılar) için sadece görüntüleme izinleri
CREATE POLICY "Allow public read-only access on courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access on topics"  ON public.topics  FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access on contents" ON public.contents FOR SELECT USING (true);

-- Admin için Service Role Policy (Zaten Supabase Service Role Key bypass ediyor, 
-- ancak admin authenticate edilmişse diye genelde JWT role=authenticated da eklenebilir.
-- Bu projede işlem yaparken Service Role Key ile sunucu taraflı güvenli eksiği kapattık).
