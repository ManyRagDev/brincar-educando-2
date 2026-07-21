# Documento Mestre — Brincar Educando

> Fonte de verdade da implementação. Atualize este documento junto com mudanças de produto, dados, segurança ou conteúdo.

## Visão do produto

O Brincar Educando ajuda responsáveis a encontrar, viver e guardar experiências de brincar, conversa e leitura com crianças pequenas. Não mede desenvolvimento, não compara crianças, não cria streaks e não oferece diagnóstico.

Princípios: convite em vez de obrigação; vínculo adulto-criança antes de desempenho; personalização por sinais explícitos; conteúdo com fonte e revisão; privacidade por padrão; alternativas acessíveis para fala, movimento, materiais e tela.

## Dashboard “Hoje”

Rota: `/dashboard`.

- saudação no horário de São Paulo e seletor da criança ativa;
- check-in opcional: pouco tempo, movimento, desacelerar, sem materiais, exterior ou adulto cansado;
- recomendação principal, alternativa mais simples e outro clima;
- explicação de por que o convite foi sugerido;
- troca com motivo opcional;
- feedback explícito “mais como esta” e “menos como esta”;
- estados de primeira visita, vazio, erro e ausência de compatibilidade;
- eventos minimizados de impressão, abertura, troca, início e conclusão.

O ranking determinístico atual é `v1`: idade 30, contexto 20, interesses 15, baixo atrito 15, variedade 10 e feedback 10. Ele nunca infere diagnóstico, humor ou capacidade.

## Atividades

Rotas: `/atividades`, `/atividades/[slug]` e `/atividade-ativa/[slug]`.

Cada atividade publicada contém fase indicada, segurança, materiais, preparo, passos, prompts, adaptações, sinais para observar/parar, variações, fontes, versão e revisão editorial. O modo Brincar permite pausar ou encerrar sem culpa; cronômetro é opcional. A reflexão posterior é observacional, não avaliativa.

O catálogo em produção é a tabela `atividades` do Supabase; os arquivos `supabase/seed_*.sql` e `public/atividades/atividades_brincar_educando.json` são insumos de carga e referência, não fontes lidas pela interface. Apenas itens com `publicado = true` e `slug` podem aparecer no dashboard. O lote `atividade_001` a `atividade_030` está preparado para publicação; os lotes posteriores permanecem em revisão editorial até cumprirem o contrato de segurança, fontes e revisão.

## Diário e Jornada

Rotas: `/diario`, `/diario/nova` e `/jornada`.

O Diário unifica memórias livres, falas, descobertas, desafios, risos, fotos privadas, atividades e leituras. Permite editar, excluir e exportar JSON.

Fotos usam o bucket privado `brincareducando-diario-privado`, aceitam JPEG/PNG/WebP até 5 MB e são exibidas com URL assinada temporária. A exportação não inclui o arquivo nem URL pública da foto.

A Jornada devolve repertório e padrões descritivos. Uma preferência só é mostrada após três experiências positivas recentes e predominância de uma categoria; a linguagem é probabilística e lembra que preferências mudam.

## Brincontos

Rotas: `/historias` e `/historias/[slug]/ler`.

Histórias autorais para co-leitura, não aulas. Cada Brinconto tem páginas, texto alternativo, pausas opcionais, perguntas abertas, extensão familiar, fonte, versão e revisão. A sessão privada por criança registra apenas página, conclusão, sinais opcionais e nota familiar.

Lote inicial: A semente que escutava; O guarda-chuva de nuvem; O trem das coisas pequenas; Lila e a ponte de caixas; Boa-noite, lua redonda.

## Arquitetura e dados

Next.js App Router, Supabase Auth e schema `brincareducando`. A criança ativa é centralizada em `getActiveChild`.

Principais tabelas:

- família: `criancas`, `diario_entradas`, `diario_midias`, `atividades_execucoes`, `historias_sessoes`;
- conteúdo: `atividades`, `historias`, `historias_textos`, `historias_prompts`, `historias_extensoes`;
- evidência: `conteudos_fontes`, `atividades_fontes`, `historias_fontes`, `revisoes_conteudo`;
- personalização: `recomendacoes_eventos` (impressão, abertura, troca, início, conclusão e feedback explícito “mais/menos como esta”).

Registros familiares usam FKs compostas `(crianca_id, usuario_id)` e RLS por responsável. Conteúdo editorial só é gravável por administrador. Novas tabelas de Brincontos não possuem `SELECT` para `anon`.

## Qualidade e governança

`/admin/qualidade` mostra, apenas para administradores, cobertura por faixa/ambiente, conteúdo publicado e revisões pendentes/vencidas. Não mostra dados familiares.

Referências-base registradas: AAP *The Power of Play*, Harvard *Serve and Return* e Ministério da Saúde — Caderneta da Criança. Elas sustentam interação responsiva e brincar compartilhado; não prometem resultados individuais.

## Evidências técnicas

- testes de isolamento entre famílias para criança, mídia privada e sessão de leitura;
- RLS e grants verificados no Supabase;
- typecheck, testes, lint e build de produção aprovados;
- migrations em `supabase/migrations/`;
- contrato e baseline em `supabase/EXPECTED_SCHEMA.md` e `supabase/REMOTE_BASELINE.md`.

## Pendência externa obrigatória

Antes de ampliar catálogo ou alterar materialmente o recomendador, realizar piloto com 5–8 cuidadores e parecer de profissionais de educação infantil e saúde/desenvolvimento. O roteiro e critérios estão em `docs/VALIDACAO_COM_CUIDADORES_E_PROFISSIONAIS.md`.
