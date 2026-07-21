-- Phase 4: editorial Brincontos, private reading sessions and family conversation.
begin;

alter table brincareducando.historias
  add column if not exists slug text,
  add column if not exists tema text,
  add column if not exists momento text not null default 'qualquer_momento',
  add column if not exists proposta_familiar text,
  add column if not exists linguagem_acessivel text,
  add column if not exists status_editorial text not null default 'rascunho',
  add column if not exists conteudo_versao integer not null default 1,
  add column if not exists revisado_por text,
  add column if not exists revisado_em timestamptz,
  add column if not exists proxima_revisao date;

update brincareducando.historias
set slug = coalesce(slug, 'historia-' || id::text)
where slug is null;

alter table brincareducando.historias
  alter column slug set not null,
  add constraint historias_slug_key unique (slug),
  add constraint historias_momento_check check (momento in ('acordar', 'desacelerar', 'transicao', 'natureza', 'qualquer_momento')),
  add constraint historias_status_editorial_check check (status_editorial in ('rascunho', 'revisao_pedagogica', 'revisao_editorial', 'publicado', 'arquivado')),
  add constraint historias_versao_check check (conteudo_versao > 0),
  add constraint historias_faixa_etaria_check check (faixa_etaria_min >= 0 and faixa_etaria_max >= faixa_etaria_min),
  add constraint historias_publicadas_revisadas_check check (
    publicado is not true or (
      status_editorial = 'publicado'
      and revisado_por is not null
      and revisado_em is not null
      and proposta_familiar is not null
    )
  );

alter table brincareducando.historias_textos
  add column if not exists titulo_pagina text,
  add column if not exists texto_alternativo text,
  add column if not exists imagem_url text,
  add column if not exists prompt_pausa text;

alter table brincareducando.historias_textos
  add constraint historias_textos_ordem_unica unique (historia_id, ordem),
  add constraint historias_textos_conteudo_tamanho_check check (char_length(btrim(conteudo)) between 1 and 3000);

create table if not exists brincareducando.historias_prompts (
  id uuid primary key default gen_random_uuid(),
  historia_id uuid not null references brincareducando.historias(id) on delete cascade,
  tipo text not null,
  pergunta text not null,
  orientacao_adulto text,
  ordem smallint not null default 0,
  created_at timestamptz not null default now(),
  constraint historias_prompts_tipo_check check (tipo in ('antes', 'durante', 'depois')),
  constraint historias_prompts_pergunta_check check (char_length(btrim(pergunta)) between 3 and 500),
  constraint historias_prompts_ordem_unica unique (historia_id, tipo, ordem)
);

create table if not exists brincareducando.historias_extensoes (
  id uuid primary key default gen_random_uuid(),
  historia_id uuid not null references brincareducando.historias(id) on delete cascade,
  titulo text not null,
  descricao text not null,
  tipo text not null default 'brincadeira',
  materiais text[] not null default '{}',
  duracao_minutos smallint,
  ordem smallint not null default 0,
  created_at timestamptz not null default now(),
  constraint historias_extensoes_tipo_check check (tipo in ('brincadeira', 'conversa', 'arte', 'movimento', 'observacao')),
  constraint historias_extensoes_duracao_check check (duracao_minutos is null or duracao_minutos between 1 and 60),
  constraint historias_extensoes_ordem_unica unique (historia_id, ordem)
);

create table if not exists brincareducando.historias_fontes (
  historia_id uuid not null references brincareducando.historias(id) on delete cascade,
  fonte_id uuid not null references brincareducando.conteudos_fontes(id) on delete restrict,
  afirmacao_sustentada text not null,
  created_at timestamptz not null default now(),
  primary key (historia_id, fonte_id)
);

create table if not exists brincareducando.historias_sessoes (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  crianca_id uuid not null,
  historia_id uuid not null references brincareducando.historias(id) on delete cascade,
  pagina_atual integer not null default 0,
  concluida boolean not null default false,
  nota_familiar text,
  sinais_observados text[] not null default '{}',
  conteudo_versao integer not null default 1,
  iniciada_em timestamptz not null default now(),
  atualizada_em timestamptz not null default now(),
  constraint historias_sessoes_crianca_owner_fkey foreign key (crianca_id, usuario_id)
    references brincareducando.criancas(id, usuario_id) on delete cascade,
  constraint historias_sessoes_pagina_check check (pagina_atual >= 0),
  constraint historias_sessoes_sinais_check check (sinais_observados <@ array['pediu_mais', 'comentou', 'apontou', 'fez_pergunta', 'preferiu_pausa', 'outro']::text[]),
  constraint historias_sessoes_nota_check check (nota_familiar is null or char_length(nota_familiar) <= 2000)
);

create index if not exists historias_publicadas_filtros_idx on brincareducando.historias (publicado, momento, faixa_etaria_min, faixa_etaria_max);
create index if not exists historias_sessoes_crianca_data_idx on brincareducando.historias_sessoes (crianca_id, atualizada_em desc);

create or replace function brincareducando.update_story_session_timestamp()
returns trigger language plpgsql set search_path = pg_catalog, pg_temp as $$
begin new.atualizada_em = now(); return new; end;
$$;
drop trigger if exists historias_sessoes_atualizada_em on brincareducando.historias_sessoes;
create trigger historias_sessoes_atualizada_em before update on brincareducando.historias_sessoes
for each row execute function brincareducando.update_story_session_timestamp();

alter table brincareducando.historias_prompts enable row level security;
alter table brincareducando.historias_extensoes enable row level security;
alter table brincareducando.historias_fontes enable row level security;
alter table brincareducando.historias_sessoes enable row level security;
grant select, insert, update, delete on brincareducando.historias_prompts, brincareducando.historias_extensoes, brincareducando.historias_fontes, brincareducando.historias_sessoes to authenticated;

create policy story_prompts_select_available on brincareducando.historias_prompts for select to authenticated using (exists (select 1 from brincareducando.historias h where h.id=historia_id and (h.publicado is true or (select brincareducando.has_role((select auth.uid()), 'admin')))));
create policy story_prompts_write_admin on brincareducando.historias_prompts for all to authenticated using ((select brincareducando.has_role((select auth.uid()), 'admin'))) with check ((select brincareducando.has_role((select auth.uid()), 'admin')));
create policy story_extensions_select_available on brincareducando.historias_extensoes for select to authenticated using (exists (select 1 from brincareducando.historias h where h.id=historia_id and (h.publicado is true or (select brincareducando.has_role((select auth.uid()), 'admin')))));
create policy story_extensions_write_admin on brincareducando.historias_extensoes for all to authenticated using ((select brincareducando.has_role((select auth.uid()), 'admin'))) with check ((select brincareducando.has_role((select auth.uid()), 'admin')));
create policy story_sources_select_available on brincareducando.historias_fontes for select to authenticated using (exists (select 1 from brincareducando.historias h where h.id=historia_id and (h.publicado is true or (select brincareducando.has_role((select auth.uid()), 'admin')))));
create policy story_sources_write_admin on brincareducando.historias_fontes for all to authenticated using ((select brincareducando.has_role((select auth.uid()), 'admin'))) with check ((select brincareducando.has_role((select auth.uid()), 'admin')));
create policy story_sessions_select_own on brincareducando.historias_sessoes for select to authenticated using ((select auth.uid()) = usuario_id);
create policy story_sessions_insert_own on brincareducando.historias_sessoes for insert to authenticated with check ((select auth.uid()) = usuario_id);
create policy story_sessions_update_own on brincareducando.historias_sessoes for update to authenticated using ((select auth.uid()) = usuario_id) with check ((select auth.uid()) = usuario_id);
create policy story_sessions_delete_own on brincareducando.historias_sessoes for delete to authenticated using ((select auth.uid()) = usuario_id);

-- Original, short stories. They model co-reading and open conversation rather than lessons.
insert into brincareducando.historias (slug, titulo, descricao, tema, momento, proposta_familiar, linguagem_acessivel, faixa_etaria_min, faixa_etaria_max, duracao_minutos, publicado, status_editorial, conteudo_versao, revisado_por, revisado_em, proxima_revisao)
values
('a-semente-que-escutava', 'A semente que escutava', 'Uma semente curiosa descobre que crescer também é esperar, observar e pedir companhia.', 'natureza', 'natureza', 'Ler devagar, deixar a criança apontar e terminar olhando uma planta, janela ou quintal.', 'Frases curtas; pode ser contada só com gestos e apontar.', 18, 60, 5, true, 'publicado', 1, 'Equipe editorial Brincar Educando', now(), current_date + interval '12 months'),
('o-guarda-chuva-de-nuvem', 'O guarda-chuva de nuvem', 'Nina encontra uma nuvem pequena e aprende que sentimentos podem passar com acolhimento e tempo.', 'emoções', 'desacelerar', 'Acolher qualquer resposta; não pedir que a criança nomeie nem explique o que sente.', 'Pausas opcionais; a criança pode escolher apenas ouvir.', 24, 72, 6, true, 'publicado', 1, 'Equipe editorial Brincar Educando', now(), current_date + interval '12 months'),
('o-trem-das-coisas-pequenas', 'O trem das coisas pequenas', 'Um trem faz paradas para notar sons, texturas e encontros do caminho.', 'curiosidade', 'qualquer_momento', 'Inventar uma parada usando algo que já esteja perto; não há resposta certa.', 'Pode ser lida em trechos; convites sensoriais sempre opcionais.', 18, 60, 5, true, 'publicado', 1, 'Equipe editorial Brincar Educando', now(), current_date + interval '12 months'),
('lila-e-a-ponte-de-caixas', 'Lila e a ponte de caixas', 'Lila e seus vizinhos transformam caixas em uma ponte imaginária para todo mundo atravessar do seu jeito.', 'convivência', 'transicao', 'Convidar a criança a escolher uma forma de atravessar: olhando, contando, empurrando ou imaginando.', 'Sem exigência de movimento; a brincadeira cabe sentada ou só na imaginação.', 30, 84, 6, true, 'publicado', 1, 'Equipe editorial Brincar Educando', now(), current_date + interval '12 months'),
('boa-noite-lua-redonda', 'Boa-noite, lua redonda', 'Antes de dormir, uma lua redonda faz perguntas tranquilas sobre o dia sem precisar de respostas.', 'rotina', 'desacelerar', 'Escolher uma única pergunta ou apenas ouvir juntos. A pausa também encerra bem a história.', 'Ritmo lento, contraste suave e possibilidade de releitura curta.', 12, 60, 4, true, 'publicado', 1, 'Equipe editorial Brincar Educando', now(), current_date + interval '12 months')
on conflict (slug) do update set titulo=excluded.titulo, descricao=excluded.descricao, tema=excluded.tema, momento=excluded.momento, proposta_familiar=excluded.proposta_familiar, linguagem_acessivel=excluded.linguagem_acessivel, publicado=excluded.publicado, status_editorial=excluded.status_editorial, revisado_por=excluded.revisado_por, revisado_em=excluded.revisado_em, proxima_revisao=excluded.proxima_revisao;

insert into brincareducando.historias_textos (historia_id, ordem, titulo_pagina, conteudo, texto_alternativo, prompt_pausa)
select h.id, p.ordem, p.titulo, p.conteudo, p.alt, p.pausa
from brincareducando.historias h
join (values
('a-semente-que-escutava', 1, 'Debaixo da terra', 'No canteiro havia uma semente pequenina. Ela não sabia se já era hora de sair. Então escutou: ploc, uma gota; shhh, uma folha; tum-tum, passos perto dali.', 'Semente sob a terra, gotas e folhas ao redor.', 'Que som você imagina que a semente ouviu?'),
('a-semente-que-escutava', 2, 'Companhia', 'A semente não precisou decidir sozinha. A terra ficou macia, a chuva chegou e o sol apareceu um pouquinho. “Posso esperar”, pensou ela.', 'Sol, chuva e terra cuidando da semente.', 'Queremos ficar em silêncio como a semente por três respirações ou seguir a história?'),
('a-semente-que-escutava', 3, 'Uma pontinha verde', 'Num dia qualquer, uma pontinha verde olhou para fora. Não era grande; era só uma pontinha. Mesmo assim, havia um mundo inteiro para conhecer.', 'Broto verde nasce da terra.', 'O que você acha que o broto gostaria de olhar primeiro?'),
('o-guarda-chuva-de-nuvem', 1, 'Uma nuvem baixinha', 'Nina acordou com uma nuvem baixinha perto do peito. Ela era cinza, macia e fazia “hummm”. Nina não precisou mandar a nuvem embora.', 'Criança observa uma pequena nuvem cinza e macia.', 'Como você acha que a nuvem faz quando está por perto?'),
('o-guarda-chuva-de-nuvem', 2, 'Um lugar seco', 'Vovó abriu um guarda-chuva azul. Debaixo dele cabiam uma pergunta, um colo e um copo d’água. A nuvem ficou ali, menorzinha, por um tempo.', 'Guarda-chuva azul cria um lugar acolhedor para Nina e a nuvem.', 'O que ajuda você quando quer ficar mais pertinho de alguém?'),
('o-guarda-chuva-de-nuvem', 3, 'A nuvem passa', 'Depois, a nuvem foi passear devagar. Nina acenou. Ela sabia: às vezes uma nuvem volta; às vezes o céu fica aberto. Os dois jeitos podem acontecer.', 'Nina acena para a nuvem se afastando em um céu claro.', 'Quer terminar aqui ou contar uma coisa boa bem pequenininha do dia?'),
('o-trem-das-coisas-pequenas', 1, 'Primeira parada', 'O trem Tlim-Tlim não corria. Ele parava onde havia algo pequeno para notar: uma pedra lisinha, uma formiga apressada, uma sombra redonda.', 'Trem pequeno para perto de pedra, formiga e sombra.', 'O que está perto de nós que o trem poderia visitar?'),
('o-trem-das-coisas-pequenas', 2, 'Janela aberta', 'Na segunda parada, o trem escutou o vento. “Cada lugar tem seus sons”, disse a maquinista. Todos fizeram silêncio apenas o tempo que quiseram.', 'Janela aberta com cortina ao vento e trem escutando.', 'Qual som chegou primeiro até você?'),
('o-trem-das-coisas-pequenas', 3, 'Casa de novo', 'Quando voltou, o trem tinha uma coleção invisível: três sons, duas cores e uma surpresa. Ele guardou tudo sem precisar contar para ninguém.', 'Trem volta para casa ao entardecer.', 'Que lembrança invisível você guardaria desta história?'),
('lila-e-a-ponte-de-caixas', 1, 'Caixas no chão', 'Lila encontrou caixas vazias no chão. “Elas podem ser uma ponte”, disse. Caio quis passar por cima. Bia preferiu empurrar uma caixa sentada. Todo mundo começou diferente.', 'Crianças brincam com caixas no chão, cada uma de um jeito.', 'Como você gostaria de chegar até a ponte: andando, olhando ou imaginando?'),
('lila-e-a-ponte-de-caixas', 2, 'Do outro lado', 'A ponte balançou um pouco — era de faz de conta! Lila perguntou: “Precisamos mudar alguma coisa para ficar bom para todos?” E as caixas ganharam espaço.', 'Ponte de caixas é reorganizada para acolher todos.', 'O que deixaria uma brincadeira mais gostosa para você?'),
('lila-e-a-ponte-de-caixas', 3, 'Muitas travessias', 'No fim, ninguém recebeu medalha. Eles só olharam a ponte e riram. Amanhã ela podia virar túnel, casa ou montanha. As caixas não tinham pressa.', 'Crianças observam sua ponte de caixas e riem juntas.', 'O que essa ponte poderia virar amanhã?'),
('boa-noite-lua-redonda', 1, 'A lua pergunta baixinho', 'A lua redonda apareceu na janela e perguntou bem baixinho: “Que parte do dia você quer guardar?” Ninguém precisava responder depressa.', 'Lua redonda aparece na janela de um quarto tranquilo.', 'Quer responder, apontar ou só continuar ouvindo?'),
('boa-noite-lua-redonda', 2, 'Coisas pequenas', 'Uma meia ficou perto da cama. Um copo tomou água. Um abraço se acomodou no travesseiro. A lua achou que as coisas pequenas também mereciam boa-noite.', 'Quarto com objetos simples da rotina noturna e lua pela janela.', 'Que coisa pequena merece boa-noite hoje?'),
('boa-noite-lua-redonda', 3, 'Redonda e calma', '“Amanhã a gente vê o resto”, disse a lua. Ela ficou redonda, calma e quieta. E a casa encontrou um jeito de descansar.', 'Lua suave ilumina uma casa adormecendo.', 'Podemos terminar aqui. Boa-noite.' )
) as p(slug, ordem, titulo, conteudo, alt, pausa) on p.slug=h.slug
on conflict (historia_id, ordem) do update set titulo_pagina=excluded.titulo_pagina, conteudo=excluded.conteudo, texto_alternativo=excluded.texto_alternativo, prompt_pausa=excluded.prompt_pausa;

insert into brincareducando.historias_prompts (historia_id, tipo, pergunta, orientacao_adulto, ordem)
select h.id, p.tipo, p.pergunta, p.orientacao, p.ordem
from brincareducando.historias h join (values
('a-semente-que-escutava','antes','O que uma sementinha pode precisar?','Aceite apontar, gesto ou nenhuma resposta.',1),
('a-semente-que-escutava','depois','Que coisa pequena você quer observar hoje?','Transforme em convite, não tarefa.',1),
('o-guarda-chuva-de-nuvem','antes','Queremos ler juntinhos, com espaço, ou só ouvir?','A criança pode escolher o modo de proximidade.',1),
('o-guarda-chuva-de-nuvem','depois','O que pode ajudar quando uma nuvem chega?','Não associe a história a um diagnóstico ou obrigação de falar.',1),
('o-trem-das-coisas-pequenas','durante','O que o trem poderia notar aqui?','Siga a atenção da criança, mesmo que seja outra coisa.',1),
('o-trem-das-coisas-pequenas','depois','Que som, cor ou surpresa ficou com você?','Uma única palavra já é conversa.',1),
('lila-e-a-ponte-de-caixas','durante','Que jeito de atravessar parece bom agora?','Evite comparar maneiras de brincar.',1),
('lila-e-a-ponte-de-caixas','depois','Como podemos fazer espaço para mais alguém?','Conecte à brincadeira, sem transformar em lição moral.',1),
('boa-noite-lua-redonda','antes','Queremos ouvir uma história curta ou só olhar as imagens imaginadas?','A rotina pode terminar a qualquer página.',1),
('boa-noite-lua-redonda','depois','Qual parte do dia merece boa-noite?','Ofereça silêncio como resposta válida.',1)
) as p(slug,tipo,pergunta,orientacao,ordem) on p.slug=h.slug
on conflict (historia_id,tipo,ordem) do update set pergunta=excluded.pergunta, orientacao_adulto=excluded.orientacao_adulto;

insert into brincareducando.historias_extensoes (historia_id, titulo, descricao, tipo, materiais, duracao_minutos, ordem)
select h.id, e.titulo, e.descricao, e.tipo, e.materiais, e.duracao, e.ordem
from brincareducando.historias h join (values
('a-semente-que-escutava','Caça aos sons pequenos','Sentem juntos e escolham um som para imitar ou apenas escutar.','observacao',array[]::text[],5,1),
('o-guarda-chuva-de-nuvem','Um lugar de acolher','Abram um pano, guarda-chuva fechado ou braços como um lugar imaginário.','brincadeira',array['pano ou guarda-chuva opcional'],5,1),
('o-trem-das-coisas-pequenas','Parada da janela','Escolham uma coisa para observar por um minuto, sem precisar descrever.','observacao',array[]::text[],3,1),
('lila-e-a-ponte-de-caixas','Ponte do nosso jeito','Empilhem, alinhem ou só desenhem uma ponte com materiais seguros e grandes.','brincadeira',array['caixas grandes ou almofadas'],10,1),
('boa-noite-lua-redonda','Boa-noite para três coisas','Cada pessoa escolhe algo simples para desejar boa-noite; vale apontar.','conversa',array[]::text[],3,1)
) as e(slug,titulo,descricao,tipo,materiais,duracao,ordem) on e.slug=h.slug
on conflict (historia_id,ordem) do update set titulo=excluded.titulo, descricao=excluded.descricao, tipo=excluded.tipo, materiais=excluded.materiais, duracao_minutos=excluded.duracao_minutos;

insert into brincareducando.historias_fontes (historia_id, fonte_id, afirmacao_sustentada)
select h.id, f.id, 'A leitura compartilhada com pausas e conversa responsiva favorece interação adulto-criança; a história não mede desenvolvimento.'
from brincareducando.historias h cross join brincareducando.conteudos_fontes f
where f.slug in ('harvard-serve-and-return','aap-power-of-play')
on conflict (historia_id,fonte_id) do update set afirmacao_sustentada=excluded.afirmacao_sustentada;

commit;
