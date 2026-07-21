-- Phase 2: structured, traceable and safety-aware activity content.

alter table brincareducando.atividades
  add column resumo text,
  add column justificativa_fase text,
  add column dominio_primario text,
  add column dominios_secundarios text[] not null default '{}',
  add column energia_adulto text check (energia_adulto in ('baixa', 'media', 'alta')),
  add column nivel_bagunca text check (nivel_bagunca in ('baixa', 'media', 'alta')),
  add column participantes_min smallint not null default 2 check (participantes_min between 1 and 20),
  add column participantes_max smallint check (participantes_max is null or participantes_max between participantes_min and 30),
  add column materiais_estruturados jsonb not null default '[]'::jsonb check (jsonb_typeof(materiais_estruturados) = 'array'),
  add column preparacao text[] not null default '{}',
  add column encerramento text[] not null default '{}',
  add column prompts_interacao text[] not null default '{}',
  add column sinais_interesse text[] not null default '{}',
  add column sinais_adaptar_parar text[] not null default '{}',
  add column variacoes jsonb not null default '{}'::jsonb check (jsonb_typeof(variacoes) = 'object'),
  add column adaptacoes_inclusivas jsonb not null default '[]'::jsonb check (jsonb_typeof(adaptacoes_inclusivas) = 'array'),
  add column seguranca jsonb not null default '{}'::jsonb check (jsonb_typeof(seguranca) = 'object'),
  add column status_editorial text not null default 'rascunho' check (
    status_editorial in ('rascunho', 'revisao_pedagogica', 'revisao_seguranca', 'publicado', 'arquivado', 'revisao_pendente')
  ),
  add column conteudo_versao integer not null default 1 check (conteudo_versao > 0),
  add column revisado_por text,
  add column revisado_em timestamptz,
  add column proxima_revisao date;

alter table brincareducando.atividades_execucoes
  add column percepcao text check (percepcao is null or percepcao in ('gostou', 'mais_ou_menos', 'nao_era_o_momento')),
  add column observacoes_sinais text[] not null default '{}',
  add column motivo_encerramento text check (
    motivo_encerramento is null or motivo_encerramento in ('concluida', 'perdeu_interesse', 'adaptada', 'adulto_cansou', 'crianca_cansou', 'outro')
  ),
  add column atividade_versao integer,
  add column recomendacao_chave text,
  add column contexto_recomendacao text;

alter table brincareducando.recomendacoes_eventos
  drop constraint recomendacoes_eventos_tipo_check,
  add constraint recomendacoes_eventos_tipo_check check (tipo in ('impression', 'open', 'swap', 'start', 'complete'));

create table brincareducando.conteudos_fontes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  titulo text not null,
  organizacao_autoria text not null,
  url text not null check (url ~ '^https://'),
  doi text,
  publicado_em date,
  tipo_evidencia text not null,
  resumo_editorial text not null,
  consultado_em date not null,
  proxima_revisao date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table brincareducando.atividades_fontes (
  atividade_id uuid not null references brincareducando.atividades(id) on delete cascade,
  fonte_id uuid not null references brincareducando.conteudos_fontes(id) on delete restrict,
  afirmacao_sustentada text not null,
  created_at timestamptz not null default now(),
  primary key (atividade_id, fonte_id)
);

create table brincareducando.atividades_adaptacoes (
  id uuid primary key default gen_random_uuid(),
  atividade_id uuid not null references brincareducando.atividades(id) on delete cascade,
  contexto text not null,
  titulo text not null,
  orientacao text not null,
  ordem smallint not null default 0,
  created_at timestamptz not null default now()
);

create table brincareducando.revisoes_conteudo (
  id uuid primary key default gen_random_uuid(),
  atividade_id uuid not null references brincareducando.atividades(id) on delete cascade,
  tipo text not null check (tipo in ('editorial', 'pedagogica', 'seguranca', 'cientifica')),
  status text not null check (status in ('pendente', 'ajustes_solicitados', 'aprovado')),
  revisor text not null,
  parecer text not null,
  revisado_em timestamptz not null default now(),
  proxima_revisao date,
  created_at timestamptz not null default now()
);

create index atividades_status_editorial_idx on brincareducando.atividades (status_editorial, publicado);
create index atividades_fontes_fonte_idx on brincareducando.atividades_fontes (fonte_id);
create index atividades_adaptacoes_atividade_ordem_idx on brincareducando.atividades_adaptacoes (atividade_id, ordem);
create index revisoes_conteudo_atividade_data_idx on brincareducando.revisoes_conteudo (atividade_id, revisado_em desc);
create index atividades_execucoes_atividade_idx on brincareducando.atividades_execucoes (atividade_id);
create index atividades_execucoes_crianca_owner_idx on brincareducando.atividades_execucoes (crianca_id, usuario_id);

alter table brincareducando.conteudos_fontes enable row level security;
alter table brincareducando.atividades_fontes enable row level security;
alter table brincareducando.atividades_adaptacoes enable row level security;
alter table brincareducando.revisoes_conteudo enable row level security;

create policy sources_select_authenticated on brincareducando.conteudos_fontes
  for select to authenticated using (true);
create policy sources_insert_admin on brincareducando.conteudos_fontes
  for insert to authenticated with check ((select brincareducando.has_role((select auth.uid()), 'admin')));
create policy sources_update_admin on brincareducando.conteudos_fontes
  for update to authenticated using ((select brincareducando.has_role((select auth.uid()), 'admin')))
  with check ((select brincareducando.has_role((select auth.uid()), 'admin')));
create policy sources_delete_admin on brincareducando.conteudos_fontes
  for delete to authenticated using ((select brincareducando.has_role((select auth.uid()), 'admin')));

create policy activity_sources_select_authenticated on brincareducando.atividades_fontes
  for select to authenticated using (true);
create policy activity_sources_insert_admin on brincareducando.atividades_fontes
  for insert to authenticated with check ((select brincareducando.has_role((select auth.uid()), 'admin')));
create policy activity_sources_update_admin on brincareducando.atividades_fontes
  for update to authenticated using ((select brincareducando.has_role((select auth.uid()), 'admin')))
  with check ((select brincareducando.has_role((select auth.uid()), 'admin')));
create policy activity_sources_delete_admin on brincareducando.atividades_fontes
  for delete to authenticated using ((select brincareducando.has_role((select auth.uid()), 'admin')));

create policy adaptations_select_authenticated on brincareducando.atividades_adaptacoes
  for select to authenticated using (true);
create policy adaptations_insert_admin on brincareducando.atividades_adaptacoes
  for insert to authenticated with check ((select brincareducando.has_role((select auth.uid()), 'admin')));
create policy adaptations_update_admin on brincareducando.atividades_adaptacoes
  for update to authenticated using ((select brincareducando.has_role((select auth.uid()), 'admin')))
  with check ((select brincareducando.has_role((select auth.uid()), 'admin')));
create policy adaptations_delete_admin on brincareducando.atividades_adaptacoes
  for delete to authenticated using ((select brincareducando.has_role((select auth.uid()), 'admin')));

create policy reviews_select_authenticated on brincareducando.revisoes_conteudo
  for select to authenticated using (status = 'aprovado');
create policy reviews_insert_admin on brincareducando.revisoes_conteudo
  for insert to authenticated with check ((select brincareducando.has_role((select auth.uid()), 'admin')));
create policy reviews_update_admin on brincareducando.revisoes_conteudo
  for update to authenticated using ((select brincareducando.has_role((select auth.uid()), 'admin')))
  with check ((select brincareducando.has_role((select auth.uid()), 'admin')));
create policy reviews_delete_admin on brincareducando.revisoes_conteudo
  for delete to authenticated using ((select brincareducando.has_role((select auth.uid()), 'admin')));

revoke all on table brincareducando.conteudos_fontes, brincareducando.atividades_fontes,
  brincareducando.atividades_adaptacoes, brincareducando.revisoes_conteudo from public, anon, authenticated;
grant select, insert, update, delete on table brincareducando.conteudos_fontes,
  brincareducando.atividades_fontes, brincareducando.atividades_adaptacoes,
  brincareducando.revisoes_conteudo to authenticated;

insert into brincareducando.conteudos_fontes
  (slug, titulo, organizacao_autoria, url, doi, publicado_em, tipo_evidencia, resumo_editorial, consultado_em, proxima_revisao)
values
  ('aap-power-of-play', 'The Power of Play: A Pediatric Role in Enhancing Development in Young Children',
   'American Academy of Pediatrics',
   'https://publications.aap.org/pediatrics/article/142/3/e20182058/38649/The-Power-of-Play-A-Pediatric-Role-in-Enhancing',
   '10.1542/peds.2018-2058', '2018-09-01', 'relatorio_clinico_reafirmado_2025',
   'Sustenta brincadeira apropriada à fase, vínculo responsivo, participação ativa e descoberta prazerosa; não sustenta promessas individuais por atividade.',
   '2026-07-20', '2027-01-20'),
  ('harvard-serve-and-return', 'Serve and Return', 'Center on the Developing Child at Harvard University',
   'https://developingchild.harvard.edu/key-concept/serve-and-return/', null, null, 'sintese_institucional_de_evidencias',
   'Sustenta trocas responsivas: notar a iniciativa, responder e dar tempo para a criança continuar a interação.',
   '2026-07-20', '2027-01-20'),
  ('ms-caderneta-crianca', 'Caderneta da Criança', 'Ministério da Saúde do Brasil',
   'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-da-crianca/caderneta/caderneta', null, null,
   'orientacao_institucional',
   'Orienta cuidado integral, prevenção de acidentes e acompanhamento do desenvolvimento com profissionais; o aplicativo não substitui esse acompanhamento.',
   '2026-07-20', '2027-01-20')
on conflict (slug) do update set
  titulo = excluded.titulo,
  organizacao_autoria = excluded.organizacao_autoria,
  url = excluded.url,
  doi = excluded.doi,
  tipo_evidencia = excluded.tipo_evidencia,
  resumo_editorial = excluded.resumo_editorial,
  consultado_em = excluded.consultado_em,
  proxima_revisao = excluded.proxima_revisao,
  updated_at = now();

update brincareducando.atividades
set publicado = false,
    status_editorial = 'revisao_pendente'
where publicado is true
  and codigo_externo !~ '^atividade_0(0[1-9]|[12][0-9]|30)$';

update brincareducando.atividades
set resumo = left(coalesce(descricao, titulo), 320),
    justificativa_fase = case
      when idade_max_meses <= 12 then 'Convite breve, sensorial e relacional, com o adulto perto e atento aos sinais do bebê.'
      when idade_max_meses <= 36 then 'A proposta permite exploração ativa, repetição e ajuda do adulto sem exigir um resultado pronto.'
      else 'A proposta abre espaço para escolha, imaginação e conversa, com desafio ajustável e sem transformar a brincadeira em teste.'
    end,
    dominio_primario = coalesce(categoria, 'brincar compartilhado'),
    dominios_secundarios = coalesce(beneficios, '{}'),
    energia_adulto = case when coalesce(preparo_minutos, 0) <= 3 then 'baixa' when preparo_minutos <= 10 then 'media' else 'alta' end,
    nivel_bagunca = case
      when lower(titulo) ~ 'água|gelo|pintura|tinta' then 'alta'
      when lower(titulo) ~ 'papel|caixa|cozinha|panela' then 'media'
      else 'baixa'
    end,
    participantes_min = 2,
    participantes_max = null,
    materiais_estruturados = coalesce((
      select jsonb_agg(jsonb_build_object('nome', material, 'substituicoes', '[]'::jsonb))
      from unnest(coalesce(materiais, '{}')) material
    ), '[]'::jsonb),
    preparacao = array[
      'Leia os avisos de segurança e separe apenas o que for adequado para a criança.',
      'Abra espaço suficiente e deixe os materiais ao alcance, sem montar um resultado para ela copiar.'
    ],
    encerramento = array[
      'Avise com calma que a brincadeira vai terminar e convide a criança a participar da organização, se quiser.',
      'Nomeie algo que vocês viveram juntos, sem avaliar desempenho.'
    ],
    prompts_interacao = case coalesce(categoria, '')
      when 'sensorial' then array['O que você percebeu?', 'Quer tocar de outro jeito?', 'Eu vi que você voltou para isso.']
      when 'movimento' then array['Quer tentar de outro jeito?', 'Você quer que eu faça junto?', 'Seu corpo está pedindo uma pausa?']
      when 'cognitiva' then array['O que você acha que pode acontecer?', 'Quer tentar mais uma vez ou mudar a ideia?', 'Mostra para mim como você pensou.']
      else array['Me conta sobre o que você criou.', 'O que acontece depois?', 'Quer que eu participe ou só observe?']
    end,
    sinais_interesse = array[
      'Voltar espontaneamente para o material ou ação.',
      'Olhar, apontar, vocalizar, sorrir ou convidar o adulto a participar.',
      'Repetir uma ação para observar novamente o que acontece.'
    ],
    sinais_adaptar_parar = array[
      'Afastar o corpo, virar o rosto, ficar irritada ou pedir para parar.',
      'Perder o interesse repetidamente: encerrar cedo também é uma conclusão válida.',
      'Qualquer risco, desconforto ou material danificado: interrompa imediatamente.'
    ],
    variacoes = jsonb_build_object(
      'simplificar', 'Ofereça menos materiais ou faça apenas o primeiro passo.',
      'ampliar', 'Convide a criança a inventar uma regra, uso ou continuação.',
      'repetir', 'Repita em outro dia mudando somente um elemento familiar.'
    ),
    adaptacoes_inclusivas = jsonb_build_array(
      jsonb_build_object('contexto', 'participacao', 'orientacao', 'A criança pode observar, apontar, escolher, fazer sentada ou participar com ajuda; presença conjunta também conta.'),
      jsonb_build_object('contexto', 'sensorial', 'orientacao', 'Apresente um estímulo por vez e permita distância, pausa ou recusa sem insistência.')
    ),
    seguranca = jsonb_build_object(
      'supervisao', case when idade_max_meses <= 36 then 'adulto ao alcance durante toda a proposta' else 'adulto presente e ambiente previamente verificado' end,
      'riscos', case
        when lower(titulo) ~ 'água|gelo' then jsonb_build_array('piso molhado e escorregadio', 'ingestão de materiais não alimentares')
        when lower(titulo) ~ 'pular|obstáculo|dança|cadeira' then jsonb_build_array('quedas e colisões', 'móveis ou piso instáveis')
        when lower(titulo) ~ 'tampa|botão|feijão|arroz|letra|objeto pequeno' or idade_max_meses <= 36 then jsonb_build_array('peças pequenas e risco de engasgo')
        else jsonb_build_array('materiais danificados, pontiagudos ou inadequados à idade')
      end,
      'orientacoes', jsonb_build_array(
        'Inspecione, higienize e adapte todos os materiais antes de começar.',
        'Não use peças pequenas com crianças que ainda levam objetos à boca.',
        'A proposta deve parar ao primeiro sinal de desconforto ou risco.'
      )
    ),
    status_editorial = 'publicado',
    conteudo_versao = 2,
    revisado_por = 'Equipe editorial Brincar Educando — triagem inicial',
    revisado_em = now(),
    proxima_revisao = date '2027-01-20',
    publicado = true,
    updated_at = now()
where codigo_externo ~ '^atividade_0(0[1-9]|[12][0-9]|30)$';

insert into brincareducando.atividades_fontes (atividade_id, fonte_id, afirmacao_sustentada)
select a.id, f.id,
  case f.slug
    when 'aap-power-of-play' then 'Princípios gerais de brincadeira apropriada à fase, prazerosa e compartilhada.'
    when 'harvard-serve-and-return' then 'Mediação responsiva: observar a iniciativa, responder e dar tempo para nova interação.'
    else 'Segurança, prevenção de acidentes e limite educacional do aplicativo.'
  end
from brincareducando.atividades a
cross join brincareducando.conteudos_fontes f
where a.codigo_externo ~ '^atividade_0(0[1-9]|[12][0-9]|30)$'
  and f.slug in ('aap-power-of-play', 'harvard-serve-and-return', 'ms-caderneta-crianca')
on conflict (atividade_id, fonte_id) do update set afirmacao_sustentada = excluded.afirmacao_sustentada;

insert into brincareducando.atividades_adaptacoes (atividade_id, contexto, titulo, orientacao, ordem)
select id, 'participacao', 'Participar de outro jeito',
  'Convide a criança a escolher, observar, apontar ou fazer junto. Não é necessário executar todos os passos.', 0
from brincareducando.atividades
where codigo_externo ~ '^atividade_0(0[1-9]|[12][0-9]|30)$';

insert into brincareducando.revisoes_conteudo
  (atividade_id, tipo, status, revisor, parecer, revisado_em, proxima_revisao)
select id, 'editorial', 'aprovado', 'Equipe editorial Brincar Educando — triagem inicial',
  'Linguagem causal removida da experiência principal; adicionados mediação responsiva, segurança, sinais de pausa, variações, adaptações e fontes institucionais. Requer revisão periódica e revisão profissional quando houver nova alegação específica.',
  now(), date '2027-01-20'
from brincareducando.atividades
where codigo_externo ~ '^atividade_0(0[1-9]|[12][0-9]|30)$';

alter table brincareducando.atividades
  add constraint atividades_publicadas_contrato_check check (
    publicado is not true or (
      status_editorial = 'publicado'
      and resumo is not null
      and justificativa_fase is not null
      and dominio_primario is not null
      and array_length(preparacao, 1) > 0
      and array_length(encerramento, 1) > 0
      and array_length(prompts_interacao, 1) > 0
      and array_length(sinais_adaptar_parar, 1) > 0
      and seguranca <> '{}'::jsonb
      and revisado_em is not null
      and proxima_revisao is not null
    )
  );
