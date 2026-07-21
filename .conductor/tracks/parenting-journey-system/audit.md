# Auditoria do produto atual

## Resumo executivo

O projeto já possui as peças centrais de uma jornada útil — perfil da criança, sugestões, biblioteca, modo ativo, reflexão, diário e visualização — mas elas ainda não formam um sistema coerente. A personalização atual é rasa, parte do conteúdo é apenas demonstrativa e algumas telas comunicam uma precisão pedagógica que os dados não sustentam.

O principal salto de produto não é adicionar mais cards. É criar um ciclo confiável:

`entender o momento -> sugerir com contexto -> apoiar a interação -> observar sem julgar -> aprender para a próxima sugestão`

## O que já existe e deve ser preservado

- Grupo autenticado em `app/(dashboard)`.
- Perfil de criança com data de nascimento, interesses, avatar e preferências visuais.
- Catálogo de atividades com idade, energia, duração, materiais, passos e benefícios.
- Sugestão contextual no dashboard.
- Modo de execução com passos e cronômetro.
- Reflexão pós-atividade e registro de execução.
- Diário livre e linha do tempo de atividades.
- Área de crescimento baseada nas execuções.
- Estrutura de histórias no banco, apesar de a interface ainda ser um estado de “em construção”.

## Lacunas críticas

### Confiança e integridade pedagógica

1. `app/(dashboard)/perfil/page.tsx` apresenta percentuais fixos de desenvolvimento e marcos com datas fixas. Esses números são mock e podem ser interpretados como avaliação real da criança.
2. A tela de crescimento valoriza sequência diária. Isso pode gerar culpa e incentivar quantidade em vez de qualidade da interação.
3. Benefícios e “habilidades desbloqueadas” são tratados como resultado obtido, embora uma execução não comprove aquisição de habilidade.
4. Não existe, no modelo de conteúdo, fonte, revisão pedagógica, data de revisão ou nível de evidência.
5. Não há distinção explícita entre observação familiar, monitoramento de marcos e triagem/diagnóstico profissional.

### Personalização

1. `lib/journey/suggestions.ts` considera apenas idade e faixa de energia por horário.
2. A escolha usa `Math.random()`, portanto não é reproduzível, explicável nem aprende com feedback.
3. Interesses, histórico recente, atividades recusadas, materiais disponíveis, ambiente, tempo e energia do cuidador não influenciam a recomendação.
4. O sistema sempre usa a criança cadastrada mais recentemente; não há seleção explícita quando a família possui mais de uma criança.
5. Não há prevenção de repetição nem intenção pedagógica de variar experiências ao longo do tempo.

### Jornada

1. O CTA “Começar agora” leva primeiro ao detalhe e só depois ao modo ativo, criando atrito.
2. O modo ativo é uma lista linear; faltam perguntas que apoiem a interação, sinais para observar, adaptações e permissão para parar.
3. A reflexão pergunta “autonomia” com opções que podem soar avaliativas. O dado coletado nem é persistido.
4. Upload de foto é visualmente oferecido, mas ainda simulado.
5. A ação “Pular” encerra o modal sem deixar claro se a execução foi salva.
6. A campainha do dashboard é decorativa e não possui função.

### Conteúdo e informação

1. A área de histórias ainda é uma promessa, apesar de já ocupar navegação principal.
2. Atividades não possuem campos suficientes para segurança, inclusão, variações, mediação do adulto e contexto de uso.
3. A taxonomia de desenvolvimento não está normalizada e mistura categoria, benefício e habilidade.
4. O diário separa entradas livres de execuções, mas não oferece uma visão unificada centrada na criança.

### Arquitetura e segurança

1. A proteção de rotas no middleware não inclui todas as rotas do grupo autenticado, como `/configuracoes`, `/crescimento` e `/atividade-ativa`.
2. Consultas repetem a regra de selecionar a criança mais recente em diferentes páginas.
3. Há tipos locais duplicados para a mesma entidade de atividade.
4. O esquema base documentado não contém todas as colunas usadas pelo código e pelos seeds, indicando deriva entre documentação e banco real.
5. O uso de `SupabaseClient<any, any, any>` e propriedades `any` reduz a segurança de tipos.

## Decisões imediatas

- Remover ou substituir métricas falsas antes de ampliar a aquisição de usuários.
- Tratar “crescimento” como observações e repertório de experiências, não como score infantil.
- Fazer a recomendação ser determinística, explicável e baseada em regras auditáveis.
- Criar uma fonte única para criança ativa e permitir troca explícita.
- Exigir metadados pedagógicos e de segurança antes de publicar novas atividades.
- Manter o produto como apoio familiar e educacional; nunca sugerir diagnóstico.

## Situação após a primeira correção da Fase 0

- Percentuais, marcos fictícios, streak e “habilidades desbloqueadas” foram removidos das telas familiares.
- Rotas privadas têm proteção central e uma segunda barreira no layout do servidor.
- A criança ativa é explícita para famílias com múltiplas crianças e todas as resoluções filtram também por `usuario_id`.
- Mutações de perfil, diário e execução de atividade foram movidas para Server Actions com validação e prova de propriedade.
- Clientes Supabase e entidades principais estão tipados sem `any` manual.
- O escopo educacional e o caminho para buscar apoio profissional estão visíveis no produto.
- A recomendação deixou de usar aleatoriedade, mas o ranking completo da Fase 1 ainda não foi implementado.
- O banco remoto ainda não pôde ser provado: a chave pública disponível retorna `401 Invalid API key`. Tipos autoritativos, baseline, grants e RLS continuam pendentes.
