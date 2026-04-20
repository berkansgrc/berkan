-- =====================================================
-- BU SQL'i Supabase Dashboard > SQL Editor'da çalıştırın
-- Sonsuz döngü (infinite recursion) düzeltmesi
-- =====================================================

-- 1) profiles politikasını düzelt (ASIL SORUN BURADA)
DROP POLICY IF EXISTS "profiles_self_read" ON profiles;
CREATE POLICY "profiles_self_read" ON profiles
  FOR SELECT USING (
    id = auth.uid()
    OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- 2) exams politikasını düzelt
DROP POLICY IF EXISTS "exams_owner_all" ON exams;
CREATE POLICY "exams_owner_all" ON exams
  FOR ALL USING (
    created_by = auth.uid() OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- 3) questions politikasını düzelt
DROP POLICY IF EXISTS "questions_exam_owner" ON questions;
CREATE POLICY "questions_exam_owner" ON questions
  FOR ALL USING (
    exam_id IN (
      SELECT id FROM exams WHERE
        created_by = auth.uid() OR
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    )
  );

-- 4) exam_results politikasını düzelt
DROP POLICY IF EXISTS "results_self_read" ON exam_results;
CREATE POLICY "results_self_read" ON exam_results
  FOR SELECT USING (
    user_id = auth.uid() OR
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'teacher')
  );
