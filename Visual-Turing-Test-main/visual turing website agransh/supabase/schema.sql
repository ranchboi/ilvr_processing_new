-- Run this in Supabase SQL Editor to set up the database schema
-- Go to: Supabase Dashboard -> SQL Editor -> New Query -> Paste and Run

-- Table to store the radiologist counter (single row)
CREATE TABLE IF NOT EXISTS radiologist_counter (
  id INT PRIMARY KEY DEFAULT 1,
  counter INT NOT NULL DEFAULT 0,
  CONSTRAINT single_row CHECK (id = 1)
);

-- Initialize counter
INSERT INTO radiologist_counter (id, counter) VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- Function for atomic counter increment
CREATE OR REPLACE FUNCTION increment_radiologist_counter()
RETURNS INTEGER AS $$
DECLARE
  new_counter INTEGER;
BEGIN
  UPDATE radiologist_counter SET counter = counter + 1 WHERE id = 1 RETURNING counter INTO new_counter;
  IF new_counter IS NULL THEN
    INSERT INTO radiologist_counter (id, counter) VALUES (1, 1) RETURNING counter INTO new_counter;
  END IF;
  RETURN new_counter;
END;
$$ LANGUAGE plpgsql;

-- Table to store all responses (one row per completed form submission)
CREATE TABLE IF NOT EXISTS responses (
  id BIGSERIAL PRIMARY KEY,
  radiologist_id VARCHAR(50) NOT NULL,
  responses JSONB NOT NULL DEFAULT '[]',
  total_correct INT,
  total_scans INT,
  final_survey JSONB,
  knowledge VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- If responses table already exists, run this to add new columns:
-- ALTER TABLE responses ADD COLUMN IF NOT EXISTS total_correct INT;
-- ALTER TABLE responses ADD COLUMN IF NOT EXISTS total_scans INT;

-- Note: API routes use Supabase service role which has full access

-- Alternative table structure (if you use al_survey + knowledge columns):
-- CREATE TABLE IF NOT EXISTS responses (
--   id BIGSERIAL PRIMARY KEY,
--   al_survey JSONB NOT NULL DEFAULT '{}',
--   knowledge VARCHAR(255),
--   created_at TIMESTAMPTZ DEFAULT NOW()
-- );
-- The API stores the full payload (radiologist_id, responses, total_correct, total_scans, final_survey) inside al_survey.
