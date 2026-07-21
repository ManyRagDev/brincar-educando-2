-- Phase 1: privacy-conscious events for the explainable recommendation loop.

create table brincareducando.recomendacoes_eventos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  crianca_id uuid not null,
  atividade_id uuid references brincareducando.atividades(id) on delete set null,
  tipo text not null check (tipo in ('impression', 'open', 'swap', 'start')),
  contexto text check (
    contexto is null or contexto in (
      'quick', 'move', 'calm', 'no_materials', 'outside', 'tired_adult'
    )
  ),
  motivo text check (
    motivo is null or motivo in (
      'no_time', 'no_materials', 'wrong_mood', 'already_did', 'just_browsing'
    )
  ),
  recomendacao_chave text not null check (char_length(recomendacao_chave) between 3 and 160),
  regra_versao text not null default 'v1',
  posicao smallint check (posicao is null or posicao between 0 and 100),
  created_at timestamptz not null default now(),
  constraint recomendacoes_eventos_crianca_owner_fkey
    foreign key (crianca_id, usuario_id)
    references brincareducando.criancas(id, usuario_id)
    on delete cascade
);

create index recomendacoes_eventos_crianca_created_idx
  on brincareducando.recomendacoes_eventos (crianca_id, created_at desc);
create index recomendacoes_eventos_usuario_created_idx
  on brincareducando.recomendacoes_eventos (usuario_id, created_at desc);
create index recomendacoes_eventos_atividade_idx
  on brincareducando.recomendacoes_eventos (atividade_id)
  where atividade_id is not null;

alter table brincareducando.recomendacoes_eventos enable row level security;

create policy recommendation_events_select_own
  on brincareducando.recomendacoes_eventos
  for select to authenticated
  using ((select auth.uid()) = usuario_id);

create policy recommendation_events_insert_own
  on brincareducando.recomendacoes_eventos
  for insert to authenticated
  with check ((select auth.uid()) = usuario_id);

revoke all on table brincareducando.recomendacoes_eventos from public, anon, authenticated;
grant select, insert on table brincareducando.recomendacoes_eventos to authenticated;
