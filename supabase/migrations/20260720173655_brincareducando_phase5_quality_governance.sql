-- Phase 5: explicit preference signals and auditable editorial governance.
begin;

alter table brincareducando.recomendacoes_eventos
  drop constraint if exists recomendacoes_eventos_tipo_check;
alter table brincareducando.recomendacoes_eventos
  add constraint recomendacoes_eventos_tipo_check
  check (tipo in ('impression', 'open', 'swap', 'start', 'complete', 'more_like_this', 'less_like_this'));

create index if not exists recomendacoes_eventos_tipo_contexto_idx
  on brincareducando.recomendacoes_eventos (tipo, contexto, created_at desc);

create or replace function brincareducando.quality_snapshot()
returns table (
  atividades_publicadas bigint,
  atividades_revisao_pendente bigint,
  atividades_revisao_vencida bigint,
  historias_publicadas bigint,
  historias_revisao_vencida bigint,
  atividades_por_faixa jsonb,
  atividades_por_contexto jsonb
)
language sql stable security definer set search_path = brincareducando, pg_catalog, pg_temp as $$
  select
    (select count(*) from atividades where publicado is true),
    (select count(*) from atividades where status_editorial in ('revisao_pendente', 'revisao_pedagogica', 'revisao_seguranca')),
    (select count(*) from atividades where publicado is true and proxima_revisao is not null and proxima_revisao < current_date),
    (select count(*) from historias where publicado is true),
    (select count(*) from historias where publicado is true and proxima_revisao is not null and proxima_revisao < current_date),
    (select coalesce(jsonb_object_agg(faixa, total), '{}'::jsonb) from (
      select case when idade_max_meses < 24 then '0-23m' when idade_min_meses <= 24 and idade_max_meses >= 24 then '24-35m' when idade_min_meses <= 48 and idade_max_meses >= 48 then '36-59m' else '60m+' end faixa, count(*) total
      from atividades where publicado is true group by 1
    ) faixas),
    (select coalesce(jsonb_object_agg(contexto, total), '{}'::jsonb) from (
      select coalesce(local, 'não informado') contexto, count(*) total from atividades where publicado is true group by 1
    ) contextos)
  where brincareducando.has_role(auth.uid(), 'admin');
$$;
revoke all on function brincareducando.quality_snapshot() from public, anon;
grant execute on function brincareducando.quality_snapshot() to authenticated;
commit;
