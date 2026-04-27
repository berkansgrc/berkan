-- Soru zorluk derecesi sütunu
ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'medium'
  CHECK (difficulty IN ('easy', 'medium', 'hard'));

-- Mevcut sorulara varsayılan değer
UPDATE questions SET difficulty = 'medium' WHERE difficulty IS NULL;
