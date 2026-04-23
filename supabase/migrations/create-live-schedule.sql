-- Live Schedule Table
CREATE TABLE IF NOT EXISTS live_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_name TEXT NOT NULL,
    lesson_time TEXT NOT NULL,
    topic TEXT NOT NULL,
    level TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE live_schedule ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access for live_schedule" ON live_schedule
    FOR SELECT USING (true);

-- Admin write access
CREATE POLICY "Admin full access for live_schedule" ON live_schedule
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Initial Data
INSERT INTO live_schedule (day_name, lesson_time, topic, level, display_order)
VALUES 
('Pazartesi', '19:30', 'Fonksiyonlar ve Grafikler', '10. Sınıf', 1),
('Salı', '20:00', 'Logaritma ve Diziler', '12. Sınıf', 2),
('Perşembe', '19:30', 'Çember ve Daire', 'Geometri', 3),
('Cumartesi', '21:00', 'Limit ve Süreklilik', 'Mezun', 4);
