-- Phase 0: family isolation, least privilege and privileged RPC hardening.
-- Audited against the remote project before application on 2026-07-20.

begin;

-- A child and its owner form the authoritative family boundary.
alter table brincareducando.criancas
  add constraint criancas_id_usuario_id_key unique (id, usuario_id);

alter table brincareducando.criancas
  add constraint criancas_nome_length_check
    check (char_length(btrim(nome)) between 2 and 80),
  add constraint criancas_genero_check
    check (genero is null or genero in ('menino', 'menina', 'nao_informado')),
  add constraint criancas_cor_favorita_check
    check (cor_favorita is null or cor_favorita in ('rosa', 'azul', 'verde', 'amarelo', 'roxo', 'laranja')),
  add constraint criancas_interesses_array_check
    check (
      interesses is null
      or (jsonb_typeof(interesses) = 'array' and jsonb_array_length(interesses) <= 10)
    );

-- Family records must always belong to the same user as the selected child.
alter table brincareducando.atividades_execucoes
  alter column crianca_id set not null,
  drop constraint atividades_execucoes_crianca_id_fkey,
  add constraint atividades_execucoes_crianca_owner_fkey
    foreign key (crianca_id, usuario_id)
    references brincareducando.criancas (id, usuario_id)
    on delete cascade;

alter table brincareducando.diario_entradas
  alter column crianca_id set not null,
  drop constraint diario_entradas_crianca_id_fkey,
  add constraint diario_entradas_crianca_owner_fkey
    foreign key (crianca_id, usuario_id)
    references brincareducando.criancas (id, usuario_id)
    on delete cascade;

alter table brincareducando.historico
  alter column crianca_id set not null,
  alter column historia_id set not null,
  drop constraint historico_crianca_id_fkey,
  add constraint historico_crianca_owner_fkey
    foreign key (crianca_id, usuario_id)
    references brincareducando.criancas (id, usuario_id)
    on delete cascade;

create index if not exists criancas_usuario_id_idx
  on brincareducando.criancas (usuario_id);
create index if not exists atividades_execucoes_usuario_data_idx
  on brincareducando.atividades_execucoes (usuario_id, data_conclusao desc);
create index if not exists atividades_execucoes_crianca_data_idx
  on brincareducando.atividades_execucoes (crianca_id, data_conclusao desc);
create index if not exists diario_entradas_usuario_data_idx
  on brincareducando.diario_entradas (usuario_id, data_entrada desc);
create index if not exists diario_entradas_crianca_data_idx
  on brincareducando.diario_entradas (crianca_id, data_entrada desc);
create index if not exists historico_usuario_updated_idx
  on brincareducando.historico (usuario_id, updated_at desc);
create index if not exists historico_crianca_updated_idx
  on brincareducando.historico (crianca_id, updated_at desc);
create index if not exists user_roles_user_id_idx
  on brincareducando.user_roles (user_id);

-- Role checks can only answer questions about the current authenticated user.
create or replace function brincareducando.has_role(
  _user_id uuid,
  _role brincareducando.app_role
)
returns boolean
language sql
stable
security definer
set search_path = brincareducando, pg_temp
as $$
  select
    (select auth.uid()) is not null
    and _user_id = (select auth.uid())
    and exists (
      select 1
      from brincareducando.user_roles
      where user_id = _user_id
        and role = _role
    );
$$;

create or replace function brincareducando.update_updated_at_column()
returns trigger
language plpgsql
set search_path = pg_catalog, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Validate the only client-callable write RPC at the database boundary too.
create or replace function brincareducando.upsert_child_with_profile(
  p_nome text,
  p_data_nascimento date,
  p_genero text,
  p_cor_favorita text,
  p_interesses jsonb,
  p_avatar_id text default 'default'
)
returns jsonb
language plpgsql
security definer
set search_path = brincareducando, auth, manylabs, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_user_email text;
  v_user_nome text;
  v_child_id uuid;
begin
  if v_user_id is null then
    raise exception 'Não autenticado' using errcode = '42501';
  end if;

  if not manylabs.has_app_access(v_user_id, 'brincar_educando') then
    raise exception 'Acesso ao aplicativo necessário' using errcode = '42501';
  end if;

  if char_length(btrim(coalesce(p_nome, ''))) not between 2 and 80 then
    raise exception 'Nome inválido' using errcode = '22023';
  end if;
  if p_data_nascimento is null or p_data_nascimento > current_date then
    raise exception 'Data de nascimento inválida' using errcode = '22023';
  end if;
  if p_genero not in ('menino', 'menina', 'nao_informado') then
    raise exception 'Gênero inválido' using errcode = '22023';
  end if;
  if p_cor_favorita not in ('rosa', 'azul', 'verde', 'amarelo', 'roxo', 'laranja') then
    raise exception 'Cor inválida' using errcode = '22023';
  end if;
  if p_interesses is null
     or jsonb_typeof(p_interesses) <> 'array'
     or jsonb_array_length(p_interesses) > 10 then
    raise exception 'Interesses inválidos' using errcode = '22023';
  end if;
  if p_avatar_id not in ('boy', 'girl', 'star', 'fox', 'dino', 'boy2') then
    raise exception 'Avatar inválido' using errcode = '22023';
  end if;

  if not exists (select 1 from brincareducando.usuarios where id = v_user_id) then
    select
      email,
      coalesce(raw_user_meta_data->>'nome', split_part(email, '@', 1))
    into v_user_email, v_user_nome
    from auth.users
    where id = v_user_id;

    insert into brincareducando.usuarios (id, nome, email)
    values (v_user_id, v_user_nome, v_user_email);

    insert into brincareducando.user_roles (user_id, role)
    values (v_user_id, 'user')
    on conflict (user_id, role) do nothing;
  end if;

  insert into brincareducando.criancas (
    usuario_id,
    nome,
    data_nascimento,
    genero,
    cor_favorita,
    interesses,
    avatar_id
  ) values (
    v_user_id,
    btrim(p_nome),
    p_data_nascimento,
    p_genero,
    p_cor_favorita,
    p_interesses,
    p_avatar_id
  )
  returning id into v_child_id;

  return jsonb_build_object('success', true, 'child_id', v_child_id);
end;
$$;

-- Remove broad/default function execution and grant only intended entrypoints.
revoke execute on all functions in schema brincareducando from public, anon, authenticated;
grant execute on function brincareducando.current_user_has_manylabs_app_access()
  to authenticated;
grant execute on function brincareducando.upsert_child_with_profile(text, date, text, text, jsonb, text)
  to authenticated;
grant execute on function brincareducando.has_role(uuid, brincareducando.app_role)
  to authenticated;
grant execute on function brincareducando.ensure_manylabs_app_access(uuid, text, text)
  to service_role;
grant execute on function brincareducando.has_manylabs_app_access(uuid)
  to service_role;

-- Least-privilege API surface. The dashboard is an authenticated product.
revoke usage on schema brincareducando from anon;
grant usage on schema brincareducando to authenticated, service_role;
revoke all privileges on all tables in schema brincareducando from anon, authenticated;

grant select, insert, update, delete on brincareducando.criancas to authenticated;
grant select, insert, update, delete on brincareducando.atividades_execucoes to authenticated;
grant select, insert, update, delete on brincareducando.diario_entradas to authenticated;
grant select, insert, update, delete on brincareducando.historico to authenticated;

grant select, insert, update, delete on brincareducando.atividades to authenticated;
grant select, insert, update, delete on brincareducando.historias to authenticated;
grant select, insert, update, delete on brincareducando.historias_textos to authenticated;
grant select, insert, update, delete on brincareducando.historias_audios to authenticated;

-- Replace family policies with explicit operation- and role-scoped policies.
drop policy if exists "Users can manage their children" on brincareducando.criancas;
create policy children_select_own on brincareducando.criancas
  for select to authenticated
  using ((select auth.uid()) = usuario_id);
create policy children_insert_own on brincareducando.criancas
  for insert to authenticated
  with check ((select auth.uid()) = usuario_id);
create policy children_update_own on brincareducando.criancas
  for update to authenticated
  using ((select auth.uid()) = usuario_id)
  with check ((select auth.uid()) = usuario_id);
create policy children_delete_own on brincareducando.criancas
  for delete to authenticated
  using ((select auth.uid()) = usuario_id);

drop policy if exists "Users can view their own executions" on brincareducando.atividades_execucoes;
drop policy if exists "Users can insert their own executions" on brincareducando.atividades_execucoes;
drop policy if exists "Users can update their own executions" on brincareducando.atividades_execucoes;
drop policy if exists "Users can delete their own executions" on brincareducando.atividades_execucoes;
create policy executions_select_own on brincareducando.atividades_execucoes
  for select to authenticated
  using ((select auth.uid()) = usuario_id);
create policy executions_insert_own on brincareducando.atividades_execucoes
  for insert to authenticated
  with check ((select auth.uid()) = usuario_id);
create policy executions_update_own on brincareducando.atividades_execucoes
  for update to authenticated
  using ((select auth.uid()) = usuario_id)
  with check ((select auth.uid()) = usuario_id);
create policy executions_delete_own on brincareducando.atividades_execucoes
  for delete to authenticated
  using ((select auth.uid()) = usuario_id);

drop policy if exists "usuarios podem ver suas entradas" on brincareducando.diario_entradas;
drop policy if exists "usuarios podem inserir suas entradas" on brincareducando.diario_entradas;
drop policy if exists "usuarios podem deletar suas entradas" on brincareducando.diario_entradas;
create policy diary_select_own on brincareducando.diario_entradas
  for select to authenticated
  using ((select auth.uid()) = usuario_id);
create policy diary_insert_own on brincareducando.diario_entradas
  for insert to authenticated
  with check ((select auth.uid()) = usuario_id);
create policy diary_update_own on brincareducando.diario_entradas
  for update to authenticated
  using ((select auth.uid()) = usuario_id)
  with check ((select auth.uid()) = usuario_id);
create policy diary_delete_own on brincareducando.diario_entradas
  for delete to authenticated
  using ((select auth.uid()) = usuario_id);

drop policy if exists "Users manage their own history" on brincareducando.historico;
create policy history_select_own on brincareducando.historico
  for select to authenticated
  using ((select auth.uid()) = usuario_id);
create policy history_insert_own on brincareducando.historico
  for insert to authenticated
  with check ((select auth.uid()) = usuario_id);
create policy history_update_own on brincareducando.historico
  for update to authenticated
  using ((select auth.uid()) = usuario_id)
  with check ((select auth.uid()) = usuario_id);
create policy history_delete_own on brincareducando.historico
  for delete to authenticated
  using ((select auth.uid()) = usuario_id);

-- One policy per command avoids overlapping permissive policies.
drop policy if exists "Admins can manage activities" on brincareducando.atividades;
drop policy if exists "Published activities are viewable by all" on brincareducando.atividades;
create policy activities_select_available on brincareducando.atividades
  for select to authenticated
  using (
    publicado is true
    or (select brincareducando.has_role((select auth.uid()), 'admin'))
  );
create policy activities_insert_admin on brincareducando.atividades
  for insert to authenticated
  with check ((select brincareducando.has_role((select auth.uid()), 'admin')));
create policy activities_update_admin on brincareducando.atividades
  for update to authenticated
  using ((select brincareducando.has_role((select auth.uid()), 'admin')))
  with check ((select brincareducando.has_role((select auth.uid()), 'admin')));
create policy activities_delete_admin on brincareducando.atividades
  for delete to authenticated
  using ((select brincareducando.has_role((select auth.uid()), 'admin')));

drop policy if exists "Admins can manage stories" on brincareducando.historias;
drop policy if exists "Admins podem deletar histórias" on brincareducando.historias;
drop policy if exists "Admins podem criar histórias" on brincareducando.historias;
drop policy if exists "Published stories are viewable by all" on brincareducando.historias;
drop policy if exists "Todos podem ver histórias publicadas" on brincareducando.historias;
drop policy if exists "Admins podem atualizar histórias" on brincareducando.historias;
create policy stories_select_available on brincareducando.historias
  for select to authenticated
  using (
    publicado is true
    or (select brincareducando.has_role((select auth.uid()), 'admin'))
  );
create policy stories_insert_admin on brincareducando.historias
  for insert to authenticated
  with check ((select brincareducando.has_role((select auth.uid()), 'admin')));
create policy stories_update_admin on brincareducando.historias
  for update to authenticated
  using ((select brincareducando.has_role((select auth.uid()), 'admin')))
  with check ((select brincareducando.has_role((select auth.uid()), 'admin')));
create policy stories_delete_admin on brincareducando.historias
  for delete to authenticated
  using ((select brincareducando.has_role((select auth.uid()), 'admin')));

drop policy if exists "Admins podem deletar textos" on brincareducando.historias_textos;
drop policy if exists "Admins podem criar textos" on brincareducando.historias_textos;
drop policy if exists "Todos podem ver textos de histórias publicadas" on brincareducando.historias_textos;
drop policy if exists "Admins podem atualizar textos" on brincareducando.historias_textos;
create policy story_texts_select_available on brincareducando.historias_textos
  for select to authenticated
  using (
    exists (
      select 1 from brincareducando.historias h
      where h.id = historia_id
        and (h.publicado is true or (select brincareducando.has_role((select auth.uid()), 'admin')))
    )
  );
create policy story_texts_insert_admin on brincareducando.historias_textos
  for insert to authenticated
  with check ((select brincareducando.has_role((select auth.uid()), 'admin')));
create policy story_texts_update_admin on brincareducando.historias_textos
  for update to authenticated
  using ((select brincareducando.has_role((select auth.uid()), 'admin')))
  with check ((select brincareducando.has_role((select auth.uid()), 'admin')));
create policy story_texts_delete_admin on brincareducando.historias_textos
  for delete to authenticated
  using ((select brincareducando.has_role((select auth.uid()), 'admin')));

drop policy if exists "Admins podem deletar áudios" on brincareducando.historias_audios;
drop policy if exists "Admins podem criar áudios" on brincareducando.historias_audios;
drop policy if exists "Todos podem ver áudios de histórias publicadas" on brincareducando.historias_audios;
drop policy if exists "Admins podem atualizar áudios" on brincareducando.historias_audios;
create policy story_audio_select_available on brincareducando.historias_audios
  for select to authenticated
  using (
    exists (
      select 1 from brincareducando.historias h
      where h.id = historia_id
        and (h.publicado is true or (select brincareducando.has_role((select auth.uid()), 'admin')))
    )
  );
create policy story_audio_insert_admin on brincareducando.historias_audios
  for insert to authenticated
  with check ((select brincareducando.has_role((select auth.uid()), 'admin')));
create policy story_audio_update_admin on brincareducando.historias_audios
  for update to authenticated
  using ((select brincareducando.has_role((select auth.uid()), 'admin')))
  with check ((select brincareducando.has_role((select auth.uid()), 'admin')));
create policy story_audio_delete_admin on brincareducando.historias_audios
  for delete to authenticated
  using ((select brincareducando.has_role((select auth.uid()), 'admin')));

commit;
