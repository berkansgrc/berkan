-- ============================================================
-- Rate Limits Tablosu — Bot Saldırı Koruması
-- ============================================================
-- Bu SQL'i Supabase Dashboard > SQL Editor üzerinden çalıştırın.
--
-- Tablo, her istek yapanın (IP veya kullanıcı ID) belirli bir
-- zaman penceresi içinde kaç istek yaptığını takip eder.
-- ============================================================

CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL,           -- IP adresi veya user ID
  action TEXT NOT NULL,               -- 'exam_submit', 'auth_login' vb.
  token_count INTEGER DEFAULT 1,      -- Bu penceredeki istek sayısı
  window_start TIMESTAMPTZ DEFAULT now(),  -- Pencerenin başlangıcı
  
  -- Aynı (identifier, action) çifti için tek satır
  UNIQUE(identifier, action)
);

-- Hızlı sorgulama için index
CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup 
  ON rate_limits(identifier, action);

-- Eski kayıtları otomatik temizle (1 saatten eski)
-- Bu fonksiyonu Supabase'de cron job olarak çalıştırabilirsiniz
-- veya her istek sırasında rate_limits fonksiyonu zaten temizler.
