# Brincar Educando — Experiência Android dedicada

## Estado

🟡 Arquitetura e início da implementação aprovados em 28 de julho de 2026. A
implementação visual aguarda aprovação do manifesto e do wireframe. Nenhuma
mudança de produção está autorizada por este estado.

## 0. Escopo exclusivo de plataforma

Esta iniciativa existe **somente para o aplicativo Android distribuído como
APK/AAB**.

Estão explicitamente fora de escopo:

- navegador mobile Android ou iOS;
- instalação e execução como PWA;
- navegador desktop;
- aplicação web responsiva servida pelo Next.js;
- qualquer tentativa de selecionar a nova interface por largura de viewport,
  user-agent ou media query.

O cliente Android dedicado não será incluído no build, nas rotas, nos estilos
ou no manifesto da PWA. A aplicação web não importará módulos de
`apps/android`; o cliente Android não importará componentes, Server Components,
cookies ou layouts do Next.js.

## 1. Problema

O APK atual abre a aplicação web hospedada dentro de uma WebView. Isso preserva
o produto existente, mas também leva para o aplicativo características próprias
de site: landing page, navegação por páginas, carregamentos de documento e
transições sem continuidade.

O objetivo é criar uma experiência Android com comportamento de aplicativo sem
alterar a experiência vigente no desktop, navegador mobile ou PWA.

## 2. Decisão arquitetural proposta

Criar uma aplicação cliente Android separada em `apps/android`, dentro do mesmo repositório,
usando React, TypeScript, Ionic e Capacitor. O APK terá bundle local e não
dependerá de `server.url` para iniciar.

O Next.js existente continuará sendo a aplicação web e a PWA. Contratos de
domínio, validações e tipos que forem realmente isomórficos poderão ser
extraídos para módulos compartilhados; módulos de servidor, cookies e
componentes Next não serão importados pelo cliente Android.

Flutter não será embutido no mesmo APK. Ele permanece como referência de
qualidade de interação e como alternativa reavaliável em um checkpoint
documentado. O custo relevante não é escrever telas, mas manter dois runtimes
de UI, dois modelos de navegação, duas árvores de estado e duas cadeias de
depuração no mesmo produto.

## 3. Limites sagrados

- Não alterar páginas, layouts, rotas ou manifesto da aplicação web/PWA.
- Não alterar schema, RLS, Storage ou contratos do Supabase nesta entrega.
- Não reutilizar `server.url`, `cleartext` ou `allowMixedContent` no APK de
  produção.
- Não substituir o APK vigente antes de paridade funcional e aceite humano.
- Não solicitar permissão de notificações durante o login.
- Não criar pontuação, streak, comparação ou linguagem avaliativa.
- Não importar segredos de servidor no bundle Android.

## 4. Estratégia de convivência

O novo cliente nasce com identificador Android de desenvolvimento e pode ser
instalado ao lado do aplicativo vigente. A troca do identificador de produção
só poderá ocorrer em uma entrega própria, depois de:

1. paridade dos fluxos críticos;
2. migração de sessão validada;
3. testes em dispositivo e emulador;
4. decisão explícita de cutover;
5. caminho de rollback registrado.

## 5. Primeira fatia vertical

### Escopo

- projeto Android dedicado e isolado;
- bundle web local sincronizado pelo Capacitor;
- bootstrap, sessão, login por e-mail e senha e saída;
- tela Hoje autenticada com saudação, estado da sessão e estrutura de navegação;
- estados de carregamento, vazio, erro e retomada após background;
- safe areas, botão voltar e navegação sem recarregar o documento;
- nenhuma solicitação de push no primeiro acesso.

### Fora desta fatia

- Google OAuth e deep links;
- cadastro/seleção completa de criança;
- recomendador, atividade ativa, Memórias e Jornada funcionais;
- push notifications;
- publicação ou substituição do APK atual;
- migração de banco ou alteração de RLS.

Os destinos ainda não migrados serão identificados como indisponíveis nesta
versão de desenvolvimento. O aplicativo não será tratado como release enquanto
esses fluxos estiverem ausentes.

## 6. Contratos técnicos

### Runtime

- React + TypeScript estrito;
- Ionic React para navegação, safe areas e padrões de interação;
- Capacitor para empacotamento e integrações Android;
- Supabase JS usando apenas URL e chave pública;
- adaptador de persistência de sessão que não exponha chaves privadas e que
  possa ser substituído por armazenamento apoiado no Android Keystore.

### Fronteira com a web

```text
Aplicação web/PWA (Next.js) ─────┐
                                ├── contratos de domínio compartilháveis
Aplicação Android (Ionic/React) ─┘
                                └── Supabase Auth/PostgREST/RPC sob RLS
```

Nenhum cliente recebe `SUPABASE_SERVICE_ROLE_KEY`. Regras familiares continuam
sendo garantidas pelo banco, não pela interface.

## 7. Requisitos de experiência

- Ao abrir o APK, pessoa autenticada vai diretamente para Hoje.
- Pessoa sem sessão vê login, não landing page comercial.
- Mudanças entre áreas mantêm shell, posição e contexto.
- Carregamento usa skeleton localizado; não existe tela branca entre rotas.
- A ação principal de Hoje deve ser reconhecível em até dez segundos.
- Alvos de toque têm no mínimo 44 × 44 dp.
- Layouts são verificados em 320 × 568, 360 × 800, 390 × 844 e 412 × 915.
- Texto respeita fonte ampliada, redução de movimento e contraste AA.
- O botão voltar do Android volta na pilha e só sai na raiz.

## 8. Aceite da primeira fatia

- build do Next/PWA continua aprovado sem alteração visual intencional;
- build da aplicação Android gera bundle local;
- configuração Android dedicada não contém URL remota de inicialização;
- login inválido, sessão válida, sessão expirada e logout possuem testes;
- navegação não realiza reload completo entre Login e Hoje;
- retomada após background não fecha o processo;
- nenhuma permissão de notificação é solicitada;
- baseline visual Android é comparado nos viewports mínimos;
- conferência independente emite veredito;
- proprietário realiza o julgamento visual final.

## 9. Rollback

A primeira fatia é aditiva. Remover o diretório do cliente Android dedicado e
seus scripts restaura o estado anterior; a aplicação web/PWA e o projeto Android
vigente permanecem intactos até o cutover.

## 10. Questões abertas

- escolha final do armazenamento seguro de sessão;
- estratégia de OAuth/deep link;
- contrato mínimo da API móvel para reduzir acoplamento ao schema;
- critérios quantitativos do checkpoint Capacitor versus Flutter;
- plano de migração do identificador e da assinatura do APK de produção.
