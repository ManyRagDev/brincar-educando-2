# Manifesto Visual — Brincar Educando Android

## Estado

🟡 Proposto em 28 de julho de 2026. Requer aceite do proprietário antes de
qualquer JSX ou CSS do cliente Android.

## Contexto

Produto para mães, pais e cuidadores que precisam encontrar um próximo passo
possível, muitas vezes com pouco tempo e energia. A interface será construída
em React/Ionic e existirá somente no APK Android. A identidade web atual é a
referência de marca; não foram adicionadas referências externas.

## Âncora emocional

**“Ao abrir o aplicativo, quero sentir que existe um próximo passo simples e
possível, sem cobrança.”**

## Paleta

| Token | Valor | Uso |
| --- | --- | --- |
| `--android-bg` | `#FFF9F5` | fundo contínuo, quente e sem aparência de página branca |
| `--android-surface` | `#FFFFFF` | superfícies funcionais |
| `--android-ink` | `#25211F` | texto principal |
| `--android-muted` | `#6F6661` | texto secundário |
| `--android-primary` | `#C94F46` | ação principal com contraste AA |
| `--android-primary-soft` | `#FFE2DD` | seleção e orientação sem alarme |
| `--android-secondary` | `#6548B8` | Jornada e detalhes de identidade |
| `--android-sage` | `#627257` | estados calmos e confirmação |
| `--android-line` | `#E9DDD7` | divisores e limites discretos |
| `--android-danger` | `#B3261E` | erro e ação destrutiva |

O coral preserva a marca, mas é escurecido nas ações para legibilidade. Creme,
sálvia e roxo fazem a interface parecer cuidadosa sem infantilizar o cuidador.

## Tipografia

- Corpo e controles: `Work Sans`, `system-ui`, sans-serif.
- Títulos afetivos: `Lora`, Georgia, serif.
- Título principal: 28 px, peso 700, linha 34 px.
- Título de seção: 20 px, peso 700, linha 26 px.
- Corpo: 16 px, peso 450, linha 24 px.
- Apoio: 14 px, peso 500, linha 20 px.
- Navegação: 11 px, peso 700, tracking `0.01em`.

Work Sans mantém leitura rápida; Lora aparece somente em frases de acolhimento,
evitando que toda a interface pareça editorial ou institucional.

## Espaçamento e ritmo

- unidade base: 4 dp;
- margem horizontal: 20 dp;
- gap entre controles relacionados: 12 dp;
- gap entre blocos: 20 dp;
- separação de seções: 28 dp;
- altura mínima de toque: 48 dp;
- cantos de controles: 14 dp;
- cantos de superfícies principais: 24 dp;
- navegação inferior: 68 dp mais safe area.

O conteúdo se organiza em uma coluna contínua. Espaço maior aparece antes de
decisões; espaço menor mantém explicações ligadas à ação correspondente.

## Tom visual

- luz difusa, com sombras somente em superfícies elevadas;
- bordas de 1 px nas superfícies de leitura;
- sem moldura global que faça a tela parecer um site;
- shell, topo e navegação permanecem durante transições;
- transições entre 180 e 240 ms, com movimento reduzido respeitado;
- skeletons ocupam apenas o conteúdo que está chegando;
- nada de tela branca ou spinner central entre destinos.

## Elemento surpresa

**Fio do agora:** uma linha orgânica curta liga a saudação ao convite principal
de Hoje. Ela funciona como orientação espacial — “você está aqui, este é o
próximo passo” — e desaparece nos modos de foco, erro ou redução de movimento.

O fio não representa progresso, pontuação ou sequência obrigatória.

## O que este design não é

Não é uma landing page comprimida, um dashboard de métricas nem um jogo
infantil. É uma ferramenta cotidiana para o adulto agir com menos dúvida e
guardar o celular novamente.

## Wireframe — bootstrap e login

```text
┌──────────────────────────────────┐
│          safe area               │
│                                  │
│       marca pequena              │
│                                  │
│     Bem-vindo de volta           │
│     Continue de onde parou.      │
│                                  │
│  E-mail                          │
│  ┌────────────────────────────┐  │
│  │                            │  │
│  └────────────────────────────┘  │
│  Senha                    ver    │
│  ┌────────────────────────────┐  │
│  │                            │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │           Entrar           │  │
│  └────────────────────────────┘  │
│                                  │
│  erro localizado / tentar de novo│
│                                  │
│  Problemas para entrar?          │
│          safe area               │
└──────────────────────────────────┘
```

## Wireframe — Hoje de fundação

```text
┌──────────────────────────────────┐
│ safe area                        │
│                                  │
│ Bom dia, Ana              avatar │
│ Um momento de cada vez.          │
│      ╭ fio do agora              │
│      ╰──────────────╮            │
│                     │            │
│  Seu próximo passo  │            │
│  ┌────────────────────────────┐  │
│  │ Como está o momento por aí?│  │
│  │                            │  │
│  │ A experiência personalizada│  │
│  │ chega na próxima entrega.  │  │
│  │                            │  │
│  │  Explorar esta versão  →   │  │
│  └────────────────────────────┘  │
│                                  │
│  Nesta versão                    │
│  sessão segura · retorno rápido  │
│                                  │
├──────────────────────────────────┤
│  Hoje   Brincar  Memórias  Mais  │
│   ●       ○        ○        ○    │
│ safe area                        │
└──────────────────────────────────┘
```

Os destinos ainda não migrados não fingem funcionalidade: permanecem
visualmente reconhecíveis, mas exibem estado “em construção nesta versão de
desenvolvimento”.
