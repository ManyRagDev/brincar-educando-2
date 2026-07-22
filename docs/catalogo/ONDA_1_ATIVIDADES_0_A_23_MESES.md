# Onda 1 — Atividades de 0 a 23 Meses

## Resultado

Foram redigidas 24 atividades completas em quatro lotes estruturados:

| Faixa | Códigos | Quantidade | Arquivo |
|---|---|---:|---|
| 0–5 meses | EXP-001–006 | 6 | `content/activities/drafts/wave-1/0-5-months.json` |
| 6–11 meses | EXP-007–012 | 6 | `content/activities/drafts/wave-1/6-11-months.json` |
| 12–17 meses | EXP-013–018 | 6 | `content/activities/drafts/wave-1/12-17-months.json` |
| 18–23 meses | EXP-019–024 | 6 | `content/activities/drafts/wave-1/18-23-months.json` |

Os arquivos permanecem em `editorial_draft`. No banco, a sincronização converte esse estado em `status_editorial = 'rascunho'` e força `publicado = false`.

## Implementação no banco

O comando idempotente abaixo faz a importação no Supabase configurado:

```bash
npm run sync:wave1 -- --apply
```

Ele cria ou atualiza os 24 rascunhos por `codigo_externo`, sincroniza adaptações e fontes, abre uma revisão editorial pendente por atividade e audita as contagens remotas. Sem `--apply`, executa apenas uma simulação local.

No ambiente remoto do projeto, a primeira sincronização foi aplicada em 22 de julho de 2026 com 24 rascunhos, 48 adaptações, 61 vínculos de fontes e 24 revisões pendentes. A política RLS permite que apenas administradores vejam atividades não publicadas.

## Cobertura intencional

- vínculo e trocas responsivas;
- linguagem ligada ao cotidiano;
- música humana e pausas;
- observação de luz, vento e sons;
- movimento sem exigir locomoção específica;
- coordenação das mãos apenas com objetos grandes;
- causa e efeito, procura e comparação sem teste;
- primeiros faz de conta e escolhas;
- transições sem ameaça ou recompensa;
- participação por olhar, gesto, som, toque, movimento ou apoio.

## Decisões de segurança incorporadas

- nenhum grão, tampa, gelo, macarrão, balão, ímã ou peça pequena;
- nenhum recipiente com água;
- brinquedo sonoro somente certificado/indicado para a idade;
- tecido sempre controlado pelo adulto e nunca sobre o rosto;
- janela tratada como risco de queda e cordão;
- atividade corporal sem cadeira, escada ou obstáculo improvisado;
- caixa sempre aberta, sem tampa, plástico ou possibilidade de aprisionamento;
- nenhum alimento, detergente, tinta ou produto químico;
- supervisão ao alcance imediato na maior parte das propostas.

## O que a validação automática garante

O comando `npm run validate:content` verifica:

- 24 códigos únicos e contínuos;
- seis atividades em cada faixa;
- campos editoriais obrigatórios;
- ao menos duas formas de participação;
- segurança, adaptações e variações preenchidas;
- existência dos IDs na Matriz de Evidências;
- ausência de algumas alegações proibidas;
- permanência do status de rascunho.

Ele não garante segurança clínica, qualidade pedagógica, usabilidade nem adequação individual. Esses itens exigem as revisões humanas previstas no fluxo.

## Próximo gate

Antes de converter qualquer registro em seed publicável:

1. revisão editorial linha a linha;
2. revisão de segurança por faixa e material;
3. revisão de acessibilidade;
4. piloto do protocolo de validação com cuidadores;
5. seleção de um lote pequeno para publicação controlada;
6. acompanhamento de trocas, interrupções e percepções sem inferência clínica.

## Situação de publicação

Em 22 de julho de 2026, o responsável pelo projeto aprovou as 24 atividades e autorizou substituir o piloto pré-publicação por validação integral pós-deploy no dashboard. A decisão, controles e gatilhos de despublicação estão registrados em [`DECISAO_PILOTO_POS_DEPLOY.md`](DECISAO_PILOTO_POS_DEPLOY.md).

As 24 atividades foram promovidas no Supabase para `status_editorial = 'publicado'` e `publicado = true`. A auditoria pós-publicação confirmou 48 adaptações, 61 vínculos de fontes, 24 aprovações editoriais e revisão agendada para 22 de outubro de 2026.
