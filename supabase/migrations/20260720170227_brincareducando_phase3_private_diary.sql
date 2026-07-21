-- Phase 3: unified diary metadata and private family media.

alter table brincareducando.diario_entradas
  add column tipo_registro text not null default 'livre' check (
    tipo_registro in ('livre', 'fala', 'descoberta', 'desafio', 'riso', 'foto')
  ),
  add column updated_at timestamptz not null default now();

alter table brincareducando.diario_entradas
  add constraint diario_entradas_id_usuario_key unique (id, usuario_id);

create trigger diario_entradas_updated_at
  before update on brincareducando.diario_entradas
  for each row execute function brincareducando.update_updated_at_column();

create table brincareducando.diario_midias (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  crianca_id uuid not null,
  diario_entrada_id uuid not null,
  storage_path text not null unique check (char_length(storage_path) between 10 and 500),
  mime_type text not null check (mime_type in ('image/jpeg', 'image/png', 'image/webp')),
  tamanho_bytes integer not null check (tamanho_bytes between 1 and 5242880),
  created_at timestamptz not null default now(),
  constraint diario_midias_crianca_owner_fkey
    foreign key (crianca_id, usuario_id)
    references brincareducando.criancas(id, usuario_id)
    on delete cascade,
  constraint diario_midias_entrada_owner_fkey
    foreign key (diario_entrada_id, usuario_id)
    references brincareducando.diario_entradas(id, usuario_id)
    on delete cascade
);

create index diario_midias_crianca_created_idx on brincareducando.diario_midias (crianca_id, created_at desc);
create index diario_midias_entrada_idx on brincareducando.diario_midias (diario_entrada_id);
create index diario_midias_crianca_owner_idx on brincareducando.diario_midias (crianca_id, usuario_id);

alter table brincareducando.diario_midias enable row level security;
create policy diary_media_select_own on brincareducando.diario_midias
  for select to authenticated using ((select auth.uid()) = usuario_id);
create policy diary_media_insert_own on brincareducando.diario_midias
  for insert to authenticated with check ((select auth.uid()) = usuario_id);
create policy diary_media_delete_own on brincareducando.diario_midias
  for delete to authenticated using ((select auth.uid()) = usuario_id);

revoke all on table brincareducando.diario_midias from public, anon, authenticated;
grant select, insert, delete on table brincareducando.diario_midias to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'brincareducando-diario-privado',
  'brincareducando-diario-privado',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy brincareducando_diary_storage_select_own
  on storage.objects for select to authenticated
  using (
    bucket_id = 'brincareducando-diario-privado'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
create policy brincareducando_diary_storage_insert_own
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'brincareducando-diario-privado'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
create policy brincareducando_diary_storage_delete_own
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'brincareducando-diario-privado'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
