# Decisão Arquitetural — RAG para Conhecimento Editorial

**Decisão:** adiar a implementação de RAG/pgvector

**Data:** 22 de julho de 2026

**Status:** aceito para a fase atual

## Contexto

O projeto possui uma pesquisa bruta de aproximadamente 103 mil caracteres, mas o conteúdo operacional foi decomposto em documentos curtos e previsíveis:

- Constituição Editorial;
- política de alegações;
- taxonomia;
- diretrizes por faixa etária;
- cinco checklists;
- matriz canônica de evidências;
- fontes verificadas.

O aplicativo ainda não possui fluxo de autoria por IA, provedor de embeddings, serviço de geração ou interface administrativa de consulta científica. Implementar `pgvector` agora acrescentaria ingestão, versionamento, busca, reranking, avaliação, observabilidade e custo operacional sem resolver um problema atual do produto.

## Decisão

Na fase atual, usar um **pacote editorial determinístico**:

```text
Constituição completa
    + checklist do formato
    + checklist de segurança
    + checklist de acessibilidade
    + diretriz da faixa etária
    + afirmações relevantes da matriz
```

Esse pacote é mais fácil de auditar, testar e reproduzir. Nenhuma regra crítica depende de recuperação probabilística.

## Consequências positivas

- menor complexidade;
- ausência de custo de embeddings;
- comportamento reproduzível;
- revisão por diff no Git;
- risco muito menor de omitir regra crítica;
- implementação editorial pode começar imediatamente;
- fontes e alegações ficam normalizadas antes de qualquer indexação.

## Limitações aceitas

- seleção de evidências ainda será manual ou por metadados simples;
- consultas exploratórias exigirão pesquisa nos documentos;
- não haverá busca semântica sobre o corpus;
- atualização de fontes depende do processo editorial definido.

Essas limitações são aceitáveis enquanto a base for pequena e a autoria não ocorrer dentro do produto.

## Gatilhos para reavaliar

Reabrir esta decisão quando ao menos dois itens forem verdadeiros:

- mais de 100 fontes verificadas ativas;
- mais de 300 afirmações atômicas;
- múltiplos documentos científicos extensos por tema;
- autoria assistida por IA integrada ao painel administrativo;
- necessidade frequente de perguntas livres sobre evidências;
- seleção manual de contexto gerar custo/erros mensuráveis;
- mais de um idioma no corpus;
- equipe editorial precisar localizar evidências diariamente;
- avaliações demonstrarem que busca textual/metadados não é suficiente.

## Arquitetura futura preservada

A proposta em `ARQUITETURA_CONHECIMENTO_EDITORIAL.md` continua válida como arquitetura-alvo. A normalização atual — fontes, afirmações, códigos, faixas, temas e versões — foi desenhada para migrar ao `pgvector` sem refazer o trabalho.

Quando os gatilhos ocorrerem:

1. ampliar `conteudos_fontes`;
2. criar tabelas de afirmações/documentos/chunks;
3. escolher embeddings e dimensão;
4. implementar busca híbrida com filtros;
5. construir conjunto de avaliação;
6. manter Constituição e checklists fora do RAG e sempre presentes.

## Alternativas rejeitadas

### Indexar a pesquisa bruta agora

Rejeitada por duplicação, fontes frágeis, afirmações compostas e risco de recuperar conteúdo desatualizado.

### Carregar sempre as mil linhas

Rejeitada para tarefas rotineiras por custo, dispersão de atenção e mistura entre fundamento e regra operacional.

### Usar somente RAG

Rejeitada porque recuperação probabilística não garante presença de regras de segurança, ética e privacidade.

## Critério de reversão

Esta decisão pode ser revertida por nova decisão arquitetural, acompanhada de avaliação demonstrando ganho de recuperação sem perda de regras obrigatórias.
