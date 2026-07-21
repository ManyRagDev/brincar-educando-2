# Baseline remoto — `brincareducando`

Capturado por consulta somente leitura ao catálogo remoto via Supabase MCP em
20/07/2026, depois das migrações `20260720160603` e `20260720161850`.
Nenhuma chave, e-mail ou UUID de usuário integra este documento.

## Inventário

- 14 tabelas, todas com RLS habilitada.
- 49 políticas RLS.
- 7 funções.
- 0 privilégios de tabela para `anon`.
- 8 tabelas ativas concedidas a `authenticated`.
- Tipos TypeScript gerados em `lib/supabase/database.types.ts`.

### Modelo ativo

| Domínio | Tabelas |
| --- | --- |
| Família | `criancas`, `atividades_execucoes`, `diario_entradas`, `historico` |
| Conteúdo | `atividades`, `historias`, `historias_textos`, `historias_audios` |
| Suporte interno | `usuarios`, `user_roles` |

### Modelo legado preservado

`perfis_criancas`, `brincadeiras`, `diario_momentos` e `marcos_alcancados` foram
preservadas para não destruir dados históricos. Elas não têm grants de tabela para
`anon` ou `authenticated` e não são usadas pelo aplicativo novo. A remoção deve ser
uma migração própria, precedida de inventário e estratégia de importação/arquivamento.

## Isolamento e integridade

- Tabelas familiares têm políticas separadas para `SELECT`, `INSERT`, `UPDATE` e
  `DELETE`, destinadas explicitamente a `authenticated`.
- `crianca_id` é obrigatório em execuções, diário e histórico.
- FKs compostas `(crianca_id, usuario_id)` impedem associar ou transferir registros
  para uma criança de outra família, mesmo com UUID conhecido.
- Conteúdo publicado é legível por usuários autenticados; escrita editorial exige
  papel `admin`.
- O schema e todas as tabelas foram revogados de `anon`.

## Funções e grants

| Função | Modo | `anon` | `authenticated` | `service_role` |
| --- | --- | --- | --- | --- |
| `current_user_has_manylabs_app_access()` | invoker | não | sim | sim |
| `upsert_child_with_profile(...)` | definer validado | não | sim | sim |
| `has_role(uuid, app_role)` | definer limitado ao próprio usuário | não | sim | sim |
| `ensure_manylabs_app_access(...)` | definer interno | não | não | sim |
| `has_manylabs_app_access(uuid)` | definer interno | não | não | sim |
| `handle_new_user()` | trigger | não | não | sim |
| `update_updated_at_column()` | invoker/trigger | não | não | sim |

As funções `security definer` fixam `search_path`. A RPC de criação de criança obtém
o responsável de `auth.uid()`, valida os dados e exige acesso ativo ao produto. A RPC
de provisionamento ManyLabs, anteriormente executável com identidade arbitrária, é
agora exclusiva de `service_role`.

## Evidências pós-migração

- Responsável proprietário enxerga sua criança; outro usuário enxerga zero linhas.
- Inserção válida de execução para a própria criança passa.
- Inserção com `usuario_id` de outra família e UUID real da criança falha na FK
  composta (`23503`).
- A antiga possibilidade de registro órfão com `crianca_id = null` foi eliminada.
- A checagem ManyLabs continuou retornando `true` como `authenticated` depois de
  mudar para `security invoker`.
- `npm run typecheck` passa com os tipos do catálogo remoto.

## Advisors aceitos

Não há achado crítico do advisor no schema `brincareducando`. Permanecem avisos de:

- exposição GraphQL das oito tabelas ativas a usuários autenticados — intencional,
  pois a aplicação usa PostgREST e RLS;
- execução autenticada das RPCs `has_role` e `upsert_child_with_profile` — intencional,
  com validações internas e grants mínimos;
- políticas e índices do modelo legado — dívida controlada, sem grants de API.

O índice duplicado de `diario_entradas` detectado no primeiro passe foi removido pela
migração `20260720161850_brincareducando_phase0_advisor_cleanup.sql`.
