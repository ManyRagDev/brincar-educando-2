# Handoff executável 01 — Fundação Android e sessão

> Escrito com o código real na frente, conferido em 28 de julho de 2026.
> Rege-se por `spec.md`, `plan.md`, `.conductor/rules.md` e pelo Documento
> Mestre.

## 0. Estado real herdado

- A aplicação web/PWA é um projeto Next.js 16 com App Router na raiz.
- O projeto nativo existente fica em `android/` e usa o identificador
  `br.com.brincareducando.app`.
- `capacitor.config.ts` define `webDir: "public"`, mas também define
  `server.url` para a implantação Vercel. No APK atual, essa URL remota governa
  a experiência e produz navegação de site dentro da WebView.
- O projeto Android atual contém permissões de câmera, mídia e notificações,
  mesmo quando a primeira fatia não precisa delas.
- O plugin de push está desativado quando `google-services.json` não existe,
  evitando o crash nativo que motivou esta iniciativa.
- O login web em `components/auth/AuthForm.tsx` depende de `next/navigation`,
  cookies Supabase e `POST /api/manylabs/ensure-access`.
- A rota `ensure-access` depende de segredo de servidor e não pode ser
  reproduzida dentro do APK.
- `requireAppUser` e `getActiveChild` são módulos `server-only`; a criança ativa
  web é selecionada por cookie.
- O layout autenticado monta `PushNotificationInitializer`, e o hook solicita
  permissão automaticamente quando encontra o plugin. Esse comportamento não
  será levado ao cliente novo.
- O dashboard web é composto por Server Components e consultas server-side.
  Reutilizar sua árvore de componentes no APK recriaria o comportamento de site
  que a iniciativa pretende remover.

## 1. Escopo fechado

### Entra

1. Criar `apps/android` como cliente React/Ionic/TypeScript independente.
2. Criar um projeto Capacitor Android dentro desse cliente.
3. Usar identificador de desenvolvimento instalável em paralelo ao APK atual.
4. Gerar e sincronizar bundle local, sem `server.url`.
5. Implementar contratos tipados de estado de sessão.
6. Implementar login por e-mail/senha, restauração de sessão e logout.
7. Validar `current_user_has_manylabs_app_access` após autenticação.
8. Exibir shell persistente e tela Hoje de fundação.
9. Implementar carregamento, credenciais inválidas, acesso negado, sessão
   expirada e ausência de configuração.
10. Tratar safe areas e botão voltar do Android.
11. Adicionar testes da máquina de estados de autenticação e navegação.
12. Confirmar que o build Next/PWA permanece funcional e sem alteração visual.

### Não entra

- Nenhuma mudança no navegador mobile, PWA ou desktop.
- Nenhum componente ou estilo do cliente Android no build Next.
- Nenhuma troca do identificador `br.com.brincareducando.app`.
- Nenhuma alteração no diretório `android/` legado além das correções já
  existentes e não relacionadas a esta entrega.
- Criação de conta, recuperação de senha e Google OAuth.
- Provisionamento automático de acesso ManyLabs pelo APK.
- Criança ativa, recomendador e demais módulos funcionais.
- Push notifications ou pedido de permissão.
- Mudança de banco, RLS, Storage ou RPC.
- Publicação na Play Store.

### Critério verificável de pronto

- `apps/android` produz bundle local e projeto Android sincronizado.
- O config gerado não contém `server.url`, `cleartext` nem
  `allowMixedContent`.
- Uma sessão existente é restaurada sem mostrar landing page.
- Login válido entra em Hoje; inválido permanece no formulário com mensagem.
- Conta sem acesso chega a estado explícito de acesso negado.
- Logout retorna ao login sem reload remoto.
- Botão voltar não fecha o app quando existe página anterior.
- Nenhuma chamada de permissão de notificação existe no novo cliente.
- Build, typecheck e testes do cliente Android passam.
- Lint, typecheck, testes e build do Next/PWA continuam passando.
- Execução em emulador é registrada por evidência derivada.
- Pedido de conferência total recebe veredito antes de `✅`.

## 2. Achados centrais

### A1 — Autenticação não é componente compartilhável

O `AuthForm` web usa roteador Next, cookies SSR e endpoint interno. A primeira
entrega deve compartilhar apenas o contrato conceitual; copiar o componente
levaria dependências web para o APK.

### A2 — Provisionamento e validação de acesso são operações diferentes

O endpoint web `ensure-access` usa `SUPABASE_SERVICE_ROLE_KEY` para chamar
`ensure_manylabs_app_access`. O APK nunca pode receber esse segredo. Nesta
entrega, o cliente autentica e chama somente
`current_user_has_manylabs_app_access` sob a sessão do usuário. Contas ainda não
provisionadas recebem estado de acesso negado; um endpoint móvel autenticado
será uma entrega futura se o provisionamento automático for necessário.

### A3 — Criança ativa não pode usar o cookie web

`getActiveChild` é `server-only` e lê `brincar_educando_active_child`. A seleção
Android precisa de persistência própria e contrato separado. Ela está fora da
primeira entrega para não criar uma segunda regra silenciosa.

### A4 — A permissão de push está acoplada ao primeiro layout autenticado

O hook web chama `requestPermissions()` automaticamente. O novo cliente não
montará esse inicializador. Push só entra após uma tela de contexto, ação
explícita e configuração Firebase verificada.

### A5 — O projeto Android legado deve permanecer como baseline recuperável

O diretório `android/` contém o aplicativo vigente e mudanças locais da correção
de crash. A nova implementação nasce em `apps/android/android`, com outro
identificador. Isso evita substituir um APK funcional por uma fatia ainda sem
paridade.

### A6 — “Somente Android” é uma fronteira de build, não de viewport

O isolamento não será implementado por CSS responsivo, user-agent ou rota
condicional no Next. O único consumidor da nova interface será o bundle
empacotado pelo projeto Capacitor de `apps/android`.

## 3. Implementação, passo a passo

### 3.1 Contrato e tipos

Criar tipos exaustivos para:

- configuração pública;
- `AuthStatus`: `booting | anonymous | authenticating | authenticated |
  access_denied | misconfigured | failed`;
- erros de autenticação traduzíveis;
- comandos `signIn`, `restoreSession`, `signOut` e `retry`;
- destinos da navegação Android.

Erros novos devem quebrar o typecheck por `never`, não cair em mensagem
genérica silenciosa.

### 3.2 Núcleo

- criar cliente Supabase no schema `brincareducando`;
- implementar máquina de sessão independente de React;
- restaurar e atualizar sessão;
- validar a RPC de acesso;
- impedir estado autenticado quando a validação de acesso falhar.

### 3.3 Borda Capacitor

- criar config dedicado sem servidor remoto;
- configurar app de desenvolvimento;
- empacotar somente permissões realmente usadas;
- integrar `App.addListener("backButton")` e mudança de estado;
- garantir limpeza de listeners.

### 3.4 Interface

Implementar somente após aprovação de `visual-manifest.md`:

- bootstrap localizado;
- login;
- erro/acesso negado;
- shell autenticado;
- Hoje de fundação;
- navegação inferior persistente com destinos futuros desabilitados e
  honestamente identificados.

### 3.5 Testes

- transições da máquina de autenticação;
- restauração e expiração;
- tradução exaustiva de erro;
- acesso concedido e negado;
- config sem URL remota;
- navegação e botão voltar;
- ausência de integração de push;
- baseline visual nos viewports Android mínimos.

## 4. Verificação e registro

### Degrau 1

- lint e typecheck do cliente Android;
- lint e typecheck do Next.

### Degrau 2

- testes unitários e de contrato novos;
- contagem antes e depois registrada.

### Degrau 3

- testes de navegação;
- screenshots comparáveis em 320 × 568, 360 × 800, 390 × 844 e 412 × 915.

### Degrau 4

- APK debug instalado em emulador;
- cold start, login, background/foreground, logout e botão voltar;
- relatório derivado com identificador do pacote, versão, hash do APK e
  timestamp.

### Degrau 5

- julgamento visual e de marca pelo proprietário.

Ao terminar:

1. atualizar o histórico do Documento Mestre;
2. atualizar o plano sem marcar `✅` antes do veredito;
3. registrar dependências e parâmetros;
4. emitir pedido de conferência total;
5. anexar o veredito ao histórico.

## 5. Execução pelo implementador (28 de julho de 2026)

- Cliente criado em `apps/android`, sem importação pelo Next.js.
- APK de desenvolvimento criado em `apps/android/android`, com identificador
  `br.com.brincareducando.app.dev`.
- O bundle local foi sincronizado e o config gerado não contém `server.url`.
- O manifesto gerado contém somente `INTERNET`; não há permissões de push,
  câmera ou mídia.
- Typecheck, 5 testes Vitest, build Vite e `assembleDebug` passaram.
- O APK foi instalado no AVD `Medium_Phone_API_36.1`; cold start, mensagem de
  credencial inválida e retorno de background mantiveram o processo ativo.
- `npm run typecheck`, `npm test` (15 testes) e `npm run build` do Next/PWA
  passaram. O lint web ficou pendente por quatro `any` pré-existentes em
  componentes de push, agora isolados dos artefatos Android gerados.
- Evidência reproduzível: `npm run verify:apk` gera hash, permissões e config
  em `reports/verified/<timestamp>/android-apk.json`.

O item não é ✅: falta conferência total independente e julgamento visual do
proprietário.

## 6. Conferência independente (29 de julho de 2026)

Conferente: outro agente na mesma sessão — independência fraca, conforme o
protocolo. Veredito global: **APROVADO COM RESSALVAS**.

- A1–A6 e A8 foram confirmados por re-derivação.
- A7 foi confirmado para typecheck e 15 testes web; o conferente não reexecutou
  o build fresco porque isso escreveria `.next`, mas confirmou a existência de
  artefatos de build recentes. O build foi executado pelo implementador e está
  registrado no Documento Mestre.
- O conferente encontrou e foi corrigida no Documento Mestre a frase desatualizada
  que dizia que o runtime novo não estava implementado.
- Achados mantidos como ressalvas: armazenamento final no Keystore, bundle de
  1,26 MB, login real não autorizado e julgamento visual do proprietário.

O item continua 🟡 até que as ressalvas de release e o julgamento humano sejam
tratados; a conferência não substitui a avaliação de marca pelo proprietário.

## Anexo — mapa de impactos instanciado

| Se mexer em | Afeta | Atenção |
| --- | --- | --- |
| `apps/android` | somente bundle e APK de desenvolvimento | não importar pelo Next |
| config Capacitor novo | assets e projeto nativo novos | ausência de `server.url` |
| persistência de sessão | login e retomada | não usar segredo de servidor |
| validação ManyLabs | entrada autenticada | validar, não provisionar |
| botão voltar | pilha Ionic e saída | sair somente na raiz |
| estado de background | sessão e listeners | remover listeners e evitar duplicação |
| manifesto Android novo | permissões do APK | não declarar push, câmera ou mídia |
| `android/` legado | APK atual | preservar mudanças locais existentes |
| web/PWA raiz | baseline protegida | nenhuma alteração visual ou de rota |
