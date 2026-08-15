# Plano de implementação — Experiência Android dedicada

## Princípio

Entregar uma fatia vertical por vez. A aplicação web/PWA é baseline protegida e
o APK dedicado nasce em paralelo até existir paridade suficiente para uma
decisão de cutover.

## Entrega 0 — Contrato, baseline e direção visual

- [x] Mapear o runtime Capacitor vigente e a dependência de URL remota.
- [x] Confirmar que o plano de UX atual protege rotas, banco e contratos.
- [x] Registrar a fronteira web/PWA versus Android.
- [x] Registrar a decisão proposta de um único runtime de UI no APK.
- [x] Formalizar que navegador mobile e PWA estão fora da iniciativa.
- [x] Criar handoff executável da primeira entrega a partir do código real.
- [ ] Aprovar manifesto visual e wireframe Android.
- [ ] Registrar baseline funcional e contagem de testes antes da implementação.

**Aceite:** arquitetura e direção visual são decidíveis, reversíveis e não
afirmam como pronta uma experiência que ainda não foi implementada.

## Entrega 1 — Fundação Android e sessão

- [x] Criar cliente React/Ionic/TypeScript isolado.
- [x] Criar projeto Capacitor Android de desenvolvimento instalável em paralelo.
- [x] Empacotar bundle local e remover dependência de servidor remoto.
- [x] Implementar contratos tipados de bootstrap e autenticação.
- [x] Implementar login, restauração de sessão, expiração e logout.
- [x] Implementar shell Hoje e navegação persistente.
- [x] Implementar loading, vazio, erro e retomada após background.
- [x] Adicionar testes unitários e de contrato.
- [x] Registrar primeira captura visual Android (login em emulador API 36.1).
- [x] Executar typecheck, testes e build web/PWA e Android.
- [x] Emitir pedido de conferência total.
- [x] Registrar veredito no Documento Mestre.

**Estado:** 🟡 conferência total aprovada com ressalvas em 29 de julho de 2026.
Faltam julgamento visual do proprietário, login/restauração com conta autorizada,
Keystore antes de release e divisão do bundle. O lint web permanece 🟡 por
quatro erros pré-existentes de `any` em push web, fora do escopo Android.

## Entrega 2 — Contexto familiar e Hoje

- [ ] Implementar acesso ao app e seleção explícita de criança ativa.
- [ ] Migrar contexto do momento e recomendação explicável.
- [ ] Implementar skeletons locais e recuperação de falhas.
- [ ] Testar família sem criança, uma criança e várias crianças.
- [ ] Conferir isolamento por RLS contra duas famílias de teste.

## Entrega 3 — Brincar, Memórias e Jornada

- [ ] Migrar catálogo e detalhe de atividade.
- [ ] Migrar modo Brincar e reflexão opcional.
- [ ] Migrar Memórias, incluindo mídia privada.
- [ ] Migrar Jornada sem linguagem avaliativa.
- [ ] Validar background, interrupção e retorno em cada fluxo crítico.

## Entrega 4 — Integrações Android

- [ ] Implementar OAuth/deep links.
- [ ] Definir e implementar armazenamento seguro final.
- [ ] Implementar push apenas depois de contexto e consentimento.
- [ ] Validar processo morto, cold start, upgrade e restauração.
- [ ] Auditar permissões, logs e dados sensíveis.

## Entrega 5 — Paridade e decisão de cutover

- [ ] Executar matriz funcional integral.
- [ ] Comparar desempenho, estabilidade e qualidade percebida.
- [ ] Executar checkpoint Capacitor versus Flutter.
- [ ] Obter validação humana com cuidadores.
- [ ] Definir migração de assinatura, identificador e sessão.
- [ ] Fazer cutover em entrega própria com rollback testado.

## Escada de verificação

1. `lint` e `typecheck` de cada cliente.
2. testes unitários e de contrato.
3. testes de navegação e baseline visual Android.
4. execução em emulador/dispositivo com evidência derivada.
5. julgamento humano do proprietário para visual, gosto e marca.

Nenhum item recebe `✅` antes do degrau obrigatório e da conferência
independente. Itens aguardando evidência permanecem `🟡`.
