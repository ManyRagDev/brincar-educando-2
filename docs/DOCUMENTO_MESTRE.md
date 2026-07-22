# Documento Mestre — Brincar Educando

> Documento de referência do projeto. Ele reúne a identidade do produto, seus limites, a arquitetura em uso e as regras de evolução. Atualize-o na mesma entrega que alterar produto, dados, segurança, conteúdo, integrações ou operação.

**Status:** ativo

**Produto:** Brincar Educando

**Idioma e público prioritários:** português do Brasil; responsáveis por crianças na primeira infância
**Última consolidação:** 21 de julho de 2026

## 1. Identidade do produto

O Brincar Educando é uma aplicação de apoio à parentalidade que ajuda responsáveis a encontrar, viver e guardar experiências possíveis de brincar, conversa e leitura com crianças pequenas. A proposta é tornar o cotidiano mais intencional, acolhedor e viável, sem transformar a infância em desempenho.

O produto combina:

- convites de atividades adequados à idade e ao contexto do momento;
- um Diário privado para memórias, falas, descobertas, desafios, risos, atividades e leituras;
- Brincontos para leitura compartilhada;
- uma Jornada que devolve padrões descritivos e repertório, sem avaliação;
- conteúdo editorial e blog para apoiar decisões cotidianas;
- uma área administrativa de qualidade editorial.

### Visão

Ser um companheiro confiável para famílias que desejam criar mais momentos de vínculo, brincadeira e escuta na primeira infância.

### Propósito

Oferecer ideias simples e bem cuidadas que ajudem o adulto a estar presente com a criança — inclusive quando há pouco tempo, poucos materiais ou pouca energia.

### Princípios inegociáveis

1. **Convite, nunca obrigação.** A pessoa pode adaptar, pausar, trocar ou encerrar uma experiência sem culpa.
2. **Vínculo antes de desempenho.** O produto valoriza interação, curiosidade e presença; não otimização de resultados.
3. **A criança não é uma métrica.** Não há notas, rankings, streaks, comparações entre crianças, diagnósticos ou promessas de desenvolvimento individual.
4. **Personalização explícita.** Recomendações usam idade, interesses e sinais fornecidos pela família; não inferem humor, capacidade, diagnóstico ou condição de saúde.
5. **Privacidade por padrão.** Registros familiares e fotos são privados, isolados por responsável e acessados sob o mínimo privilégio necessário.
6. **Conteúdo responsável.** Atividades e histórias precisam de segurança, adequação de faixa etária, fontes e revisão editorial.
7. **Acessibilidade prática.** Cada experiência deve considerar alternativas para fala, movimento, materiais, telas e diferentes contextos familiares.
8. **Linguagem acolhedora.** A comunicação evita culpa, prescrição rígida, rotulagem e medicalização.

### O que o produto não é

- serviço médico, psicológico, terapêutico ou de diagnóstico;
- substituto de orientação de profissionais de saúde, educação ou desenvolvimento infantil;
- ferramenta de vigilância, avaliação escolar ou comparação de crianças;
- rede social pública para expor dados, fotos ou trajetórias familiares.

## 2. Pessoas atendidas e proposta de valor

### Público principal

Responsáveis e cuidadores de crianças na primeira infância que buscam ideias de qualidade para o dia a dia, com linguagem simples, baixa fricção e respeito ao ritmo de cada família.

### Necessidades que o produto atende

| Situação | Resposta do Brincar Educando |
| --- | --- |
| “O que podemos fazer agora?” | Recomendação contextual no dashboard, com alternativas simples e de outro clima. |
| “Quero registrar este momento.” | Diário privado, editável, exportável e vinculado à criança ativa. |
| “Quero ler junto.” | Biblioteca de Brincontos com leitura pausável e registro privado da sessão. |
| “O que tem funcionado para nós?” | Jornada com padrões descritivos e linguagem probabilística. |
| “Preciso confiar no conteúdo.” | Segurança, fontes, revisão editorial e governança de qualidade. |

## 3. Experiência, módulos e rotas

### Área pública

| Rota | Papel |
| --- | --- |
| `/` | Landing page e apresentação da proposta. |
| `/sobre` | Identidade e propósito institucional. |
| `/privacidade` | Informação de privacidade e tratamento de dados. |
| `/termos` | Termos de uso. |
| `/blog` e `/blog/[slug]` | Conteúdo editorial em MDX. |
| `/loja` | Área de produtos/ofertas. |
| `/auth` | Entrada e autenticação. |
| `/auth/callback` | Retorno do provedor de autenticação. |
| `/auth/access-denied` | Aviso para conta autenticada sem acesso ao produto. |

### Entrada e perfil familiar

| Rota | Papel |
| --- | --- |
| `/onboarding` | Início da configuração da família e da criança. |
| `/perfil` | Perfil e dados da criança. |
| `/configuracoes` | Preferências e configurações da conta. |
| `/mais` | Hub autenticado de orientações, BrinContos, perfil e preferências. |

A criança ativa é uma noção central do aplicativo: a seleção é resolvida em `lib/children/active-child.ts` e usada para isolar o contexto de atividades, Diário, histórias e Jornada.

### Hoje e recomendações

**Rota:** `/dashboard`.

O dashboard apresenta uma saudação no fuso de São Paulo, a criança ativa e um check-in opcional do momento:

- temos 5 minutos;
- queremos movimento;
- precisamos desacelerar;
- estamos sem materiais;
- podemos ir lá fora;
- o adulto está cansado.

Ele oferece uma recomendação principal, uma alternativa mais simples e uma opção com outro clima, explicando o motivo da sugestão. A pessoa pode trocar o convite com um motivo opcional, iniciar, concluir e dar feedback explícito de “mais como esta” ou “menos como esta”. A interface deve manter estados de primeira visita, vazio, erro e ausência de atividade compatível.

O recomendador é determinístico, versão `v1`, e está implementado em `lib/journey/recommendation-engine.ts`. Sua composição de pontos é:

| Critério | Peso máximo |
| --- | ---: |
| Adequação etária | 30 |
| Contexto declarado ou horário | 20 |
| Interesses registrados | 15 |
| Baixo atrito (preparo e duração) | 15 |
| Variedade no repertório recente | 10 |
| Feedback explícito/histórico recente | 10 |

Ele respeita a faixa etária publicada, considera o histórico recente de 30 dias e evita repetição sem evidência positiva. O desempate usa uma fração estável por criança, janela de São Paulo e contexto; portanto, não deve ser apresentado como sistema preditivo nem como verdade sobre a criança.

### Atividades

**Rotas:** `/atividades`, `/atividades/[slug]`, `/atividade-ativa/[slug]`.

Uma atividade publicada deve conter, no mínimo, faixa etária indicada, orientações de segurança, materiais, preparo, passos, prompts, adaptações, sinais para observar ou parar, variações, fontes, versão e revisão editorial. O modo de brincar tem cronômetro opcional e permite pausar ou encerrar. A reflexão posterior é observacional, nunca avaliativa.

A fonte operacional do catálogo é a tabela `atividades` no Supabase. Arquivos de seed e `public/atividades/atividades_brincar_educando.json` são material de carga/referência, não a fonte lida pela interface. Só conteúdo com `publicado = true` e `slug` pode aparecer nas experiências de navegação e recomendação.

### Diário e Jornada

**Rotas:** `/diario`, `/diario/nova`, `/jornada`.

O Diário reúne memórias livres, falas, descobertas, desafios, risos, fotos privadas, atividades e leituras. A pessoa pode editar, excluir e exportar seus registros em JSON por `GET /api/diario/export`.

Fotos do Diário usam o bucket privado `brincareducando-diario-privado`; aceitam JPEG, PNG e WebP até 5 MB e são exibidas com URL assinada temporária. A exportação não inclui o arquivo nem URL pública da foto.

A Jornada apresenta repertório e padrões descritivos. Uma preferência só pode aparecer depois de três experiências positivas recentes e predominância de categoria. A formulação precisa permanecer probabilística, contextual e lembrar que preferências mudam.

### Brincontos

**Rotas:** `/historias`, `/historias/[id]/ler`.

Brincontos são histórias autorais para co-leitura, não aulas. Cada uma possui páginas, texto alternativo, pausas opcionais, perguntas abertas, extensão familiar, fonte, versão e revisão. A sessão privada por criança registra página, conclusão, sinais opcionais e nota familiar.

O lote inicial previsto é: *A semente que escutava*, *O guarda-chuva de nuvem*, *O trem das coisas pequenas*, *Lila e a ponte de caixas* e *Boa-noite, lua redonda*.

### Conteúdo institucional e qualidade

- `/orientacoes`: conteúdo de orientação no produto;
- `/crescimento`: visão de crescimento, sempre sem métricas de desempenho ou diagnóstico;
- `/admin/qualidade`: painel exclusivo de administradores com cobertura por faixa/ambiente, status de publicação e revisões pendentes/vencidas. Não exibe dados familiares.

## 4. Stack e arquitetura

| Camada | Tecnologia e responsabilidade |
| --- | --- |
| Aplicação web | Next.js 16 com App Router e React 19. |
| Linguagem | TypeScript 5. |
| Estilos e UI | Tailwind CSS 4, Radix UI, shadcn/ui, `class-variance-authority`, `tailwind-merge`, Lucide. |
| Formulários/validação | React Hook Form, Zod e `@hookform/resolvers`. |
| Dados no cliente | TanStack React Query. |
| Backend e autenticação | Supabase (Auth, PostgREST, Storage, RLS e RPCs) no schema `brincareducando`. |
| Conteúdo de blog | MDX, `gray-matter`, `next-mdx-remote` e arquivos em `content/blog/`. |
| Qualidade | ESLint, TypeScript, testes nativos do Node e build do Next.js. |

O App Router organiza as áreas por grupos de rota: `(institucional)`, `(auth)`, `(blog)`, `(loja)` e `(dashboard)`. Componentes reutilizáveis ficam em `components/`; regras de negócio e integrações ficam em `lib/`; testes unitários ficam em `tests/`; migrações e referências de dados ficam em `supabase/`.

`proxy.ts` atualiza a sessão Supabase nas requisições. As áreas protegidas estão centralizadas em `lib/auth/protected-routes.ts`: dashboard, atividades, Diário, histórias, crescimento, Jornada, orientações, Mais, perfil, configurações, onboarding e administração. Além da sessão, `requireAppUser` exige que a RPC `current_user_has_manylabs_app_access` confirme o acesso da conta; caso contrário, a pessoa é direcionada a `/auth/access-denied`.

### PWA, imagens e segurança de navegador

O manifesto define a aplicação como PWA em português do Brasil, com início em `/dashboard`, modo `standalone` e orientação vertical. O Next otimiza imagens AVIF/WebP e permite imagens HTTPS remotas. Os cabeçalhos incluem `nosniff`, bloqueio de frame, política de referenciador restrita, HSTS, e bloqueio de câmera, microfone e geolocalização. Recursos estáticos do Next recebem cache imutável; HTML é revalidado pelo navegador.

## 5. Dados, propriedade e segurança

### Modelo de dados

| Domínio | Entidades principais |
| --- | --- |
| Família | `usuarios`, `criancas`, `diario_entradas`, `diario_midias`, `atividades_execucoes`, `historias_sessoes`/`historico`. |
| Conteúdo | `atividades`, `historias`, `historias_textos`, `historias_prompts`, `historias_extensoes`, `historias_audios`. |
| Evidências e governança | `conteudos_fontes`, `atividades_fontes`, `historias_fontes`, `revisoes_conteudo`, `user_roles`. |
| Personalização | `recomendacoes_eventos`. |

Os tipos do banco consumidos pela aplicação são gerados em `lib/supabase/database.types.ts`. O contrato funcional está em `supabase/EXPECTED_SCHEMA.md`; a fotografia auditada do remoto está em `supabase/REMOTE_BASELINE.md`.

### Regras de propriedade

1. Dados familiares pertencem ao responsável autenticado (`usuario_id = auth.uid()`).
2. Relações familiares usam chaves compostas `(crianca_id, usuario_id)` para impedir associação ou transferência entre famílias.
3. RLS deve proteger separadamente `SELECT`, `INSERT`, `UPDATE` e `DELETE`; `UPDATE` não pode trocar proprietário ou criança.
4. Conteúdo publicado pode ser lido pelo público autenticado do produto; escrita editorial é exclusiva de administradores.
5. O papel `anon` não possui privilégios de tabela no schema ativo.
6. Funções `security definer` precisam validar identidade, fixar `search_path` e ter grants mínimos.
7. Conteúdo legado não utilizado pelo aplicativo deve permanecer inacessível até receber um plano explícito de migração, arquivamento ou remoção.

### Variáveis de ambiente

Use `.env.local` apenas localmente e mantenha segredos fora do controle de versão. O modelo em `.env.example` prevê:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GA_ID=
```

`SUPABASE_SERVICE_ROLE_KEY` é exclusiva de servidor e nunca pode receber o prefixo `NEXT_PUBLIC_`.

## 6. Conteúdo, evidências e governança

As referências-base incluem AAP (*The Power of Play*, reafirmado em 2025, e *Digital Ecosystems*, 2026), OMS, UNICEF, SBP, BNCC/DCNEI, Ministério da Saúde (Caderneta da Criança, 7ª edição), LGPD/ANPD e ECA Digital. Elas fundamentam princípios e limites; não autorizam alegações de resultado individual.

A governança editorial é formada por:

- `docs/editorial/CONSTITUICAO_EDITORIAL.md`, obrigatória em toda criação e revisão;
- `docs/editorial/DIRETRIZES_POR_FAIXA_ETARIA.md`, `TAXONOMIA_DE_CONTEUDO.md` e `ALEGACOES_E_LINGUAGEM.md`;
- checklists de atividade, Brinconto, segurança, acessibilidade e publicação em `docs/checklists/`;
- fontes e afirmações aprovadas em `docs/ciencia/`;
- auditoria e errata da pesquisa original em `docs/pesquisa/`.
- inventário, modelo de marcadores e plano de ampliação em `docs/catalogo/`.

Marcos de desenvolvimento são referências informativas de vigilância e cuidado, não metas de uma atividade. O produto não atribui marco atingido, escore, idade de desenvolvimento ou risco clínico. Para conectar conteúdo e fase, usa oportunidades de experiência que descrevem ações possíveis, sem exigir desempenho nem inferir condição da criança.

A decisão vigente é não implementar RAG/`pgvector` nesta fase. O pacote editorial determinístico é suficiente para o volume atual e garante que regras críticas estejam sempre presentes. Os gatilhos de reavaliação estão em `docs/DECISAO_RAG_CONHECIMENTO_EDITORIAL.md`.

Todo lote novo ou alteração material de conteúdo deve:

1. registrar fontes e data/resultado de revisão;
2. conferir segurança física e emocional, adequação etária e acessibilidade;
3. evitar promessa de desenvolvimento, rótulo e aconselhamento clínico;
4. definir prazo de próxima revisão;
5. publicar apenas depois de resolver achados bloqueantes.

Antes de ampliar o catálogo ou alterar materialmente o recomendador, é obrigatório seguir [o protocolo de validação](VALIDACAO_COM_CUIDADORES_E_PROFISSIONAIS.md): piloto com 5–8 cuidadores e parecer de pessoas com experiência em educação infantil e saúde/desenvolvimento. O protocolo não é pesquisa clínica e não deve recolher dados identificáveis ou históricos de saúde.

## 7. Operação e manutenção

### Comandos de desenvolvimento

```bash
npm run dev        # desenvolvimento
npm run lint       # lint
npm run typecheck  # TypeScript sem emissão
npm test           # testes unitários
npm run build      # build de produção
npm run start      # servidor de produção
```

Para regenerar os tipos após uma mudança confirmada no banco:

```bash
npm run db:types
```

### Mudanças de banco

As migrações incrementais ficam em `supabase/migrations/`. Nunca editar, renumerar ou recriar uma migração já aplicada. Antes e depois de uma alteração, conferir schema, funções, grants, RLS e advisors; depois, regenerar tipos e executar typecheck, testes e build. Consulte `supabase/migrations/README.md` para o fluxo completo.

### Critério mínimo de aceite técnico

- `npm run lint`, `npm run typecheck`, `npm test` e `npm run build` aprovados;
- cenários de isolamento entre duas famílias cobertos quando houver mudança de dados/RLS;
- não expor fotos, registros ou identificadores familiares em logs, exportações públicas ou conteúdo editorial;
- validar a experiência em tela pequena e a interrupção sem culpa em fluxos de atividade/leitura;
- atualizar este documento, o contrato de schema e a baseline quando a mudança os afetar.

## 8. Decisões vigentes e próximos cuidados

### Decisões vigentes

- O recomendador é explicável e baseado em regras, não em perfilamento opaco ou modelo clínico.
- O Diário é privado; fotos usam Storage privado e URLs assinadas temporárias.
- O catálogo operacional vem do banco, não dos arquivos de seed.
- Administração editorial não dá acesso aos dados familiares.
- O conteúdo legado do banco não deve ser removido sem inventário e plano de preservação.

### Riscos a vigiar

- Confundir o produto com avaliação de desenvolvimento ou aconselhamento profissional.
- Publicar conteúdo sem revisão, fontes ou orientações de segurança.
- Alterar RLS, RPCs ou FKs sem provas de isolamento entre famílias.
- Vazar a chave de serviço ou tornar fotos do Diário públicas.
- Aumentar catálogo ou mudar o recomendador sem validação com cuidadores e profissionais.

## 9. Como manter este documento vivo

Atualize esta referência quando ocorrer qualquer uma destas situações:

- novo módulo, fluxo, rota ou mudança importante de experiência;
- alteração de propósito, público, princípios ou limites do produto;
- mudança em dados, RLS, Storage, autenticação, integrações ou variáveis de ambiente;
- inclusão de dependência/tecnologia estrutural;
- alteração nas regras de recomendação, critérios de Jornada ou política editorial;
- novo requisito de qualidade, privacidade, acessibilidade ou operação.

Para alterações pontuais, prefira editar a seção correspondente e registrar a decisão no pull request/issue associado. Para mudanças que alterem a identidade do produto, revise o documento inteiro para preservar coerência entre visão, experiência e implementação.
