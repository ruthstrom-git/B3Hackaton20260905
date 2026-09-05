DROP TABLE IF EXISTS notes;

CREATE TABLE IF NOT EXISTS conversations (
  id SERIAL PRIMARY KEY,
  mode TEXT NOT NULL CHECK (mode IN ('Bright', 'Content', 'Calm', 'Tired', 'Tense')),
  location TEXT,
  content TEXT,
  created TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Migrates a table created before the created_at -> created rename.
-- CREATE TABLE IF NOT EXISTS above is a no-op once the table already
-- exists, so a prior deploy's column name would otherwise stick around.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conversations' AND column_name = 'created_at'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conversations' AND column_name = 'created'
  ) THEN
    ALTER TABLE conversations RENAME COLUMN created_at TO created;
  END IF;
END $$;
