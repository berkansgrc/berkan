-- ============================================================
-- Supabase Storage "exam-media" Bucket Kurulumu & RLS İzinleri
-- ============================================================

-- 1. "exam-media" adında yeni bir public bucket oluştur. (Eğer yoksa)
insert into storage.buckets (id, name, public)
select 'exam-media', 'exam-media', true
where not exists (
  select 1 from storage.buckets where id = 'exam-media'
);

-- 2. Mevcut storage politikalarını çakışmalara karşı temizle (İsteğe bağlı temizlik)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Users Can Upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own uploads" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own uploads" ON storage.objects;

-- 3. Resimleri Herkes (Public) Okuyabilsin
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'exam-media');

-- 4. Yalnızca giriş yapmış kullanıcılar (Öğretmen/Admin) Yükleme Yapabilsin
CREATE POLICY "Authenticated Users Can Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'exam-media');

-- 5. Kullanıcılar yalnızca kendi yükledikleri dosyaları Güncelleyebilsin
CREATE POLICY "Users can update their own uploads"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'exam-media' AND owner = auth.uid())
WITH CHECK (bucket_id = 'exam-media');

-- 6. Kullanıcılar yalnızca kendi yükledikleri dosyaları Silebilsin
CREATE POLICY "Users can delete their own uploads"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'exam-media' AND owner = auth.uid());
