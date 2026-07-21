# Brincar Educando — Sistema de Jornada Familiar

## 1. Visão

O Brincar Educando ajuda mães, pais e cuidadores a transformar momentos comuns em oportunidades de vínculo, brincadeira e aprendizagem. O produto responde, de forma simples, a quatro perguntas reais:

1. **O que podemos fazer agora?**
2. **Como eu conduzo sem transformar a brincadeira em aula?**
3. **O que posso observar e acolher nesta fase?**
4. **Como guardar e compreender nossa história sem comparar minha criança?**

O sistema não promete “acelerar” o desenvolvimento. Ele oferece contexto, repertório e confiança para que o adulto esteja mais disponível e responsivo.

### North Star

**Interações significativas concluídas com percepção positiva do cuidador**, e não tempo de tela, streak ou número bruto de atividades.

Uma interação significativa pode ser uma atividade guiada, uma história compartilhada ou um registro de observação. “Concluída” inclui parar porque a criança perdeu o interesse: respeitar o sinal também é sucesso.

## 2. Público e recorte

### Público principal

- Famílias com crianças de 0 a 6 anos.
- Adultos cansados, com pouco tempo e dúvida sobre o que propor.
- Famílias com diferentes espaços, materiais, rotinas e configurações.
- Mais de uma criança por família, com troca clara da criança ativa.

### Expansão futura

- Conteúdo de 7 a 9 anos, preservando o mesmo modelo de interação e autonomia.
- Modo educador, separado da experiência familiar.

O MVP pedagógico deve priorizar 0–6 anos, pois é onde a jornada atual e as fontes de primeira infância oferecem maior coerência. A arquitetura continuará aceitando faixas etárias maiores.

## 3. Princípios pedagógicos

### 3.1 Interação responsiva

Toda experiência deve favorecer trocas de ida e volta: o adulto observa o sinal da criança, responde e dá tempo para uma nova resposta. O roteiro oferece perguntas e pausas, não comandos contínuos.

### 3.2 Brincadeira com protagonismo infantil

A atividade precisa ser ativa, prazerosa e flexível. O adulto prepara o ambiente e oferece possibilidades; a criança pode explorar, mudar a regra, repetir ou parar.

### 3.3 Desenvolvimento integral

O conteúdo considera dimensões interligadas:

- vínculo e socioemocional;
- comunicação e linguagem;
- corpo e movimento;
- exploração sensorial;
- pensamento, curiosidade e resolução de problemas;
- imaginação, expressão e cultura;
- autonomia cotidiana.

Essas dimensões organizam o repertório. Elas não viram notas ou percentuais da criança.

### 3.4 Observação sem comparação

O diário registra preferências, estratégias, falas, descobertas e emoções. O sistema pode revelar padrões do histórico da própria criança, mas não ranqueia, compara com outras crianças ou declara habilidade “adquirida”.

### 3.5 Repetição com variação

Crianças aprendem também repetindo. O recomendador não deve apenas evitar repetição: ele pode sugerir uma brincadeira conhecida com uma pequena variação, explicando por que repetir pode ser valioso.

### 3.6 Inclusão e adaptação

Cada atividade deve oferecer adaptações por mobilidade, comunicação, sensibilidade sensorial, espaço e participação do adulto. As adaptações não pressupõem diagnóstico.

### 3.7 Cuidado com o cuidador

O produto reconhece energia e disponibilidade do adulto. Deve existir sempre uma opção curta, de baixo preparo e sem culpa.

### 3.8 Segurança e limites

Atividades devem informar supervisão, riscos, idade segura de materiais, alergias relevantes e condições de interrupção. Conteúdo de saúde ou desenvolvimento sempre orienta consulta a profissional diante de preocupação, sem alarmismo.

## 4. Arquitetura da experiência

### Navegação principal

1. **Hoje** — orientação personalizada e retomada rápida.
2. **Explorar** — atividades, brincadeiras e filtros.
3. **Histórias** — leitura compartilhada e conversas.
4. **Diário** — memórias e observações.
5. **Jornada** — padrões, repertório vivido e próximos caminhos.

Perfil e configurações ficam no menu da conta. “Crescimento” deixa de ser uma seção de métricas e passa a se chamar **Jornada**, com linguagem não avaliativa.

### Ciclo principal

```text
Contexto de hoje
      ↓
Sugestão explicada + alternativas
      ↓
Preparar → brincar junto → adaptar/parar
      ↓
Reflexão opcional de 10–20 segundos
      ↓
Memória no diário + melhoria da próxima sugestão
```

## 5. Tela Hoje — dashboard alvo

### 5.1 Cabeçalho

- Saudação correta por horário.
- Seletor da criança ativa com avatar, nome e idade legível.
- Acesso discreto ao perfil.
- Sem campainha até existir um sistema real de avisos.

### 5.2 Check-in leve

Pergunta opcional: **“Como está o momento por aí?”**

Chips de uma seleção:

- Temos 5 minutos
- Quero gastar energia
- Precisamos desacelerar
- Estamos sem materiais
- Podemos ir lá fora
- O adulto está cansado

O usuário pode ignorar. A seleção vale apenas para a sessão ou pode ser lembrada como preferência se ele solicitar.

### 5.3 Plano para agora

Uma recomendação principal com:

- título e imagem real;
- duração total, preparo e nível de bagunça;
- materiais já visíveis;
- explicação curta: “Boa para agora porque…”;
- uma intenção de interação, não uma promessa de resultado;
- CTA **Brincar agora**;
- ação **Trocar sugestão**, coletando motivo opcional.

Sempre mostrar duas alternativas compactas:

- **Mais simples** — menor preparo/tempo;
- **Outro clima** — energia ou ambiente diferente.

### 5.4 Dica da fase

Uma única dica contextual, com fonte acessível em “Saiba por quê”. Exemplos:

- “Nesta fase, nomear o que vocês veem durante a brincadeira é mais útil do que fazer muitas perguntas.”
- “Se ela quiser repetir, acompanhe: a repetição ajuda a antecipar e ganhar segurança.”

A dica deve ser revisada editorialmente e não inferida automaticamente por IA em produção.

### 5.5 Retomar e recordar

- História iniciada recentemente ou história adequada ao momento.
- Última memória do diário, quando houver.
- “Vocês gostaram de…” com sugestão de variação baseada em feedback real.

### 5.6 Estados essenciais

- Sem criança cadastrada: onboarding curto e acolhedor.
- Sem recomendação exata: melhores opções seguras para a faixa, explicando a limitação.
- Primeira visita: demonstração guiada do ciclo em até três passos.
- Erro de dados: alternativa local útil, sem tela vazia.
- Mais de uma criança: nunca escolher silenciosamente por `created_at`.

## 6. Explorar — biblioteca útil

### Modos de entrada

- Busca livre.
- “Preciso de uma ideia para…”: acalmar, movimentar, conectar, esperar, banho, refeição, viagem, dia de chuva.
- Filtros objetivos: idade, tempo, preparo, bagunça, ambiente, materiais, energia, número de crianças e acessibilidade.
- Coleções editoriais: sem brinquedos, no colo, natureza, irmãos, rotina, emoções, faz de conta.

### Card de atividade

- Nome e imagem.
- “Para [criança]” apenas quando os critérios realmente coincidirem.
- Tempo total e preparo.
- Materiais principais.
- Energia e ambiente.
- Favoritar.
- Nunca usar “habilidade desbloqueada”.

### Detalhe de atividade

1. O que vocês vão viver.
2. Por que combina com esta fase.
3. Materiais e substituições.
4. Segurança e supervisão.
5. Preparação do ambiente.
6. Passos curtos.
7. Frases/perguntas que ajudam o adulto a interagir.
8. Sinais de interesse e sinais de que é hora de adaptar ou parar.
9. Variações: simplificar, ampliar, repetir outro dia.
10. Adaptações inclusivas.
11. Fonte e revisão do conteúdo.

## 7. Modo Brincar

O modo ativo deve reduzir carga cognitiva e celular na mão.

### Fluxo

- Tela de preparação com checklist e aviso de segurança.
- Um passo por vez, com texto grande e opção “mostrar todos”.
- Cronômetro opcional e desligado por padrão; a brincadeira não precisa durar um tempo mínimo.
- Cartão “Experimente dizer…” com uma frase responsiva.
- Ações rápidas: adaptar, criança perdeu o interesse, pausar, encerrar.
- Encerrar cedo continua sendo uma conclusão válida.

### Reflexão pós-brincadeira

Deve ser opcional, curta e não julgadora:

1. **Como foi para vocês?** gostou / mais ou menos / não era o momento.
2. **O que chamou atenção?** movimento / sons e palavras / texturas / imaginar / fazer junto / outro.
3. Nota, fala da criança ou foto — tudo opcional.

Remover “fez tudo sozinha” como indicador de sucesso. Participação conjunta e apoio do adulto são parte valiosa do processo.

## 8. Histórias — Brincontos

### Objetivo

Criar rituais de vínculo, linguagem, imaginação e elaboração emocional. Histórias não precisam ensinar uma “moral” explícita.

### Descoberta

- Por idade e duração.
- Por momento: dormir, acalmar, rir, conversar, esperar.
- Por tema: emoções, família, diversidade, natureza, corpo, amizade, medos, autonomia.
- Por forma: para ouvir, ler junto ou inventar finais.

### Experiência de leitura

- Modo leitura com tipografia ajustável e baixa distração.
- Áudio opcional, nunca como substituto obrigatório da interação.
- Pausas sugeridas em no máximo 2–4 pontos.
- Perguntas abertas e observacionais, não prova de compreensão.
- Opção “inventem juntos” para escolher personagem, cenário ou final.
- Atividade de extensão simples após a história.

### Qualidade editorial

- Linguagem adequada à faixa.
- Representação diversa e não estereotipada.
- Revisão de temas sensíveis.
- Créditos de autoria, ilustração, fontes e revisão.

## 9. Diário — memória com significado

O diário unifica:

- atividades realizadas;
- histórias lidas;
- registros livres;
- fotos e falas;
- observações de interesses e estratégias.

### Registro rápido

Atalhos:

- Uma frase que ela disse
- Uma descoberta
- Um desafio de hoje
- Algo que fez rir
- Uma foto
- Quero escrever livremente

### Privacidade

- Fotos são opcionais e privadas por padrão.
- Informar claramente armazenamento, exclusão e exportação.
- Não usar conteúdo familiar para treinar modelos sem consentimento específico e separado.
- Permitir exportar memórias por criança e excluir definitivamente.

## 10. Jornada — devolutiva útil

Substitui gráficos de desempenho por quatro blocos:

### “O que tem encantado”

Padrões de preferência inferidos apenas de interações reais e sempre com linguagem probabilística: “Nas últimas semanas, [nome] pareceu se envolver mais com música e movimento.”

### “Experiências vividas”

Distribuição de tipos de experiências oferecidas, deixando claro que mede o repertório registrado, não o desenvolvimento da criança.

### “Momentos para lembrar”

Falas, fotos e observações selecionadas do diário.

### “Próximos convites”

Duas ou três sugestões que ampliam suavemente o repertório ou repetem algo querido com variação.

Não haverá score de desenvolvimento, ranking, metas obrigatórias, streak punitivo ou previsão de marco.

## 11. Motor de recomendação

### 11.1 Filtros obrigatórios

- Faixa etária.
- Publicado e revisado.
- Restrições de segurança.
- Contexto incompatível explícito.
- Disponibilidade da atividade e dos seus assets.

### 11.2 Pontuação explicável

```text
score =
  adequação à fase              30%
  contexto informado hoje      20%
  interesses observados        15%
  disponibilidade/baixo atrito 15%
  variedade pedagógica         10%
  feedback anterior            10%
```

Pesos são configuração versionada, não números espalhados no código.

### 11.3 Regras

- Resultado determinístico para a mesma criança, contexto e janela do dia.
- Rotação por janela diária, sem `Math.random()`.
- Atividades recusadas por “sem material” perdem prioridade temporariamente.
- “Não era o momento” não vira rejeição permanente.
- Repetição intencional pode ganhar prioridade quando houve envolvimento positivo.
- Garantir alternativa curta e de baixo preparo.
- Registrar a razão da recomendação e mostrá-la em linguagem simples.
- Permitir feedback “mais como esta” e “menos como esta”.

### 11.4 Dados mínimos

Sem check-in, o sistema funciona com idade, hora local, interesses informados e histórico. Nunca bloquear a experiência por falta de dados opcionais.

## 12. Modelo de conteúdo

### Atividade — campos necessários

- identificação: título, slug, resumo, imagem;
- fases: idade mínima/máxima em meses e justificativa editorial;
- intenção: domínios de experiência primário/secundários;
- contexto: duração total, preparo, energia da criança, energia do adulto, ambiente, bagunça, participantes;
- materiais estruturados com substituições;
- preparação, passos e encerramento;
- prompts de interação;
- sinais para observar;
- variações e adaptações;
- segurança: supervisão, riscos, peças pequenas, água, alimento, alergia, movimento e limpeza;
- evidência: fontes, revisão, responsável, data e próxima revisão;
- status editorial: rascunho, revisão pedagógica, revisão de segurança, publicado, arquivado.

### Fonte científica

Cada fonte precisa de título, organização/autoria, URL/DOI, data, tipo de evidência, resumo editorial e data de consulta. O conteúdo publicado deve ser rastreável às fontes que o sustentam.

## 13. Modelo de dados proposto

### Novas tabelas

- `familias_preferencias`: idioma, rotina, acessibilidade e preferências de privacidade.
- `crianca_contextos`: preferências não clínicas e ajustes de experiência por criança.
- `conteudos_fontes`: referências científicas e institucionais.
- `atividades_fontes`: relação entre atividade, fonte e afirmação sustentada.
- `atividades_adaptacoes`: adaptações estruturadas por necessidade/contexto.
- `recomendacoes_eventos`: impressão, abertura, troca, início, conclusão e motivo.
- `historias_prompts`: pausas, perguntas e extensões de leitura.
- `historias_sessoes`: progresso e feedback da leitura por criança.
- `diario_midias`: arquivos privados com metadados e políticas de exclusão.
- `observacoes`: registro unificado de fala, interesse, emoção, descoberta e desafio.
- `revisoes_conteudo`: autor, revisor, status, parecer e datas.

### Ajustes nas tabelas atuais

- `atividades`: adicionar metadados contextuais, segurança, versionamento e status editorial.
- `atividades_execucoes`: persistir percepção, sinais observados, motivo de encerramento, versão do conteúdo e contexto da recomendação.
- `criancas`: evitar campos clínicos livres; adicionar `ativo` e não usar ordem de criação como seleção.
- `historico`: migrar gradualmente para sessões de história com eventos claros.

### Camada de domínio

Criar tipos gerados do Supabase e serviços únicos:

- `getActiveChild`
- `setActiveChild`
- `getTodayPlan`
- `recordRecommendationEvent`
- `completeActivitySession`
- `getJourneyInsights`

Server Components consultam dados; Client Components ficam restritos a interação local e mutações.

## 14. Onboarding progressivo

### Primeiro acesso

Pedir apenas:

- nome/apelido;
- data de nascimento;
- seleção de criança ativa, quando houver mais de uma.

Interesses e contexto entram depois, em perguntas opcionais distribuídas pela experiência. Gênero e cor favorita não são necessários para recomendar e não devem ser obrigatórios.

### Promessa clara

“Usamos a idade e o que funciona para sua família para sugerir brincadeiras possíveis. Você decide o que faz sentido hoje.”

## 15. Tom de voz

- Acolhedor, direto e concreto.
- Falar com o adulto sem infantilizá-lo.
- Evitar “missão cumprida”, “habilidade desbloqueada” e excesso de gamificação.
- Preferir “convite”, “experiência”, “observar”, “experimentar” e “vocês”.
- Normalizar dias difíceis: “Hoje não encaixou? Tudo bem.”
- Não prometer resultados causais individuais.

## 16. Acessibilidade e inclusão

- Contraste AA, foco visível, navegação por teclado e alvos de toque de pelo menos 44 px.
- Não depender apenas de cor, emoji ou imagem.
- Respeitar redução de movimento.
- Texto redimensionável e modo de leitura confortável.
- Alt text editorial nas imagens.
- Instruções compatíveis com leitores de tela.
- Adaptações sem rótulos capacitistas ou suposição de déficit.
- Famílias, corpos, culturas e tons de pele diversos nas histórias e imagens.

## 17. Segurança, privacidade e limites

- Área autenticada protegida de forma centralizada.
- RLS por família/criança em todas as tabelas privadas.
- URLs assinadas para mídia privada.
- Auditoria de acesso e exclusão.
- Minimização de dados de crianças.
- Consentimento granular para notificações, fotos e qualquer personalização avançada.
- Aviso permanente e discreto: o produto apoia observação e brincadeira; não substitui pediatra, avaliação ou acompanhamento profissional.
- Diante de preocupação registrada, oferecer orientação segura para conversar com profissional de saúde, sem gerar diagnóstico automatizado.

## 18. Governança científica e editorial

### Publicação

Nenhuma atividade ou dica entra em produção sem:

1. autoria identificada;
2. fonte rastreável;
3. revisão pedagógica;
4. revisão de segurança quando aplicável;
5. faixa etária e linguagem revisadas;
6. data da próxima revisão.

### Conselho de revisão recomendado

- Pedagogo(a) de primeira infância.
- Pediatra do desenvolvimento ou profissional equivalente para conteúdos de desenvolvimento/saúde.
- Especialista em inclusão quando houver adaptações específicas.
- Leitura sensível/diversidade para histórias e imagens.

### Princípio de evidência

Uma atividade pode ser criativa sem possuir um estudo próprio. O texto deve separar:

- a experiência proposta;
- a intenção pedagógica plausível;
- a evidência mais ampla sobre brincar e interação;
- aquilo que não pode ser afirmado como resultado individual.

## 19. Métricas de produto

### Valor para a família

- taxa de início após recomendação;
- taxa de conclusão ou encerramento respeitoso;
- percepção “foi útil para nós hoje?”;
- tempo até encontrar uma opção viável;
- variedade de contextos usados;
- retorno voluntário ao diário;
- uso de repetição/variação;
- redução de trocas por “não tenho material/tempo”.

### Qualidade do recomendador

- aceitação por razão exibida;
- cobertura de alternativas de baixo atrito;
- repetição indesejada;
- taxa de conteúdo sem revisão ou asset;
- diversidade do repertório oferecido;
- diferenças de desempenho por faixa, contexto e acessibilidade.

### Guardrails

- exclusões de conta e mídia;
- relatos de conteúdo inseguro ou inadequado;
- abandono no onboarding;
- linguagem interpretada como diagnóstico;
- pressão percebida ou culpa relatada.

## 20. Fontes fundadoras

- Organização Mundial da Saúde — Nurturing Care e recomendações para cuidado responsivo e aprendizagem inicial: https://www.who.int/teams/maternal-newborn-child-adolescent-health-and-ageing/child-health/nurturing-care
- American Academy of Pediatrics — *The Power of Play*, relatório clínico reafirmado em 2025: https://publications.aap.org/pediatrics/article/142/3/e20182058/38649/The-Power-of-Play-A-Pediatric-Role-in-Enhancing
- Center on the Developing Child at Harvard — interações de “serve and return”: https://developingchild.harvard.edu/key-concept/serve-and-return/
- Ministério da Saúde — Caderneta da Criança e acompanhamento do desenvolvimento: https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-da-crianca/caderneta
- Ministério da Saúde — orientações de desenvolvimento infantil: https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-da-crianca/primeira-infancia/desenvolvimento-infantil
- CDC — monitoramento de marcos e orientação para agir diante de preocupações: https://www.cdc.gov/act-early/families/index.html
- BNCC/MEC — brincar e interações como eixos, com direitos de conviver, brincar, participar, explorar, expressar e conhecer-se: https://basenacionalcomum.mec.gov.br/implementacao/praticas/caderno-de-praticas/aprofundamentos/198-o-lugar-do-ludico-na-educacao-infantil
- Sociedade Brasileira de Pediatria — segurança dos brinquedos e o papel insubstituível da interação: https://www.sbp.com.br/pediatria-para-familias/seguranca-e-prevencao/seguranca-dos-brinquedos/

Estas fontes fundam o modelo. Cada conteúdo específico ainda precisará de referências adequadas ao tema e revisão profissional.

