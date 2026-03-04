-- Criar tabela teams
CREATE TABLE teams (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  abbreviation text NOT NULL,
  league text NOT NULL,
  city text DEFAULT '',
  primary_color text DEFAULT '#000000',
  created_at timestamptz DEFAULT now(),
  UNIQUE(name, league)
);

-- RLS: leitura pública, escrita via service_role
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teams are viewable by everyone"
  ON teams FOR SELECT
  USING (true);

CREATE POLICY "Teams are insertable by service role"
  ON teams FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Teams are updatable by service role"
  ON teams FOR UPDATE
  USING (true);

CREATE POLICY "Teams are deletable by service role"
  ON teams FOR DELETE
  USING (true);
