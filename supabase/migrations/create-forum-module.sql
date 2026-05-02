-- ==============================================
-- FORUM MODÜLÜ TABLOLARI
-- ==============================================

-- 1. Forum Kategorileri
CREATE TABLE IF NOT EXISTS forum_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  icon text, -- İkon adı veya emojisi
  order_index integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- 2. Forum Konuları
CREATE TABLE IF NOT EXISTS forum_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES forum_categories(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  views_count integer DEFAULT 0,
  is_pinned boolean DEFAULT false,
  is_locked boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 3. Forum Cevapları (Mesajlar)
CREATE TABLE IF NOT EXISTS forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid REFERENCES forum_topics(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  is_accepted_answer boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 4. Opsiyonel: Beğeniler
CREATE TABLE IF NOT EXISTS forum_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES forum_posts(id) ON DELETE CASCADE,
  topic_id uuid REFERENCES forum_topics(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  -- Kullanıcı bir konuyu veya postu sadece bir kez beğenebilir
  CONSTRAINT one_like_per_user_post UNIQUE (user_id, post_id),
  CONSTRAINT one_like_per_user_topic UNIQUE (user_id, topic_id),
  -- Like ya post'a ya da topic'e aittir
  CONSTRAINT like_target_check CHECK (
    (post_id IS NOT NULL AND topic_id IS NULL) OR 
    (topic_id IS NOT NULL AND post_id IS NULL)
  )
);

-- ==============================================
-- RLS (ROW LEVEL SECURITY) POLİTİKALARI
-- ==============================================

ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_likes ENABLE ROW LEVEL SECURITY;

-- KATEGORİLER
-- Herkes okuyabilir
CREATE POLICY "Categories are viewable by everyone" ON forum_categories FOR SELECT USING (true);
-- Sadece adminler kategori ekleyebilir, güncelleyebilir, silebilir
CREATE POLICY "Admins can manage categories" ON forum_categories USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- KONULAR
-- Herkes okuyabilir
CREATE POLICY "Topics are viewable by everyone" ON forum_topics FOR SELECT USING (true);
-- Giriş yapan herkes konu açabilir
CREATE POLICY "Authenticated users can create topics" ON forum_topics FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- Kullanıcı kendi konusunu güncelleyebilir (Kilitli değilse)
CREATE POLICY "Users can update own topics" ON forum_topics FOR UPDATE USING (
  auth.uid() = author_id AND is_locked = false
);
-- Adminler her konuyu güncelleyebilir (Kilitleme, Pinleme vs.)
CREATE POLICY "Admins can update any topic" ON forum_topics FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
-- Kendi konusunu veya admin silebilir
CREATE POLICY "Users can delete own topics" ON forum_topics FOR DELETE USING (
  auth.uid() = author_id OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- MESAJLAR (CEVAPLAR)
-- Herkes okuyabilir
CREATE POLICY "Posts are viewable by everyone" ON forum_posts FOR SELECT USING (true);
-- Giriş yapan herkes mesaj yazabilir (Eğer konu kilitli değilse API tarafında da kontrol edilecek)
CREATE POLICY "Authenticated users can create posts" ON forum_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- Kullanıcı kendi mesajını güncelleyebilir
CREATE POLICY "Users can update own posts" ON forum_posts FOR UPDATE USING (auth.uid() = author_id);
-- Adminler her mesajı güncelleyebilir
CREATE POLICY "Admins can update any post" ON forum_posts FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
-- Kendi mesajını veya admin silebilir
CREATE POLICY "Users can delete own posts" ON forum_posts FOR DELETE USING (
  auth.uid() = author_id OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- BEĞENİLER
CREATE POLICY "Likes are viewable by everyone" ON forum_likes FOR SELECT USING (true);
CREATE POLICY "Users can insert own likes" ON forum_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own likes" ON forum_likes FOR DELETE USING (auth.uid() = user_id);

-- ==============================================
-- REALTIME
-- ==============================================
-- Realtime yayınlarına eklenecekse:
-- ALTER PUBLICATION supabase_realtime ADD TABLE forum_topics;
-- ALTER PUBLICATION supabase_realtime ADD TABLE forum_posts;
