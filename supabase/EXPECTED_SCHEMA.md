# Contrato esperado do schema `brincareducando`

Este documento descreve as invariantes funcionais exigidas pelo aplicativo. O retrato
comprovado do banco remoto está em `supabase/REMOTE_BASELINE.md`; este arquivo continua
sendo uma especificação e não deve ser aplicado como migração.

## Entidades usadas pelo aplicativo

| Entidade | Chave de propriedade | Uso atual |
| --- | --- | --- |
| `usuarios` | `id = auth.uid()` | perfil do responsável |
| `criancas` | `usuario_id = auth.uid()` | perfis infantis e criança ativa |
| `atividades` | conteúdo editorial | catálogo publicado |
| `atividades_execucoes` | `usuario_id` + `crianca_id` pertencente ao usuário | memória de uma brincadeira |
| `diario_entradas` | `usuario_id` + `crianca_id` pertencente ao usuário | registros livres |
| `historias` | conteúdo editorial | biblioteca de histórias |
| `historico` | `usuario_id` + `crianca_id` pertencente ao usuário | progresso de histórias |
| `user_roles` | `user_id` | autorização administrativa |

As colunas remotas estão tipadas em `lib/supabase/database.types.ts`, gerado do catálogo
remoto via MCP em 20/07/2026.

## Invariantes de isolamento

1. Um usuário só pode ler, inserir, alterar ou excluir linhas familiares em que `usuario_id = auth.uid()`.
2. `crianca_id` nunca pode apontar para uma criança de outro usuário, mesmo que o cliente envie um UUID válido.
3. Alterar `usuario_id` ou `crianca_id` não pode transferir registros entre famílias.
4. Conteúdo editorial só é gravável por papel administrativo; usuários comuns leem apenas conteúdo publicado.
5. Funções `security definer` devem validar `auth.uid()`, fixar `search_path` e ter execução concedida apenas aos papéis necessários.
6. A função de criação/atualização de criança não pode aceitar um `usuario_id` fornecido pelo cliente.
7. A função de acesso ao produto deve responder apenas sobre o usuário autenticado, sem aceitar identidade arbitrária.

## Políticas que precisam existir e ser testadas

Para `criancas`, `atividades_execucoes`, `diario_entradas` e `historico`, verificar políticas separadas de `SELECT`, `INSERT`, `UPDATE` e `DELETE`, com `USING` e `WITH CHECK` coerentes. Não basta proteger `SELECT`: um `UPDATE` precisa impedir a troca do proprietário e da criança associada.

Para `atividades` e `historias`, verificar leitura de registros `publicado = true` para usuários do produto e escrita restrita ao papel editorial/administrativo.

## Prova mínima antes da primeira migration corretiva

- Capturar schema, funções, grants e RLS remotos.
- Regenerar os tipos TypeScript e resolver o diff com a linha de base manual.
- Executar cenários com dois usuários e duas crianças por usuário.
- Provar que UUIDs de outra família falham em leitura e em todas as mutações.
- Provar que troca de `usuario_id`/`crianca_id` falha em `UPDATE`.
- Provar que usuário comum não publica nem altera conteúdo editorial.
- Só então criar uma migration incremental e reaplicar os mesmos testes.
