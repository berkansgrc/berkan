-- 1. Add is_private to private_lessons
ALTER TABLE private_lessons ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT false;

-- 2. Create lesson_participants table
CREATE TABLE IF NOT EXISTS lesson_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES private_lessons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(lesson_id, user_id)
);

-- 3. Enable RLS
ALTER TABLE lesson_participants ENABLE ROW LEVEL SECURITY;

-- 4. Add policies for lesson_participants
-- Admins and teachers can manage
CREATE POLICY "Admins and teachers can manage lesson participants"
    ON lesson_participants FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND (profiles.role = 'admin' OR profiles.role = 'teacher')
        )
    );

-- Students can view their own participations
CREATE POLICY "Users can view their own lesson participations"
    ON lesson_participants FOR SELECT
    USING (user_id = auth.uid());

-- 5. Migrate existing private lessons (where student_id is not null)
INSERT INTO lesson_participants (lesson_id, user_id)
SELECT id, student_id
FROM private_lessons
WHERE student_id IS NOT NULL
ON CONFLICT (lesson_id, user_id) DO NOTHING;

-- Note: We can optionally drop the student_id column later once everything works
-- ALTER TABLE private_lessons DROP COLUMN student_id;
