-- ==============================================
-- BLOG MODÜLÜ TABLOLARI
-- ==============================================

-- 1. Blog Kategorileri
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now()
);

-- 2. Blog Yazıları
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text NOT NULL,
  cover_image text, -- ImgBB URL'si buraya gelecek
  author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  is_published boolean DEFAULT false,
  published_at timestamp with time zone,
  views_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 3. Blog Yazı - Kategori İlişkisi (Çoka Çok)
CREATE TABLE IF NOT EXISTS blog_post_categories (
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  category_id uuid REFERENCES blog_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- 4. Blog Yorumları
CREATE TABLE IF NOT EXISTS blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE SET NULL, -- Kayıtlıysa
  author_name text, -- Dışarıdan misafirse
  author_email text, -- Dışarıdan misafirse
  content text NOT NULL,
  is_approved boolean DEFAULT true, -- İstenirse admin onayından geçebilir, şimdilik otomatik onaylı
  created_at timestamp with time zone DEFAULT now()
);

-- ==============================================
-- RLS (ROW LEVEL SECURITY) POLİTİKALARI
-- ==============================================

ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- BLOG KATEGORİLERİ
-- Herkes okuyabilir
CREATE POLICY "Blog categories are viewable by everyone" ON blog_categories FOR SELECT USING (true);
-- Sadece adminler ekleyebilir/düzenleyebilir
CREATE POLICY "Admins can manage blog categories" ON blog_categories USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- BLOG YAZILARI
-- Herkes sadece yayınlanmış yazıları görebilir
CREATE POLICY "Published blog posts are viewable by everyone" ON blog_posts FOR SELECT USING (is_published = true);
-- Adminler tüm yazıları görebilir (Taslaklar dahil)
CREATE POLICY "Admins can view all posts" ON blog_posts FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
-- Sadece adminler ekleyebilir, güncelleyebilir, silebilir
CREATE POLICY "Admins can manage blog posts" ON blog_posts USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- BLOG YAZI - KATEGORİ İLİŞKİSİ
-- Herkes okuyabilir
CREATE POLICY "Blog post categories are viewable by everyone" ON blog_post_categories FOR SELECT USING (true);
-- Sadece adminler düzenleyebilir
CREATE POLICY "Admins can manage blog post categories" ON blog_post_categories USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- BLOG YORUMLARI
-- Herkes onaylanmış yorumları görebilir
CREATE POLICY "Approved comments are viewable by everyone" ON blog_comments FOR SELECT USING (is_approved = true);
-- Adminler tüm yorumları görebilir
CREATE POLICY "Admins can view all comments" ON blog_comments FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
-- Herkes (kayıtlı veya kayıtsız) yorum yapabilir
CREATE POLICY "Anyone can insert comments" ON blog_comments FOR INSERT WITH CHECK (true);
-- Sadece adminler silebilir/güncelleyebilir
CREATE POLICY "Admins can manage comments" ON blog_comments USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
