-- questions tablosuna difficulty sütunu ekle
ALTER TABLE questions 
  ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'medium' 
  CHECK (difficulty IN ('easy', 'medium', 'hard'));
