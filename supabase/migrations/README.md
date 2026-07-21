# Migrações do Brincar Educando

O schema remoto `brincareducando` foi auditado por MCP em 20/07/2026. A fotografia
de referência está em `supabase/REMOTE_BASELINE.md` e os tipos autoritativos em
`lib/supabase/database.types.ts`.

As migrações locais a partir de `20260720160603` têm a mesma versão e o mesmo nome
registrados em `supabase_migrations.schema_migrations` no projeto remoto. Migrações
anteriores pertencem ao histórico compartilhado do projeto Supabase e não devem ser
recriadas nem renumeradas neste repositório.

## Fluxo seguro

1. Trabalhe sempre com uma migração incremental; não edite uma migração já aplicada.
2. Faça o ensaio em uma branch/local Supabase quando disponível.
3. Confirme tabelas, funções, grants, RLS e advisors antes e depois da mudança.
4. Regenere `lib/supabase/database.types.ts` com o schema `brincareducando`.
5. Execute `npm run typecheck`, `npm test` e `npm run build`.
6. Atualize `supabase/REMOTE_BASELINE.md` quando o contrato mudar.

`01_full_schema.sql` é um artefato histórico divergente e não deve ser copiado para
esta pasta ou aplicado sobre o banco atual.
