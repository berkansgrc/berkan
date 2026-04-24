-- =========================================================================
-- SECURITY FIX: Remove insecure user_metadata references from RLS policies
-- =========================================================================

-- 1. Create SECURITY DEFINER helper functions to check roles securely
-- SECURITY DEFINER allows the function to run with the privileges of the creator
-- bypassing RLS and avoiding infinite recursion when querying profiles table.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_teacher_or_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher')
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

-- =========================================================================
-- 2. Update all RLS policies referencing user_metadata
-- =========================================================================

-- Profiles: Herkes kendi profilini okur, admin hepsini okur
DROP POLICY IF EXISTS "profiles_self_read" ON profiles;
CREATE POLICY "profiles_self_read" ON profiles
  FOR SELECT USING (
    id = auth.uid() OR public.is_admin()
  );

-- Exams: Öğretmen kendi sınavlarını yönetir, admin hepsini
DROP POLICY IF EXISTS "exams_owner_all" ON exams;
CREATE POLICY "exams_owner_all" ON exams
  FOR ALL USING (
    created_by = auth.uid() OR public.is_admin()
  );

-- Questions: Sınav sahipleri sorularını yönetir
DROP POLICY IF EXISTS "questions_exam_owner" ON questions;
CREATE POLICY "questions_exam_owner" ON questions
  FOR ALL USING (
    exam_id IN (
      SELECT id FROM exams WHERE created_by = auth.uid() OR public.is_admin()
    )
  );

-- Exam results: Kullanıcı kendi sonuçlarını okur, öğretmen/admin hepsini
DROP POLICY IF EXISTS "results_self_read" ON exam_results;
CREATE POLICY "results_self_read" ON exam_results
  FOR SELECT USING (
    user_id = auth.uid() OR public.is_teacher_or_admin()
  );

-- Live polls: Admin/teacher tam yetkili
DROP POLICY IF EXISTS "polls_admin_all" ON live_polls;
CREATE POLICY "polls_admin_all" ON live_polls 
  FOR ALL USING (public.is_teacher_or_admin());

-- Live questions: Yalnızca sahibi ve admin/teacher güncelleyebilir
DROP POLICY IF EXISTS "questions_admin_update" ON live_questions;
CREATE POLICY "questions_admin_update" ON live_questions 
  FOR UPDATE USING (
    user_id = auth.uid() OR public.is_teacher_or_admin()
  );

-- =========================================================================
-- 3. Update private_lessons RLS policies
-- =========================================================================

-- Özel Dersler (private_lessons): Kullanıcılar kendi derslerini veya grup derslerini görebilir,
-- Admin/Teacher ise tümünü görebilir ve yönetebilir.
DROP POLICY IF EXISTS "Allow users to see their lessons and group lessons" ON private_lessons;
CREATE POLICY "Allow users to see their lessons and group lessons" 
  ON private_lessons FOR SELECT 
  USING (
    public.is_teacher_or_admin() OR
    is_private = false OR
    EXISTS (
      SELECT 1 FROM lesson_participants 
      WHERE lesson_participants.lesson_id = private_lessons.id 
      AND lesson_participants.user_id = auth.uid()
    )
  );

-- Opsiyonel: Eğer adminler için genel bir yönetim yetkisi (INSERT, UPDATE, DELETE) varsa
-- ve o da user_metadata kullanıyorsa, onu da public.is_teacher_or_admin() ile düzeltebiliriz.
-- Örnek (Eğer böyle bir policy varsa):
DROP POLICY IF EXISTS "Admins and teachers can manage private lessons" ON private_lessons;
CREATE POLICY "Admins and teachers can manage private lessons"
  ON private_lessons FOR ALL
  USING (public.is_teacher_or_admin());
