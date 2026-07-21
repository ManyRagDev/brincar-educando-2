-- Phase 6: make dashboard feedback persistable and keep supplemental seed
-- activities safely out of the published catalogue until editorial review.

alter table brincareducando.recomendacoes_eventos
  drop constraint if exists recomendacoes_eventos_tipo_check;

alter table brincareducando.recomendacoes_eventos
  add constraint recomendacoes_eventos_tipo_check check (
    tipo in (
      'impression',
      'open',
      'swap',
      'start',
      'complete',
      'more_like_this',
      'less_like_this'
    )
  );

-- The supplemental sensorial seed does not yet include the complete publication
-- contract introduced in phase 2. Keep imported rows as an editorial backlog.
update brincareducando.atividades
set
  slug = case codigo_externo
    when 'atividade_051' then 'massagem-com-flanela-macia'
    when 'atividade_052' then 'bolhas-de-sabao-para-tocar'
    when 'atividade_053' then 'frutas-na-palma-da-mao'
    when 'atividade_054' then 'caixa-do-toque-misterioso'
    when 'atividade_055' then 'pintura-com-os-pes'
    when 'atividade_056' then 'jardineiro-descalco'
    else slug
  end,
  publicado = false,
  status_editorial = 'revisao_pendente',
  updated_at = now()
where codigo_externo in (
  'atividade_051', 'atividade_052', 'atividade_053',
  'atividade_054', 'atividade_055', 'atividade_056'
);
