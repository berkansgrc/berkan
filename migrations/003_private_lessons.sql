CREATE TABLE IF NOT EXISTS public.private_lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    meet_url TEXT,
    student_id UUID REFERENCES public.profiles(id) DEFAULT NULL,
    target_group TEXT DEFAULT NULL,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.private_lessons ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi birebir derslerini, genel grup derslerini (student_id = NULL) okuyabilir.
-- Admin ve öğretmen tüm dersleri okuyabilir.
CREATE POLICY "Allow users to see their lessons and group lessons" 
    ON public.private_lessons 
    FOR SELECT 
    USING (
        student_id = auth.uid() OR
        student_id IS NULL OR
        (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'teacher')
    );
