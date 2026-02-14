-- Tabela de entradas livres do diário (separada de atividades_execucoes)
CREATE TABLE IF NOT EXISTS brincareducando.diario_entradas (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id   UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  crianca_id   UUID        REFERENCES brincareducando.criancas(id) ON DELETE SET NULL,
  titulo       TEXT,
  conteudo     TEXT        NOT NULL,
  humor        TEXT,
  tags         TEXT[]      DEFAULT '{}',
  data_entrada TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE brincareducando.diario_entradas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuarios podem ver suas entradas"
  ON brincareducando.diario_entradas FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "usuarios podem inserir suas entradas"
  ON brincareducando.diario_entradas FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "usuarios podem deletar suas entradas"
  ON brincareducando.diario_entradas FOR DELETE
  USING (auth.uid() = usuario_id);

-- Índice para queries por usuário ordenadas por data
CREATE INDEX IF NOT EXISTS diario_entradas_usuario_data
  ON brincareducando.diario_entradas(usuario_id, data_entrada DESC);
