# Contrato de Rascunho de Atividade

> Estrutura mínima para autoria antes da conversão para o banco. Um arquivo válido continua sendo rascunho; validação automática não equivale a aprovação humana.

## Identidade e fase

- `code`, `title`, `status`;
- `age_min_months`, `age_max_months`;
- `summary`, `phase_rationale`;
- `format`, `primary_domain`, `secondary_domains`;
- `opportunity_tags`.

O status da produção inicial deve ser `editorial_draft`. Idade descreve adequação da proposta e dos materiais, não expectativa de desempenho.

## Contexto familiar

- energia da criança e do adulto;
- preparo e duração;
- bagunça, ruído e carga sensorial;
- local e participantes.

## Experiência completa

- materiais com indicação de obrigatoriedade e substituições;
- preparação;
- passos flexíveis;
- prompts opcionais;
- sinais de interesse;
- sinais para adaptar ou parar;
- encerramento sem culpa;
- variações para simplificar, repetir e ampliar.

## Inclusão e segurança

- ao menos duas formas de participação;
- adaptações inclusivas concretas;
- nível de supervisão e risco;
- gatilhos, riscos previsíveis e orientações.

## Evidência e linguagem

- `evidence_ids` referencia somente a Matriz Canônica de Evidências;
- `editorial_claim` descreve oportunidade, nunca resultado individual;
- uma fonte geral sustenta princípios, não comprova eficácia específica da atividade.

## Estados do fluxo

```text
editorial_draft
  → revisão editorial
  → revisão de segurança
  → revisão de acessibilidade
  → parecer especializado quando acionado
  → validação com cuidadores
  → adaptação ao contrato do banco
  → revisão final
  → publicado
```

Nenhuma passagem de estado é automática.
