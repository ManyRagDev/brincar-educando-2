-- Migration: Push Notifications tokens and family notification preferences

create table if not exists brincareducando.usuario_push_tokens (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  token text not null,
  plataforma text not null default 'android' check (plataforma in ('android', 'ios', 'web')),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint usuario_push_tokens_user_token_key unique (usuario_id, token)
);

create table if not exists brincareducando.usuario_notificacao_preferencias (
  usuario_id uuid primary key references auth.users(id) on delete cascade,
  convites_brincadeiras boolean not null default true,
  lembretes_diario boolean not null default true,
  novidades_fase boolean not null default true,
  atualizado_em timestamptz not null default now()
);

-- Indexes
create index if not exists usuario_push_tokens_usuario_idx
  on brincareducando.usuario_push_tokens (usuario_id);

-- RLS for Tokens
alter table brincareducando.usuario_push_tokens enable row level security;

create policy push_tokens_select_own
  on brincareducando.usuario_push_tokens
  for select to authenticated
  using ((select auth.uid()) = usuario_id);

create policy push_tokens_insert_own
  on brincareducando.usuario_push_tokens
  for insert to authenticated
  with check ((select auth.uid()) = usuario_id);

create policy push_tokens_update_own
  on brincareducando.usuario_push_tokens
  for update to authenticated
  using ((select auth.uid()) = usuario_id)
  with check ((select auth.uid()) = usuario_id);

create policy push_tokens_delete_own
  on brincareducando.usuario_push_tokens
  for delete to authenticated
  using ((select auth.uid()) = usuario_id);

-- RLS for Preferences
alter table brincareducando.usuario_notificacao_preferencias enable row level security;

create policy push_prefs_select_own
  on brincareducando.usuario_notificacao_preferencias
  for select to authenticated
  using ((select auth.uid()) = usuario_id);

create policy push_prefs_insert_own
  on brincareducando.usuario_notificacao_preferencias
  for insert to authenticated
  with check ((select auth.uid()) = usuario_id);

create policy push_prefs_update_own
  on brincareducando.usuario_notificacao_preferencias
  for update to authenticated
  using ((select auth.uid()) = usuario_id)
  with check ((select auth.uid()) = usuario_id);

-- Grants
revoke all on table brincareducando.usuario_push_tokens from public, anon, authenticated;
grant select, insert, update, delete on table brincareducando.usuario_push_tokens to authenticated;

revoke all on table brincareducando.usuario_notificacao_preferencias from public, anon, authenticated;
grant select, insert, update on table brincareducando.usuario_notificacao_preferencias to authenticated;
