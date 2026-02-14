-- Adiciona coluna slug à tabela atividades
-- O slug é gerado a partir do titulo: minúsculas, sem acentos, espaços → hifens

ALTER TABLE brincareducando.atividades
  ADD COLUMN IF NOT EXISTS slug TEXT;

-- Popula slugs existentes a partir do titulo
UPDATE brincareducando.atividades
SET slug = trim(both '-' from
  regexp_replace(
    regexp_replace(
      translate(lower(titulo),
        'áàãâäéèêëíìîïóòõôöúùûüçñ',
        'aaaaaeeeeiiiiooooouuuucn'),
      '[^a-z0-9\s]', '', 'g'),
    '\s+', '-', 'g'))
WHERE slug IS NULL;

-- Garante unicidade
ALTER TABLE brincareducando.atividades
  ADD CONSTRAINT atividades_slug_key UNIQUE (slug);
