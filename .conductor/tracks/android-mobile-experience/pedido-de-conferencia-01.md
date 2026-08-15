# PEDIDO DE CONFERÊNCIA — Fundação Android e sessão (total)

## 0. Como usar este pedido

Não confie neste documento. Re-derive cada afirmação a partir do código e dos
comandos indicados. Divergência invalida qualquer `✅` pretendido.

## 1. Contexto mínimo

Esta entrega cria um cliente exclusivo para APK Android, em `apps/android`.
Navegador mobile, PWA e desktop devem continuar no Next.js. O APK novo precisa
usar bundle local, coexistir com o legado e não pedir notificações.

## 2. Onde olhar

- `apps/android/`: cliente React/Ionic/Capacitor novo.
- `apps/android/capacitor.config.ts`: identificador e ausência de servidor
  remoto.
- `apps/android/src/`: estados de sessão, login, shell e ciclo Android.
- `apps/android/scripts/verify-android-apk.mjs`: evidência derivada.
- `apps/android/android/`: projeto Android gerado.
- `eslint.config.mjs`: exclusão somente de artefatos Android gerados.
- `docs/DOCUMENTO_MESTRE.md`: estado e histórico da entrega.

Contagem de testes antes: 15 testes Node no projeto web; nenhum teste Android.
Depois: 15 testes Node web + 5 testes Vitest Android.

## 3. Afirmações a falsificar

| # | Afirmo que… | Como você re-deriva | Evidência anexada |
| --- | --- | --- | --- |
| A1 | O novo cliente não é importado pelo Next/PWA. | `rg -n "apps/android|@brincar-educando/android" app components lib package.json` | nenhuma |
| A2 | O APK novo usa `br.com.brincareducando.app.dev`, sem `server.url` e sem mixed content. | `cd apps/android && npm run verify:apk` e inspecione o JSON gerado | SHA esperado na execução do implementador: `B57140FB0935FB15463CDC7279875E797EAB08FEB53A9E8869FD5E93821C813D` |
| A3 | O manifesto do novo APK não declara push, câmera ou mídia. | `cd apps/android && npm run verify:apk` | mesma evidência A2 |
| A4 | Há estados tipados para bootstrap, login, acesso negado, erro e logout. | `Get-Content apps/android/src/auth/auth-machine.ts` e `npm run typecheck` | 5 testes Vitest aprovados |
| A5 | Credencial inválida não fecha o processo e produz mensagem localizada. | instalar `android/app/build/outputs/apk/debug/app-debug.apk`; usar e-mail inexistente; `adb shell pidof br.com.brincareducando.app.dev` | AVD API 36.1, processo ativo após mensagem |
| A6 | Retornar do background não fecha o aplicativo. | no AVD: `adb shell input keyevent 3`; reabra; confira `dumpsys activity activities` | MainActivity retomada, processo 4375 na execução do implementador |
| A7 | Typecheck, testes e build do Next/PWA continuam aprovados. | `npm run typecheck`, `npm test`, `npm run build` na raiz | typecheck OK, 15/15 testes, build OK |
| A8 | O lint web só fica pendente por erros pré-existentes de push, não por arquivos Android gerados. | `npm run lint` e confira caminhos dos 4 erros | `NotificationPreferencesForm.tsx` (3) e `usePushNotifications.ts` (1) |

## 4. O que não entrou

- login com conta real, pois nenhuma credencial de teste foi autorizada;
- OAuth, criação/recuperação de conta, criança ativa e recomendador;
- push, Firebase, câmera, mídia e publicação;
- julgamento humano de marca e usabilidade;
- correção dos quatro `any` do push web, pois é trabalho fora da entrega Android.

## 5. Onde o implementador desconfia de si mesmo

- A persistência atual usa Capacitor Preferences; a escolha final de
  armazenamento apoiado no Android Keystore continua pendente antes de release.
- O bundle JavaScript ainda tem alerta de 1,26 MB minificado pelo Ionic; deve
  ser dividido conforme as áreas reais forem migradas.
- O login válido e a restauração de uma sessão real não foram executados por
  ausência de credencial autorizada.
- A tela foi vista apenas no AVD API 36.1; faltam os demais viewports e o olhar
  humano do proprietário.

## 6. Degraus cumpridos pelo implementador

1. Typecheck Android e web: aprovados.
2. Testes: 5 Android e 15 web aprovados.
3. Captura visual de login no AVD: realizada; demais viewports pendentes.
4. APK instalado, cold start, erro de login e background/foreground: aprovados.
5. Julgamento humano: pendente.

## 7. Resultado da conferência (29 de julho de 2026)

**Conferente:** outro agente na mesma sessão; independência fraca.

**Veredito global: APROVADO COM RESSALVAS.**

| Afirmação | Veredito | Nota |
| --- | --- | --- |
| A1 | CONFIRMADO | Nenhum import do cliente Android pelo Next/PWA. |
| A2 | CONFIRMADO | Config local, identificador e hash re-derivados. |
| A3 | CONFIRMADO | Apenas permissão de internet. |
| A4 | CONFIRMADO | Estados tipados; typecheck e 5 testes Android. |
| A5 | CONFIRMADO | Mensagem localizada e processo ativo no AVD. |
| A6 | CONFIRMADO | Home/retorno preservou processo e MainActivity. |
| A7 | CONFIRMADO COM RESSALVAS | Typecheck e 15 testes web reexecutados; build fresco ficou como evidência do implementador para evitar escrita em `.next`. |
| A8 | CONFIRMADO | Lint falha somente pelos 4 erros pré-existentes de push declarados; artefatos Android não aparecem. |

Achados fora do pedido: documentação inicialmente contraditória sobre o estado
do runtime novo (corrigida); `exitApp()` na raiz Hoje exige aceite explícito de
UX; e o APK legado continua remoto/mixed/push, isolado do cliente novo por
coexistência.
