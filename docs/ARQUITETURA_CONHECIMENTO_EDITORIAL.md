# Proposta de Arquitetura — Conhecimento Editorial e RAG

> Proposta técnica baseada na auditoria estrutural de `docs/pesquisa/PESQUISA_BRUTA_DIRETRIZES_INFANCIA_2026.md`. Este documento registra uma direção recomendada; não representa ainda uma decisão de implementação nem valida cientificamente as fontes citadas.

**Status:** arquitetura-alvo; implementação de RAG adiada por decisão registrada em `DECISAO_RAG_CONHECIMENTO_EDITORIAL.md`

**Data:** 22 de julho de 2026

**Escopo:** diretrizes científicas, políticas editoriais, criação e revisão de atividades e Brincontos

## 1. Decisão recomendada

> Decisão de fase: a arquitetura abaixo permanece como alvo futuro. Para a etapa atual, o projeto adotará o pacote editorial determinístico e não criará `pgvector`, embeddings ou pipeline de recuperação.

Adotar uma arquitetura híbrida com quatro camadas independentes:

1. **pesquisa bruta preservada:** registro imutável da resposta e de suas referências;
2. **base científica canônica:** afirmações auditadas e ligadas a fontes verificadas;
3. **constituição e políticas editoriais:** regras pequenas, versionadas e sempre carregadas;
4. **RAG com busca híbrida:** recuperação contextual da evidência necessária para cada tarefa.

O RAG não deve ser responsável por lembrar regras críticas. Segurança, privacidade, adequação etária, possibilidade de recusa, proibição de diagnóstico e requisitos de publicação devem ser aplicados por políticas sempre presentes e validações determinísticas.

```text
Pesquisa bruta
      ↓ auditoria humana e técnica
Fontes verificadas ↔ afirmações canônicas
      ↓
Documentos canônicos → chunks indexados → recuperação híbrida
      ↓                         ↓
Políticas obrigatórias + evidência recuperada
      ↓
Criação → validação → revisão profissional → publicação
```

## 2. Auditoria inicial do documento recebido

### Estrutura aproveitável

O documento possui aproximadamente 103 mil caracteres e está organizado em:

- 20 conclusões executivas;
- 9 princípios fundamentais;
- 14 temas científicos e normativos;
- 9 faixas etárias;
- matriz de evidências;
- comparação Brasil/internacional;
- regras de linguagem e alegações;
- checklists para atividades e histórias;
- protocolo editorial;
- diretrizes para recomendação;
- lacunas e auditoria crítica da própria resposta;
- 86 definições de referências, todas citadas pelo menos uma vez.

Essa estrutura é uma boa matéria-prima para normalização semântica. Os capítulos já fornecem fronteiras naturais para separar políticas, evidências, faixas etárias e checklists.

### Limitação central

O texto é uma **síntese produzida por ferramenta de pesquisa**, e não uma fonte científica. Uma citação presente não prova, por si só, que a fonte sustenta exatamente a frase associada. Antes de promover qualquer trecho a conhecimento canônico, é necessário confirmar:

- existência e autoria do documento original;
- URL canônica;
- vigência e versão;
- população/faixa etária abrangida;
- natureza da fonte: lei, diretriz, revisão, estudo, consenso ou material educativo;
- correspondência entre a afirmação e o conteúdo da fonte;
- limitações, conflitos de interesse e eventuais divergências.

### Qualidade desigual das referências

Há fontes primárias fortes, como domínios oficiais da OMS, UNICEF, AAP, Governo Federal, Planalto, MEC, SBP e CPS. Entretanto, a bibliografia também inclui candidatos inadequados como fundamento canônico quando houver original disponível:

- SlideShare;
- Facebook;
- Scribd;
- Academia.edu;
- escritórios de advocacia resumindo atos da ANPD;
- portais secundários e cópias não oficiais;
- vídeos do YouTube;
- periódicos ou repositórios cuja revisão e indexação precisam ser confirmadas.

Essas referências não precisam ser apagadas da pesquisa bruta. Devem ser substituídas por originais, rebaixadas para material auxiliar ou excluídas da base canônica.

### Pontos que exigem verificação prioritária

- atualidade das recomendações de telas da AAP e da SBP;
- fonte oficial da ANPD para tratamento de dados de crianças;
- textos oficiais das DCNEI, BNCC, ECA e Marco Legal, evitando espelhos;
- alcance exato das recomendações de atividade física por idade;
- distinção entre brincar analógico, brincar digital e *game-based learning*;
- força real das conclusões sobre integração sensorial;
- evidências específicas para 6–8 anos, menos cobertos por documentos de primeira infância;
- correspondência de alguns títulos e URLs na bibliografia final;
- datas apresentadas como 2026 em páginas que podem não ter versão formal datada.

### Riscos de indexar o arquivo bruto

Indexar diretamente as mil linhas produziria:

- repetição da mesma conclusão em várias seções;
- recuperação de fontes fortes e fracas com peso equivalente;
- conflito entre regra normativa, evidência científica e inferência prudencial;
- trechos sem contexto suficiente sobre idade e limitações;
- propagação de eventuais erros de citação;
- respostas excessivamente confiantes para temas nos quais o próprio documento reconhece lacunas.

Por isso, a pesquisa bruta deve permanecer fora do índice de produção até terminar a auditoria das fontes.

## 3. Organização recomendada no repositório

```text
docs/
├── pesquisa/
│   ├── PESQUISA_BRUTA_DIRETRIZES_INFANCIA_2026.md
│   └── AUDITORIA_DE_FONTES.md
├── ciencia/
│   ├── BASE_CIENTIFICA_CANONICA.md
│   ├── MATRIZ_DE_EVIDENCIAS.md
│   └── FONTES_VERIFICADAS.md
├── editorial/
│   ├── CONSTITUICAO_EDITORIAL.md
│   ├── TAXONOMIA_DE_CONTEUDO.md
│   ├── DIRETRIZES_POR_FAIXA_ETARIA.md
│   ├── ALEGACOES_E_LINGUAGEM.md
│   └── POLITICA_DE_ATUALIZACAO.md
└── checklists/
    ├── ATIVIDADE.md
    ├── BRINCONTO.md
    ├── SEGURANCA.md
    ├── ACESSIBILIDADE.md
    └── PUBLICACAO.md
```

### Responsabilidade de cada camada

| Artefato | Papel | Carregamento pela IA |
| --- | --- | --- |
| Pesquisa bruta | Proveniência e ponto de partida | Nunca por padrão |
| Base científica | Síntese auditada e citável | Via RAG |
| Matriz de evidências | Afirmações atômicas, confiança e fontes | Via RAG/filtros |
| Constituição editorial | Princípios inegociáveis | Sempre |
| Diretrizes por idade | Adequação e cautelas | Sempre para a faixa da tarefa |
| Checklists | Critérios de aceite | Sempre conforme o tipo de conteúdo |
| Políticas de atualização | Vigência e governança | Nos processos de manutenção |

O repositório deve continuar sendo a origem humana, revisável e versionada das políticas. O banco será sua projeção operacional para busca, geração assistida e auditoria.

## 4. Modelo de conhecimento

O schema `brincareducando` já contém:

- `conteudos_fontes`;
- `atividades_fontes`;
- `historias_fontes`;
- `revisoes_conteudo`.

A arquitetura deve ampliar esse modelo, não criar um segundo catálogo desconectado.

### 4.1 Evolução de `conteudos_fontes`

Manter os campos existentes e acrescentar, por migração incremental:

| Campo | Finalidade |
| --- | --- |
| `url_canonica` | Endereço oficial preferido |
| `idioma` | Idioma do documento |
| `jurisdicao` | Brasil, internacional ou país específico |
| `categoria_fonte` | lei, diretriz, revisão sistemática, estudo, consenso, material educativo |
| `nivel_autoridade` | classificação editorial controlada |
| `status_verificacao` | pendente, verificada, substituída, rejeitada, desatualizada |
| `verificada_em` | data da última auditoria |
| `verificada_por` | responsável pela verificação |
| `documento_local` | caminho para snapshot permitido/licenciado, quando houver |
| `hash_conteudo` | detecção de alteração de versão |

`tipo_evidencia`, `publicado_em`, `consultado_em` e `proxima_revisao` já fazem parte da tabela e devem continuar sendo utilizados.

### 4.2 Nova tabela `evidencias_afirmacoes`

Cada linha deve representar uma única afirmação verificável, e não um capítulo inteiro.

Campos sugeridos:

```text
id
codigo estável
afirmacao
tipo: cientifica | normativa | consenso | prudencial | seguranca
confianca: alta | moderada | baixa | insuficiente
idade_min_meses
idade_max_meses
temas[]
contextos[]
limitacoes
aplicacao_editorial
status: rascunho | verificada | suspensa | arquivada
versao
revisada_em
proxima_revisao
created_at / updated_at
```

Exemplo: “A leitura compartilhada cria oportunidades de conversa e exposição à linguagem” é uma afirmação. “Ler este Brinconto aumentará o vocabulário desta criança” é uma promessa individual e não deve se tornar afirmação canônica.

### 4.3 Nova tabela `evidencias_afirmacoes_fontes`

Relação muitos-para-muitos entre afirmações e fontes:

```text
afirmacao_id
fonte_id
relacao: sustenta | qualifica | diverge | contextualiza
trecho_relevante
pagina_ou_secao
observacao_editorial
```

Isso permite representar divergências sem escolher silenciosamente uma fonte.

### 4.4 Tabelas de documentos e chunks

#### `conhecimento_documentos`

Registra apenas documentos aprovados para recuperação:

```text
id
slug
titulo
tipo: base_cientifica | matriz | diretriz_etaria | checklist | politica
versao
status: rascunho | ativo | substituido | arquivado
caminho_repositorio
hash_conteudo
publicado_em
proxima_revisao
```

#### `conhecimento_chunks`

```text
id
documento_id
afirmacao_id opcional
secao
caminho_secao[]
conteudo
resumo
idade_min_meses
idade_max_meses
temas[]
contextos[]
tipo_conhecimento
nivel_autoridade
obrigatorio
conteudo_hash
modelo_embedding
embedding
busca_textual
status
created_at / updated_at
```

A dimensão do vetor deve ser escolhida somente depois da definição do modelo de embeddings. O nome e a versão do modelo precisam acompanhar cada vetor; trocar o modelo exige uma nova indexação controlada.

## 5. Taxonomia de autoridade

Uma classificação inicial simples:

| Nível | Uso | Exemplos |
| --- | --- | --- |
| A | Fundamento principal | lei ou órgão oficial; diretriz de sociedade científica; revisão sistemática de boa qualidade |
| B | Complemento qualificado | estudo revisado por pares; framework acadêmico/institucional reconhecido |
| C | Contexto auxiliar | material educativo institucional, síntese ou guia prático |
| D | Não canônico | notícia, rede social, blog, espelho, apresentação, repositório não verificado |

O nível não substitui a natureza da evidência. Uma lei é autoridade normativa, não prova experimental; uma meta-análise pode sustentar eficácia média, mas não criar obrigação jurídica.

## 6. Constituição editorial sempre presente

O documento curto deve conter apenas regras inegociáveis, entre elas:

1. vínculo antes de desempenho;
2. brincar como convite, com escolha, adaptação, pausa e recusa;
3. nenhuma comparação, nota, ranking ou streak infantil;
4. nenhuma inferência de diagnóstico, inteligência, humor ou capacidade;
5. faixa etária como orientação, com restrições rígidas apenas quando houver segurança envolvida;
6. linguagem sem culpa, alarmismo ou promessa individual;
7. minimização de dados e privacidade por padrão;
8. alternativas de acesso para fala, movimento, visão, audição, materiais e telas;
9. supervisão e riscos explicitados;
10. publicação apenas com contrato editorial e revisão completos.

Essas regras devem existir também como códigos estáveis, por exemplo `SAFE-SMALL-PARTS`, `ETH-NO-DIAGNOSIS` e `AGE-GUIDANCE`, para que revisões e bloqueios sejam rastreáveis.

## 7. Estratégia de chunking

### Não fazer

- quebrar o arquivo a cada número fixo de caracteres;
- indexar notas de rodapé desconectadas das afirmações;
- misturar várias faixas etárias no mesmo chunk;
- misturar uma regra obrigatória com uma discussão especulativa;
- indexar fontes rejeitadas como se fossem verificadas.

### Fazer

- usar títulos e subtítulos como fronteiras;
- preferir uma afirmação ou recomendação coerente por chunk;
- manter limitações e citação no mesmo chunk da afirmação;
- registrar a seção-pai para ampliar contexto depois da recuperação;
- gerar chunks curtos para correspondência e recuperar também seu bloco-pai;
- deduplicar pelo hash normalizado e pela afirmação canônica;
- marcar claramente idade, tema, risco, autoridade e vigência.

Como ponto de partida, blocos entre aproximadamente 300 e 900 tokens são aceitáveis, mas a unidade semântica prevalece sobre o tamanho. O *overlap* deve ser pequeno e reservado a transições reais.

## 8. Recuperação

Usar busca híbrida:

1. filtros estruturados;
2. busca textual do PostgreSQL;
3. similaridade vetorial;
4. combinação das pontuações;
5. reranking;
6. montagem do contexto com deduplicação.

### Filtros obrigatórios

- `status = ativo/verificada`;
- sobreposição com a faixa etária da tarefa;
- tipo de conteúdo;
- tema e contexto;
- risco/material quando aplicável;
- validade da revisão;
- jurisdição, priorizando Brasil para normas e recomendações locais.

### Pacote mínimo para criação

Uma criação de atividade deve receber:

- constituição editorial integral;
- checklist de atividade integral;
- checklist de segurança integral;
- diretriz da faixa etária;
- evidências específicas do objetivo;
- evidências específicas dos materiais e riscos;
- adaptações de acessibilidade relevantes;
- citações e limitações das afirmações utilizadas.

Se não houver evidência suficiente, a saída deve dizer isso e evitar a alegação; não deve preencher a lacuna com linguagem confiante.

## 9. Pipeline de ingestão

```text
1. Registrar fonte
2. Verificar URL, versão, autoria e vigência
3. Classificar autoridade e tipo de evidência
4. Extrair afirmações atômicas
5. Relacionar afirmações às fontes
6. Revisar limitações e aplicação editorial
7. Aprovar documento canônico
8. Gerar chunks e metadados
9. Validar citações e hashes
10. Gerar embeddings
11. Publicar nova versão do índice
12. Executar avaliação de recuperação
```

Uma atualização deve construir a nova versão antes de ativá-la. A versão anterior só é substituída após validação; isso permite rollback sem perda de histórico.

## 10. Pipeline de criação e publicação

```text
Lacuna de catálogo
      ↓
Brief estruturado
      ↓
Recuperação de evidências
      ↓
Rascunho com rastreabilidade
      ↓
Validações automáticas
      ↓
Revisão editorial
      ↓
Revisão pedagógica / segurança / acessibilidade conforme risco
      ↓
Piloto com cuidadores quando aplicável
      ↓
Publicação
      ↓
Monitoramento e revisão periódica
```

### Validações automáticas possíveis

- todos os campos obrigatórios preenchidos;
- idade mínima menor ou igual à máxima;
- material de risco acompanhado de regra de segurança;
- atividade para menores de 3 anos sem peça pequena liberada;
- alegações proibidas detectadas;
- fontes verificadas associadas às alegações editoriais;
- alternativas de acessibilidade presentes;
- sinais para adaptar ou parar presentes;
- revisão vigente antes de `publicado = true`.

Validações automáticas não aprovam mérito pedagógico nem segurança complexa. Elas bloqueiam omissões previsíveis e encaminham o restante para revisão humana.

## 11. Integração com o código

Estrutura sugerida:

```text
lib/editorial/
├── policies.ts
├── schemas.ts
├── retrieval.ts
├── validation.ts
└── citations.ts

scripts/
├── audit-evidence.mjs
├── ingest-evidence.mjs
└── evaluate-retrieval.mjs

tests/
├── editorial-policies.test.ts
├── evidence-ingestion.test.ts
└── evidence-retrieval.test.ts
```

As políticas obrigatórias devem possuir representação TypeScript/Zod para uso no editor, nas Server Actions e nos testes. O texto Markdown continua sendo a versão legível para pessoas; códigos e versões permitem provar qual conjunto de regras avaliou cada conteúdo.

## 12. Segurança e acesso

- escrita em fontes, afirmações, documentos e chunks somente por administrador ou processo de ingestão com `service_role` no servidor;
- nenhuma chave de serviço no cliente;
- RLS habilitada em todas as novas tabelas;
- famílias não precisam acessar a base interna completa;
- fontes e explicações públicas devem ser expostas por consulta controlada, não por grants amplos de escrita;
- logs de recuperação não devem conter dados privados da criança;
- idade usada na recuperação deve ser reduzida ao necessário e não incorporada ao corpus;
- o corpus científico não deve ser combinado com registros do Diário.

## 13. Avaliação do RAG

Antes de usar a recuperação para criar conteúdo, montar um conjunto de perguntas de referência cobrindo:

- as 9 faixas etárias;
- atividades, Brincontos e recomendações;
- segurança com água, alimentos, peças pequenas, temperatura e ambiente externo;
- telas;
- acessibilidade;
- linguagem e alegações;
- privacidade e personalização;
- divergências Brasil/internacional.

Critérios mínimos:

- nenhuma regra obrigatória ausente do pacote de contexto;
- nenhuma fonte rejeitada apresentada como fundamento;
- nenhuma evidência de faixa incompatível sem aviso;
- citações rastreáveis até a fonte;
- recuperação de limitações junto das alegações;
- resposta explícita quando a evidência for insuficiente;
- testes de regressão antes de mudar embedding, chunking ou ranking.

Precisão semântica isolada não basta. Para segurança, o indicador principal é a recuperação de todas as regras obrigatórias relevantes.

## 14. Observabilidade e governança

Registrar, sem dados familiares desnecessários:

- versão da constituição;
- versão dos checklists;
- versão do corpus;
- modelo de embedding;
- consulta editorial;
- IDs dos chunks recuperados;
- fontes utilizadas;
- validações aprovadas e reprovadas;
- revisores e datas;
- versão do conteúdo publicado.

Isso deve permitir responder: “quais evidências e regras sustentaram esta atividade na versão em que foi publicada?”.

## 15. Plano incremental

### Fase 0 — auditoria

- verificar as 86 referências;
- substituir espelhos e fontes frágeis por originais;
- classificar autoridade, tipo, vigência e aplicabilidade;
- corrigir correspondências entre títulos, URLs e afirmações.

### Fase 1 — documentos canônicos

- produzir Constituição Editorial;
- extrair Matriz de Evidências;
- consolidar diretrizes por faixa;
- criar checklists operacionais;
- revisar tudo antes de qualquer embedding.

### Fase 2 — modelo de dados

- criar migração incremental;
- ampliar `conteudos_fontes`;
- criar afirmações, vínculos, documentos e chunks;
- definir RLS e funções de busca;
- regenerar os tipos TypeScript.

### Fase 3 — ingestão e busca

- implementar auditoria automática de documentos;
- gerar chunks semânticos;
- escolher modelo de embedding;
- implementar busca híbrida e filtros;
- registrar versões e hashes.

### Fase 4 — criação assistida

- montar brief estruturado;
- gerar rascunho com citações;
- executar validações automáticas;
- integrar ao fluxo de revisão existente.

### Fase 5 — avaliação e produção

- executar conjunto de testes de recuperação;
- validar com equipe editorial e profissionais;
- publicar inicialmente para uso interno;
- monitorar falhas antes de automatizar qualquer etapa adicional.

## 16. Próxima decisão

O próximo passo recomendado não é criar a migration de `pgvector`. É produzir a auditoria das fontes e a primeira versão da Constituição Editorial. Esses dois artefatos determinam o que pode ser indexado e o que deve permanecer sempre presente.

Depois dessa etapa, será possível escolher o modelo de embeddings e fechar o schema sem cristalizar erros ou conteúdo ainda não verificado.
