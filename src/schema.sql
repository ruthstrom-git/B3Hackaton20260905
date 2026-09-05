DROP TABLE IF EXISTS notes;

CREATE TABLE IF NOT EXISTS conversations (
  id SERIAL PRIMARY KEY,
  mode TEXT NOT NULL CHECK (mode IN ('Bright', 'Content', 'Calm', 'Tired', 'Tense')),
  location TEXT,
  content TEXT,
  created TIMESTAMPTZ NOT NULL DEFAULT now()
);
