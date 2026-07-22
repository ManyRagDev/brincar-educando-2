# Plano Mestre da Nova UX — Brincar Educando

> Documento executivo e fonte de verdade para a evolução da experiência autenticada do Brincar Educando. Este plano traduz os princípios de produto em arquitetura de informação, fluxos, linguagem, sistema visual, fases técnicas, critérios de aceite e estratégia de implantação segura.

**Status:** aprovado para planejamento e implementação incremental  
**Branch de trabalho:** `novaux`  
**Data de criação:** 22 de julho de 2026  
**Escopo prioritário:** experiência autenticada, mobile-first  
**Documento relacionado:** `docs/DOCUMENTO_MESTRE.md`  
**Princípio visual:** riqueza silenciosa  
**Princípio de produto:** vínculo antes de desempenho  

**Estado desta implementação:** as fases técnicas 0–6 estão implementadas localmente nesta branch, incluindo retomada de sessão, orientação de áreas, estados de navegação e riqueza silenciosa inicial. A fase 7 foi iniciada com a área de orientação existente, mas ainda requer fechamento editorial. A fase 8 — validação com cuidadores, acessibilidade e performance em uso real — permanece como última etapa antes do merge.

---

## 1. Resumo executivo

O Brincar Educando já possui conteúdo forte, responsável e diferenciado, além de fluxos funcionais para recomendar brincadeiras, executar atividades, guardar memórias e devolver uma síntese descritiva da jornada familiar. O problema prioritário não é ausência de funcionalidade: é a dificuldade de uma pessoa nova formar um modelo mental claro do produto.

Hoje, termos como **Atividades**, **Diário**, **Jornada**, **Crescimento**, **Histórias** e referências a desenvolvimento podem gerar perguntas que a interface ainda não responde imediatamente:

- Por onde começo?
- O que é para fazer agora?
- O que é apenas para consultar?
- Em qual área eu cadastro alguma coisa?
- Jornada e Diário são a mesma coisa?
- A Jornada avalia a criança?
- Uma brincadeira precisa ser concluída?
- Registrar é obrigatório?
- O que o sistema faz com aquilo que registro?

A nova UX deverá responder essas perguntas pela própria organização da experiência, sem depender de um tutorial longo. O produto será organizado ao redor das intenções reais da família:

1. **Fazer algo agora.**
2. **Encontrar outras ideias.**
3. **Guardar algo vivido.**
4. **Compreender o repertório e a fase sem avaliar a criança.**

A evolução será realizada sem reescrever o backend e sem romper rotas ou contratos de dados nas primeiras fases. A estratégia será incremental, reversível, validada em preview e apoiada por componentes novos construídos ao lado dos atuais.

---

## 2. Resultado esperado

Ao entrar pela primeira vez, uma pessoa deve compreender em poucos segundos:

> “Aqui eu encontro uma brincadeira possível para fazermos juntos agora. Posso explorar outras ideias, guardar lembranças se quiser e consultar uma visão cuidadosa do que temos vivido. Nada disso avalia a criança.”

Ao voltar ao produto, a pessoa deve conseguir:

- reconhecer a ação principal sem reler explicações;
- receber uma sugestão adequada ao momento;
- trocar, adaptar, iniciar, pausar ou encerrar sem culpa;
- guardar uma memória de forma opcional;
- distinguir claramente registro de consulta;
- localizar rapidamente aquilo que viveu;
- entender por que uma sugestão foi apresentada;
- navegar sem surpresas, atrasos sem feedback ou becos sem saída;
- usar o produto com uma mão, em uma tela pequena e em uma situação real de cuidado;
- ignorar totalmente a decoração quando estiver com pressa.

---

## 3. Os três critérios viscerais

Qualquer proposta visual ou estrutural só será aprovada se as três respostas abaixo forem um **sim efetivo**:

1. **A ação principal continua evidente?**
2. **A página parece mais acolhedora, autoral e viva?**
3. **É possível ignorar completamente a decoração quando a família está com pressa?**

Esses critérios não são preferências estéticas. São testes obrigatórios de aceite.

---

## 4. Princípios sagrados da experiência

### 4.1 Clareza antes de encantamento

A interface pode ser afetiva, memorável e bonita, mas primeiro precisa ser compreensível. Nenhuma ornamentação pode competir com a ação principal, prejudicar leitura ou esconder estrutura.

### 4.2 Uma intenção principal por contexto

Cada tela deve possuir uma ação ou objetivo dominante. Ações secundárias podem existir, mas não devem ter o mesmo peso visual.

### 4.3 Linguagem da família, não linguagem do sistema

Rótulos devem expressar o resultado para a pessoa. Termos internos, pedagógicos ou abstratos precisam de tradução contextual.

### 4.4 Convite, nunca obrigação

O produto deve tornar visível que é possível:

- trocar uma sugestão;
- adaptar materiais e passos;
- interromper uma atividade;
- não registrar nada;
- registrar apenas uma pequena lembrança;
- voltar outro dia;
- ignorar uma recomendação.

### 4.5 Criança não é métrica

Não haverá:

- nota;
- porcentagem de desenvolvimento;
- barra de progresso infantil;
- ranking;
- comparação;
- sequência de dias;
- diagnóstico;
- “meta atrasada”;
- promessa de ganho cognitivo;
- conclusão baseada em um único registro.

### 4.6 Valor antes de cadastro

O produto deve pedir apenas as informações mínimas necessárias antes de entregar valor. Preferências adicionais são progressivas e opcionais.

### 4.7 Educação contextual

A dúvida deve ser respondida onde nasce. Explicações curtas e acionáveis têm preferência sobre manuais, tours extensos ou modais obrigatórios.

### 4.8 Retorno imediato

Todo toque deve produzir resposta perceptível. Navegação, salvamento, troca de sugestão, upload, exclusão e conclusão precisam de estados claros.

### 4.9 Respeito ao cansaço

A experiência deve funcionar para uma pessoa com pouco tempo, baixa energia, atenção dividida ou uma criança no colo.

### 4.10 Privacidade compreensível

Privacidade não pode aparecer apenas em documentos legais. A interface deve explicar, perto da ação, o que é privado, o que é opcional e como excluir ou exportar.

### 4.11 Acessibilidade desde a composição

Acessibilidade não será uma revisão final. Contraste, ordem semântica, foco, tamanho de toque, redução de movimento e alternativas de conteúdo devem existir desde o primeiro componente.

### 4.12 Consistência supera novidade

O mesmo tipo de ação deve parecer, se comportar e ser nomeado de modo consistente em todo o produto.

---

## 5. O que a experiência não pode ter

- Funcionalidades diferentes com aparência e prioridade idênticas.
- Termos abstratos sem uma frase explicativa.
- Mais de uma ação primária competindo na mesma seção.
- Conteúdo essencial escondido em rolagem horizontal discreta.
- Tutoriais obrigatórios antes da primeira entrega de valor.
- Formulários extensos para registrar uma lembrança simples.
- Decoração atrás de textos ou controles.
- Cor sem função de hierarquia.
- Animação contínua sem propósito.
- Confetes, partículas, brilhos recorrentes ou elementos saltando.
- Fotografias genéricas de famílias usadas apenas como preenchimento.
- Mistura de estilos de ilustração.
- Estados vazios que apenas informam ausência de dados.
- Salvamentos silenciosos.
- Ações destrutivas sem confirmação e possibilidade de recuperação quando aplicável.
- Tom clínico, escolar ou avaliativo.
- Mensagens que produzam culpa por não brincar, não registrar ou não manter frequência.
- Inferências sobre humor, inteligência, capacidade ou diagnóstico.
- Mudanças de rota sem compatibilidade com links existentes.
- Dependência do modo Acolher para corrigir excesso do modo padrão.

---

## 6. Diagnóstico da arquitetura atual

### 6.1 Navegação mobile atual

A barra inferior expõe cinco destinos:

1. Início.
2. Atividades.
3. Diário.
4. Histórias.
5. Jornada.

Problemas percebidos:

- “Atividades” descreve uma entidade, não a intenção “quero brincar”.
- “Diário” não revela imediatamente que é onde se cadastram memórias.
- “Jornada” não revela que é uma síntese automática para consulta.
- “Histórias” ocupa um destino principal mesmo estando temporariamente em preparação.
- Perfil, configurações, orientações e modo Acolher dependem de outros caminhos.
- Todos os destinos recebem peso semelhante, apesar de possuírem frequências e papéis diferentes.

### 6.2 Navegação desktop atual

A barra lateral acrescenta Meu Perfil e Configurações, além do seletor de criança e do modo Acolher. Ela é funcional, mas apresenta módulos como uma lista plana. Falta agrupamento semântico entre ação, memória, consulta e conta.

### 6.3 Dashboard atual

O dashboard contém:

- saudação, data e criança ativa;
- check-in opcional do momento;
- instrução de primeira visita;
- recomendação principal e alternativas;
- dica da fase com fonte externa;
- quatro atalhos rápidos;
- chamada destacada para registrar memória;
- três artigos do blog.

O conteúdo é valioso, mas várias seções disputam espaço e atenção. A ação “brincar agora” pode ficar abaixo da primeira dobra no mobile. A presença simultânea de recomendação, atalho, dica, memória e blog dilui a função central do dashboard.

### 6.4 Atividades atuais

O módulo cobre três estados distintos:

- catálogo e filtros em `/atividades`;
- detalhe editorial em `/atividades/[slug]`;
- modo de execução em `/atividade-ativa/[slug]`.

Essa separação é boa e deve ser preservada. A UX precisa deixar claro que:

- explorar não registra nada;
- abrir o detalhe não inicia uma atividade;
- “Preparar para brincar” abre um modo orientado;
- o cronômetro é opcional;
- encerrar cedo é válido;
- a reflexão posterior é opcional;
- guardar a experiência alimenta Diário e Jornada, mas não avalia a criança.

### 6.5 Diário atual

O Diário é a fonte visível de registros familiares. Ele reúne entradas manuais, atividades e leituras em uma linha do tempo. Também oferece atalhos para tipos de memória e exportação.

Sua função correta é:

> **Lugar de guardar e rever momentos. A pessoa pode cadastrar, editar, excluir e exportar.**

### 6.6 Jornada atual

A Jornada consolida experiências, categorias, sinais observados, memórias recentes e próximos convites. Ela não é um formulário e não deveria parecer uma tarefa a preencher.

Sua função correta é:

> **Retrato automático e descritivo do repertório vivido, construído a partir dos registros. É consulta, não avaliação.**

### 6.7 Crescimento e desenvolvimento

Atualmente `/crescimento` redireciona para `/jornada`. Isso pode reforçar a interpretação de que Jornada mede desenvolvimento. A nova UX deverá separar cuidadosamente:

- **Jornada:** síntese do que foi vivido e registrado.
- **Entender a fase:** conteúdo editorial de consulta sobre desenvolvimento, variabilidade e formas de apoiar.
- **Marcos:** referências populacionais e orientativas, nunca checklist ou mecanismo de cadastro de desempenho.

Nenhum painel de “marcos concluídos” será criado.

### 6.8 BrinContos

A rota `/historias` está temporariamente substituída por uma página “Em preparação”. A biblioteca foi preservada atrás de uma chave interna. Durante a nova UX:

- BrinContos não deve ocupar uma ação principal do dashboard;
- o destino pode permanecer acessível em “Mais” com selo “em breve”;
- nenhuma nova lógica de histórias faz parte deste plano;
- rotas e código existentes permanecem preservados.

### 6.9 Feedback de navegação

Já existe feedback global imediato ao tocar em links do dashboard e uma tela de carregamento da área autenticada. Essa base deve ser preservada e refinada, não recriada.

### 6.10 Aviso de escopo educacional

O aviso pode ser recolhido manualmente ou automaticamente e sua preferência é persistida no dispositivo. A nova UX deve manter o aviso disponível sem ocupar permanentemente o primeiro plano.

---

## 7. Modelo mental definitivo

### 7.1 Quatro territórios

| Intenção da família | Território | Natureza | A pessoa cadastra? |
| --- | --- | --- | --- |
| “Quero fazer algo agora.” | Hoje | ação guiada | apenas se quiser guardar depois |
| “Quero procurar outra ideia.” | Brincadeiras | exploração e ação | não durante a busca |
| “Quero guardar ou rever algo.” | Memórias | registro e linha do tempo | sim, opcionalmente |
| “Quero perceber o que temos vivido.” | Nossa Jornada | síntese automática | não diretamente |

### 7.2 Território complementar de consulta

**Entender esta fase** reunirá orientações editoriais sobre desenvolvimento e formas de apoiar a criança. Esse território é consulta, não cadastro. Sua implementação depende de uma especificação editorial própria e não será confundida com Jornada.

### 7.3 Contrato conceitual entre Memórias e Jornada

**Memórias** é onde a família age sobre registros.  
**Jornada** é onde o sistema devolve uma leitura prudente desses registros.

Fluxo:

```text
Brincadeira vivida ou memória espontânea
                    ↓
          Registro opcional
                    ↓
        Linha do tempo em Memórias
                    ↓
 Síntese prudente em Nossa Jornada, quando há dados suficientes
```

A Jornada nunca solicitará “complete este marco” ou “adicione progresso”. Quando precisar de mais dados, dirá apenas que ainda há poucos momentos registrados para formar uma pista consistente.

---

## 8. Arquitetura de informação proposta

### 8.1 Navegação mobile

Proposta de cinco destinos:

1. **Hoje** — recomendação e próximo passo.
2. **Brincar** — catálogo de brincadeiras.
3. **Memórias** — cadastro e linha do tempo.
4. **Jornada** — síntese automática e consulta.
5. **Mais** — BrinContos, Entender a fase, Orientações, Perfil, Configurações e modo Acolher.

Justificativas:

- “Hoje” comunica uso recorrente.
- “Brincar” é verbo e intenção, mais claro que “Atividades”.
- “Memórias” comunica valor humano melhor que “Diário”, mantendo “Diário” como subtítulo ou identidade interna se desejado.
- “Jornada” permanece como nome de produto, mas sempre acompanhada de descrição.
- “Mais” evita colocar recursos menos frequentes no mesmo nível da ação principal.

As rotas atuais serão preservadas. A mudança inicial é de rótulo e agrupamento, não de URL.

### 8.2 Navegação desktop

Agrupamento recomendado:

**Para agora**

- Hoje.
- Brincar.

**O que vivemos**

- Memórias.
- Nossa Jornada.

**Descobrir**

- Entender esta fase.
- BrinContos — em breve.
- Orientações.

**Sua conta**

- Perfil da família.
- Configurações.
- Modo Acolher.
- Sair.

### 8.3 Rotas e compatibilidade

| Rota existente | Papel na nova UX | Decisão |
| --- | --- | --- |
| `/dashboard` | Hoje | preservar |
| `/atividades` | Brincar / explorar | preservar |
| `/atividades/[slug]` | conhecer o convite | preservar |
| `/atividade-ativa/[slug]` | brincar em modo guiado | preservar |
| `/diario` | Memórias / linha do tempo | preservar |
| `/diario/nova` | guardar um momento | preservar |
| `/jornada` | Nossa Jornada / síntese | preservar |
| `/crescimento` | alias legado | manter redirecionamento até definir “Entender a fase” |
| `/historias` | BrinContos em preparação | preservar |
| `/historias/[id]/ler` | leitor preservado e não promovido | preservar |
| `/orientacoes` | buscar apoio e orientações | preservar |
| `/perfil` | família e crianças | preservar |
| `/configuracoes` | preferências | preservar |

---

## 9. Dashboard alvo — especificação mobile-first

### 9.1 Objetivo único

O dashboard deve responder:

> “O que podemos viver juntos agora?”

### 9.2 Ordem das seções

1. Cabeçalho compacto e criança ativa.
2. Orientação de primeira visita, somente quando necessária.
3. Contexto do momento.
4. Recomendação principal.
5. Duas alternativas úteis.
6. Retomar experiência interrompida, quando existir.
7. Última memória ou convite para guardar algo, sem destaque excessivo.
8. Acessos de consulta.
9. Conteúdo editorial, abaixo do núcleo de produto ou removido do dashboard recorrente.

### 9.3 Cabeçalho

Deve conter:

- saudação curta;
- nome da criança ativa;
- idade em linguagem humana;
- controle de troca de criança;
- acesso ao perfil com rótulo acessível.

A data pode permanecer com baixo peso. Emoji de saudação é opcional e não deve ser o elemento focal.

### 9.4 Primeira visita

Na primeira visita após criar a criança, apresentar uma orientação curta:

**Título:** “Vamos encontrar algo possível para agora.”  
**Explicação:** “Você pode escolher o momento, adaptar qualquer convite e guardar apenas o que quiser lembrar.”

Três ideias, sem aparência de tarefa:

1. Escolha uma pista do momento.
2. Veja um convite e adapte livremente.
3. Depois, registrar é opcional.

Requisitos:

- dispensável;
- persistência da dispensa no dispositivo;
- disponível novamente em “Como funciona”; 
- não bloquear a recomendação;
- não exigir sequência guiada.

### 9.5 Contexto do momento

O componente aprovado usa grade 2 × 3 no mobile e 3 colunas em telas maiores.

Opções:

- Só temos 5 minutos.
- Gastar energia.
- Desacelerar.
- Sem materiais.
- Ir lá fora.
- Adulto cansado.

Cada opção possui:

- ícone;
- título curto;
- explicação visível;
- área inteira tocável;
- estado selecionado com borda, cor e check;
- foco visível;
- retorno imediato.

Evolução recomendada:

- na primeira interação, mostrar a grade completa;
- depois da escolha, permitir que ela se reduza a um resumo compacto com ação “Mudar”; 
- nunca selecionar mais de uma prioridade na primeira versão;
- não persistir a escolha como característica da criança;
- tratar a escolha apenas como contexto daquela navegação.

### 9.6 Recomendação principal

Deve responder visualmente:

- O que é?
- Por que combina?
- Quanto tempo exige?
- Há preparo ou materiais?
- Qual energia pede da criança e do adulto?
- O que acontece ao tocar?

A ação primária será **“Ver como brincar”** ou **“Brincar agora”**, após teste de compreensão. O card deve evitar excesso de pills; informações operacionais podem ser agrupadas em até três sinais essenciais.

### 9.7 Alternativas

Manter duas alternativas com papéis estáveis:

- **Mais simples.**
- **Outro clima.**

Não exibir uma grade extensa no dashboard. O catálogo completo pertence a Brincar.

### 9.8 Troca e feedback

“Trocar sugestão” permanece secundário. O motivo é opcional e só aparece depois da ação. “Mais como esta” e “Menos como esta” devem explicar que ajustam sugestões futuras, não classificam a criança.

### 9.9 Memória no dashboard

O CTA atual de registro não deve competir visualmente com a recomendação. Nova forma:

- após uma atividade, oferecer registro no fluxo natural;
- fora desse fluxo, mostrar um bloco discreto “Algo para guardar de hoje?”;
- usar uma ação secundária “Guardar um momento”; 
- evitar pressão de frequência.

### 9.10 Dica da fase

Manter o valor editorial, mas reduzir o peso no dashboard. Possibilidades:

- uma linha curta com “Entender esta fase”; 
- conteúdo expandível;
- encaminhamento para uma página de consulta;
- fonte disponível sem interromper o fluxo principal.

### 9.11 Blog no dashboard

O blog não pertence ao núcleo da ação “agora”. A seção deve:

- ficar abaixo das funções principais;
- aparecer como um único destaque, não três cards concorrentes; ou
- ser removida do dashboard recorrente e acessada pela área pública/“Mais”.

A decisão final será validada com cuidadores.

---

## 10. Especificação das demais experiências

### 10.1 Brincar — catálogo

**Objetivo:** encontrar outra brincadeira quando a recomendação principal não basta.

Deve conter:

- título orientado à intenção: “Encontre uma brincadeira”; 
- explicação de que abrir um card não registra nem inicia automaticamente;
- busca simples;
- filtros progressivos;
- indicação da fase da criança ativa;
- resultado total ou feedback de filtros;
- ação para limpar filtros;
- estado vazio com alternativas práticas;
- cards com duração, preparo e energia essenciais;
- retorno claro ao dashboard.

Filtros avançados não devem ocupar a primeira dobra. Sugestões rápidas podem existir, desde que não usem rolagem horizontal essencial.

### 10.2 Detalhe da brincadeira

**Objetivo:** decidir se a proposta é viável e preparar o adulto.

Ordem recomendada:

1. Título e resumo.
2. Tempo, preparo, local e energia.
3. Por que combina com a fase.
4. Materiais e substituições.
5. Segurança essencial.
6. Ação “Preparar para brincar”.
7. Conteúdo detalhado progressivamente revelado.
8. Adaptações, variações, fontes e revisão.

O conteúdo científico permanece disponível, mas não deve impedir a tomada de decisão rápida. Seções longas podem usar disclosure acessível, mantendo segurança visível.

### 10.3 Modo de brincar

**Objetivo:** apoiar sem prender a atenção do adulto na tela.

Requisitos:

- fonte grande e alto contraste;
- um passo por vez por padrão;
- opção “ver todos”; 
- cronômetro desligado por padrão;
- controles grandes para avançar, voltar, pausar e encerrar;
- frases de interação opcionais;
- orientação de adaptação acessível durante a experiência;
- botão de encerramento sempre encontrável;
- proteção contra perda acidental de sessão;
- funcionamento coerente com `prefers-reduced-motion`;
- mínima ornamentação durante a brincadeira.

### 10.4 Reflexão posterior

**Objetivo:** guardar uma impressão, não avaliar desempenho.

Requisitos:

- “Agora não” tão legítimo quanto salvar;
- nenhum campo obrigatório além do necessário tecnicamente;
- linguagem sobre clima e interesse, não sucesso e fracasso;
- explicação curta de onde o registro aparecerá;
- confirmação de salvamento;
- caminhos “Voltar para Hoje” e “Ver em Memórias”; 
- foco contido no diálogo e retorno de foco ao fechar;
- prevenção de submissão duplicada.

### 10.5 Memórias

**Objetivo:** guardar e rever momentos escolhidos pela família.

Cabeçalho deve explicar:

> “Aqui ficam as lembranças que você escolheu guardar e os momentos registrados depois das brincadeiras.”

Ações:

- guardar uma fala;
- guardar uma descoberta;
- guardar algo engraçado;
- guardar um desafio;
- adicionar uma foto privada;
- escrever livremente;
- editar;
- excluir;
- exportar.

Os atalhos de registro podem ser compactados após uso recorrente. A linha do tempo deve diferenciar visualmente memória, brincadeira e, no futuro, BrinConto, sem transformar cada tipo em um universo gráfico independente.

### 10.6 Nossa Jornada

**Objetivo:** devolver uma síntese prudente do repertório vivido.

Cabeçalho obrigatório:

> “Uma visão automática do que vocês registraram. Não é nota, avaliação ou diagnóstico.”

Subseções:

- experiências vividas;
- variedade de propostas;
- o que parece ter encantado recentemente;
- sinais que o adulto escolheu registrar;
- momentos recentes;
- próximos convites.

Regras:

- não usar gráficos de progresso infantil;
- não usar vermelho/verde como inadequado/adequado;
- não indicar “faltas”; 
- apresentar tamanho da base que sustenta uma pista;
- usar linguagem probabilística;
- oferecer acesso à origem dos dados;
- explicar como registrar e como excluir;
- manter Journey somente leitura, exceto por navegações para Memórias ou Brincar.

### 10.7 Entender esta fase

**Objetivo:** consultar orientações de desenvolvimento sem cadastrar conquistas.

Conteúdo futuro:

- visão geral da faixa;
- possibilidades de interação;
- linguagem, movimento, exploração, vínculo e brincadeira;
- variabilidade esperada;
- sinais que justificam procurar orientação profissional;
- fontes verificadas;
- diferença entre observação, marco populacional e diagnóstico.

Essa área não terá checkboxes de marcos, status “concluído” ou linha de progresso.

### 10.8 BrinContos

Durante esta fase, `/historias` permanece como página afetiva “Em preparação”. O trabalho de UX pode definir apenas seu lugar futuro na arquitetura, sem implementar histórias.

### 10.9 Mais

No mobile, “Mais” deve funcionar como página organizada, não gaveta caótica. Grupos:

- Descobrir: Entender esta fase, BrinContos, Orientações.
- Família: crianças e perfil.
- Preferências: modo Acolher e configurações.
- Segurança e dados: privacidade, exportação e suporte.
- Conta: sair.

---

## 11. Sistema visual — riqueza silenciosa

### 11.1 Definição

Riqueza silenciosa é uma linguagem visual com personalidade suficiente para ser memorável, mas discreta o bastante para desaparecer durante a ação.

### 11.2 Distribuição visual

Referência inicial:

- 70% superfícies neutras e espaço de respiração;
- 25% cores suaves de apoio;
- 5% cor de destaque funcional.

Não é uma fórmula matemática rígida, mas um limite contra saturação.

### 11.3 Uma cena decorativa por viewport

Cada tela pode ter um foco de ambientação. Os demais elementos permanecem funcionais e limpos.

Exemplos adequados:

- forma orgânica ampla entrando pela borda;
- ilustração de natureza com baixa opacidade;
- textura suave de papel em uma área sem texto;
- pequeno detalhe desenhado próximo ao título;
- fundo discreto da recomendação principal.

### 11.4 Famílias visuais

**Natureza**

- folhas;
- sementes;
- sol;
- nuvens;
- caminhos;
- formas de terra e água.

**Imaginação**

- rabiscos;
- recortes de papel;
- pequenas estrelas;
- linhas que se transformam;
- formas imperfeitas.

**Vínculo**

- mãos;
- objetos compartilhados;
- livros;
- figuras próximas;
- gestos de troca.

### 11.5 Regras para backgrounds

- Nunca atrás de texto corrido.
- Nunca reduzir contraste do conteúdo.
- Preferir bordas e espaços vazios.
- Opacidade padrão inicial entre 4% e 10%, validada caso a caso.
- Elementos grandes e poucos têm preferência sobre muitos elementos pequenos.
- Evitar repetição em padrão quando ela criar vibração visual.
- Imagem decorativa deve ter texto alternativo vazio.
- Não carregar imagens pesadas acima da dobra sem otimização.
- Usar `next/image` quando o recurso for conteúdo; usar background/pseudo-elemento apenas quando for estritamente decorativo.

### 11.6 Imagens de conteúdo

Imagens de brincadeiras devem ajudar a compreender a proposta, não apenas ornamentar. Critérios:

- contexto realista e seguro;
- diversidade de famílias e ambientes;
- ausência de exposição indevida de crianças;
- materiais coerentes com a atividade;
- composição calma;
- licença e origem documentadas;
- corte responsivo;
- alternativa textual quando informativa.

### 11.7 Movimento

Permitido:

- resposta curta a toque;
- transição de expansão e recolhimento;
- progresso de navegação;
- entrada sutil de conteúdo contextual;
- feedback de salvamento.

Não permitido:

- loops decorativos constantes;
- parallax;
- elementos flutuando continuamente;
- animações que atrasem a ação;
- movimento essencial sem alternativa.

Todo movimento deve respeitar `prefers-reduced-motion`.

### 11.8 Modo padrão e modo Acolher

O modo padrão já deve ser confortável. O modo Acolher reduz uma experiência equilibrada; não corrige uma experiência excessiva.

| Elemento | Padrão | Acolher |
| --- | --- | --- |
| Ilustração de fundo | suave | ocultar ou reduzir fortemente |
| Saturação | moderada | baixa |
| Sombras | leves | mínimas |
| Movimento | curto e funcional | removido ou quase instantâneo |
| Textura | discreta | mínima |
| Hover/elevação | sutil | menor ou inexistente |
| Densidade | confortável | mais espaçada quando necessário |

O controle pode evoluir de “Modo Acolher” para uma linguagem mais direta, como “Reduzir estímulos”, mantendo a identidade Acolher como explicação secundária. Evitar afirmações universais como “ideal para neurodivergentes”.

### 11.9 Tokens a criar

Criar tokens semânticos, evitando valores soltos por página:

- `--decorative-opacity`;
- `--decorative-opacity-subtle`;
- `--surface-soft`;
- `--surface-emphasis`;
- `--shadow-soft`;
- `--shadow-focus`;
- `--motion-fast`;
- `--motion-gentle`;
- `--content-max-reading`;
- `--content-max-dashboard`;
- `--touch-target-min`.

No modo Acolher, esses tokens devem ser redefinidos centralmente.

---

## 12. Conteúdo e microcopy

### 12.1 Estrutura padrão de uma área

Toda página principal deve responder logo no início:

1. Onde estou?
2. Para que serve?
3. Preciso fazer alguma coisa?
4. Qual é o próximo passo mais provável?

### 12.2 Verbos preferidos

- Brincar.
- Explorar.
- Adaptar.
- Guardar.
- Relembrar.
- Observar.
- Perceber.
- Escolher.
- Pausar.
- Encerrar.
- Buscar apoio.

### 12.3 Verbos e expressões a evitar

- Avaliar.
- Medir a criança.
- Completar desenvolvimento.
- Atingir marco.
- Melhorar inteligência.
- Corrigir atraso.
- Falhar.
- Cumprir meta.
- Manter sequência.
- Desempenho esperado.

### 12.4 Padrão de linguagem para ações opcionais

Não depender apenas da palavra “opcional”. Demonstrar a opção:

- “Guarde se quiser lembrar.”
- “Você pode deixar em branco.”
- “Encerrar cedo também é válido.”
- “Preferências mudam e não definem a criança.”
- “Uma pequena observação já basta — ou nenhuma.”

### 12.5 Glossário contextual

**Brincadeira/convite:** proposta que pode ser adaptada, não atividade obrigatória.  
**Memória:** registro escolhido pela família.  
**Jornada:** síntese automática do repertório registrado.  
**Pista:** padrão prudente e temporário, não conclusão.  
**Fase:** referência ampla baseada em idade e variabilidade.  
**Marco:** referência populacional de desenvolvimento, não meta individual.

---

## 13. Estados obrigatórios

Cada tela ou componente de dados deve projetar explicitamente:

### 13.1 Carregamento

- indicar que a ação foi reconhecida;
- preservar contexto visual;
- evitar telas vazias;
- não bloquear navegação por tempo indefinido;
- oferecer recuperação após timeout.

### 13.2 Vazio inicial

Explicar:

- por que está vazio;
- o que aparecerá ali;
- se é necessário fazer algo;
- qual ação simples pode iniciar o fluxo.

### 13.3 Vazio por filtro

- dizer que nenhum resultado combina com os filtros;
- oferecer limpar ou flexibilizar;
- nunca sugerir ausência de conteúdo adequado como problema da criança.

### 13.4 Erro recuperável

- linguagem humana;
- tentativa novamente;
- alternativa segura;
- preservação dos dados digitados quando possível.

### 13.5 Sucesso

- confirmação específica;
- indicar onde o conteúdo foi guardado;
- oferecer próximo passo;
- impedir submissão duplicada.

### 13.6 Uma criança

- seleção automática;
- nome visível nos contextos importantes;
- troca disponível apenas quando necessária.

### 13.7 Várias crianças

- escolha explícita;
- dados e recomendações claramente separados;
- evitar realizar ações sem criança ativa.

### 13.8 Sem criança cadastrada

- explicar o valor do perfil;
- pedir apenas o mínimo;
- oferecer caminho direto de criação;
- não expor telas quebradas ou vazias.

### 13.9 Offline ou conexão instável

- não prometer salvamento antes da confirmação;
- preservar rascunho local quando seguro;
- explicar o que exige conexão;
- não duplicar registros ao tentar novamente.

---

## 14. Acessibilidade e carga cognitiva

### 14.1 Padrão mínimo

Adotar WCAG 2.2 AA como referência.

### 14.2 Requisitos

- alvo de toque mínimo de 44 × 44 px; preferir 48 px em ações principais;
- foco visível em todos os controles;
- ordem de foco coerente com a leitura;
- HTML semântico antes de ARIA;
- títulos hierárquicos;
- labels permanentes em campos importantes;
- mensagens de erro associadas ao campo;
- estados anunciados em regiões `aria-live` quando necessário;
- diálogos com foco contido e restaurado;
- contraste suficiente em ambos os temas;
- ícone nunca como único portador de significado;
- suporte a zoom de 200%;
- conteúdo funcional em 320 px de largura;
- sem rolagem horizontal da página;
- respeito à preferência de redução de movimento.

### 14.3 Carga cognitiva

- máximo de uma ação primária por seção;
- no máximo três informações operacionais no resumo de um card;
- detalhes extensos sob demanda;
- instruções em frases curtas;
- agrupamentos previsíveis;
- evitar alternância frequente de cores e layouts;
- não exigir memória do que apareceu em outra tela.

---

## 15. Instrumentação ética e critérios de sucesso

### 15.1 O que medir

Somente após definir consentimento e governança de analytics:

- conclusão da primeira recomendação;
- tempo até abrir um convite;
- troca de sugestão;
- início e encerramento de atividade;
- abandono por tela, sem interpretar motivo clínico;
- abertura de ajuda contextual;
- criação de memória;
- localização de registro no Diário;
- compreensão declarada em testes;
- erros de navegação e submissão.

### 15.2 O que não medir ou inferir

- inteligência;
- humor da criança;
- diagnóstico;
- desenvolvimento individual;
- personalidade;
- qualidade parental;
- comparação entre famílias;
- conteúdo livre de memórias para segmentação;
- fotos para classificação automática.

### 15.3 Indicadores de usabilidade

- 80% ou mais concluem tarefas essenciais sem ajuda direta;
- 90% identificam a ação principal do dashboard em até 10 segundos;
- 90% distinguem Memórias de Jornada após exploração curta;
- ninguém interpreta Jornada como nota ou diagnóstico;
- 80% encontram como adaptar ou encerrar uma brincadeira;
- 80% entendem que registro é opcional;
- redução de toques repetidos em navegação;
- ausência de regressão nos fluxos atuais.

Indicadores numéricos serão complementados por relato qualitativo. Não substituirão observação real.

---

## 16. Estratégia técnica para não quebrar o que funciona

### 16.1 Princípio de preservação

Nas primeiras fases, mudar apresentação e composição sem alterar contratos de negócio.

Preservar:

- rotas;
- parâmetros de recomendação;
- server actions;
- tabelas e políticas RLS;
- motor de recomendação;
- isolamento por criança;
- formatos de registros;
- exportação;
- sessão ativa de brincadeira;
- feedback de navegação;
- modo Acolher;
- aviso de escopo educacional.

### 16.2 Branch e preview

- Todo trabalho estrutural ocorre na `novaux`.
- A `main` permanece estável.
- Cada marco utilizável gera preview separado.
- Merge só ocorre depois de revisão funcional e visual.
- Não fazer deploy de produção automaticamente durante exploração.

### 16.3 Construção paralela

Quando uma seção for significativamente redesenhada:

- criar componente novo ao lado do atual;
- manter o componente anterior até aceite;
- usar composição ou chave interna temporária;
- remover legado somente em commit próprio e depois de aprovação.

### 16.4 Feature flags

Usar flags somente quando permitirem comparação ou rollback real. Evitar flags permanentes.

Possíveis flags temporárias:

- `dashboardUxV2`;
- `navigationUxV2`;
- `journeyExplanationV2`;
- `quietRichnessDecorations`.

As flags não podem bifurcar regras de negócio nem criar dois formatos de dados.

### 16.5 Banco de dados

Fases 1 a 6 deste plano devem ser executáveis sem migração. Qualquer necessidade de banco:

1. deve ser justificada separadamente;
2. precisa de migração reversível;
3. não pode apagar colunas ou dados na mesma entrega;
4. exige atualização de tipos e documentação;
5. exige teste de RLS e propriedade.

### 16.6 Compatibilidade de rotas

- Manter URLs atuais.
- Quando houver novo nome visível, a rota pode continuar igual.
- Se uma rota mudar no futuro, manter redirecionamento permanente ou temporário conforme o caso.
- Preservar deep links de atividades.
- Não remover query params do recomendador.

### 16.7 Commits

Commits devem ser pequenos e orientados a uma mudança observável:

- fundação visual;
- navegação;
- dashboard;
- catálogo;
- fluxo de brincar;
- Memórias;
- Jornada;
- ajuda contextual;
- decoração;
- acessibilidade.

Não misturar migração de dados, conteúdo editorial amplo e redesenho visual no mesmo commit.

### 16.8 Rollback

Cada fase precisa possuir:

- commit identificável;
- ausência de exclusão prematura;
- caminho de desativação de flag, quando usada;
- instrução de reversão;
- confirmação de que dados criados pela versão nova continuam válidos na antiga.

---

## 17. Arquitetura de componentes proposta

Nomes são orientativos e devem respeitar a estrutura existente.

### 17.1 Fundação

- `components/experience/SectionIntroduction.tsx`
- `components/experience/ContextualHelp.tsx`
- `components/experience/EmptyState.tsx`
- `components/experience/FeedbackState.tsx`
- `components/experience/DecorativeBackdrop.tsx`
- `components/experience/FirstVisitGuide.tsx`
- `components/experience/PurposeBadge.tsx`

### 17.2 Dashboard

- `components/dashboard/DashboardGreeting.tsx`
- `components/dashboard/DashboardFirstVisit.tsx`
- `components/dashboard/MomentContextSelector.tsx`
- `components/dashboard/MomentContextSummary.tsx`
- `components/dashboard/TodayRecommendation.tsx`
- `components/dashboard/TodayAlternatives.tsx`
- `components/dashboard/ResumeActivity.tsx`
- `components/dashboard/MemoryPrompt.tsx`
- `components/dashboard/UnderstandThePhaseTeaser.tsx`

### 17.3 Navegação

- manter `BottomNav` e `DashboardSidebar` durante transição;
- extrair uma única configuração tipada de navegação;
- criar agrupamentos desktop sem duplicar labels;
- garantir estado ativo por rota;
- criar página `/mais` apenas se a arquitetura final exigir; até lá, pode ser painel ou sheet acessível.

### 17.4 Sistema visual

- tokens no `app/globals.css`;
- assets em diretório explícito, por exemplo `public/images/experience/`;
- inventário de licença/origem junto aos assets;
- variantes controladas pelo tema, não regras isoladas por página.

---

## 18. Plano de implementação por fases

### Fase 0 — Baseline e proteção

**Objetivo:** congelar entendimento do comportamento atual.

Entregas:

- documentar rotas e contratos;
- registrar screenshots de referência em viewports definidos;
- mapear eventos e ações críticas;
- adicionar testes ausentes de navegação e persistência;
- confirmar build, lint, tipos, UTF-8 e testes;
- manter `main` sem mudanças experimentais.

Aceite:

- fluxos críticos enumerados;
- baseline visual disponível;
- rollback compreendido;
- nenhum dado de produção usado em teste visual.

### Fase 1 — Linguagem e orientação

**Objetivo:** reduzir ambiguidade antes de mover grandes blocos.

Entregas:

- propósito de cada página no cabeçalho;
- distinção explícita entre Memórias e Jornada;
- revisão de labels da navegação;
- ajuda contextual;
- estados vazios educativos;
- explicação clara de registro opcional.

Aceite:

- uma pessoa consegue dizer o que faz em cada área;
- Jornada não parece formulário;
- nenhuma rota ou dado alterado.

### Fase 2 — Navegação mobile e desktop

**Objetivo:** refletir o novo modelo mental.

Entregas:

- mobile com Hoje, Brincar, Memórias, Jornada e Mais;
- desktop agrupado por intenção;
- BrinContos marcado como em preparação;
- perfil e configurações organizados em baixa frequência;
- acessibilidade e estados ativos.

Aceite:

- todos os destinos atuais continuam alcançáveis;
- nenhuma rota quebrada;
- tarefa principal exige igual ou menor número de toques;
- labels cabem em 320 px.

### Fase 3 — Dashboard núcleo

**Objetivo:** transformar o dashboard em um condutor do próximo passo.

Entregas:

- cabeçalho compacto;
- primeira visita dispensável;
- contexto do momento refinado;
- recomendação principal com hierarquia clara;
- alternativas compactas;
- registro de memória secundário;
- blog rebaixado ou removido do núcleo;
- dica da fase encaminhada para consulta.

Aceite:

- ação principal identificada em até 10 segundos;
- recomendação alcançável sem confusão;
- feedback imediato em toda navegação;
- estados sem criança, várias crianças, erro e vazio revisados.

### Fase 4 — Fluxo completo de brincadeira

**Objetivo:** reduzir uso de tela durante a interação familiar.

Entregas:

- detalhe reordenado;
- preparação clara;
- modo de brincar focado;
- adaptação e encerramento sempre disponíveis;
- reflexão opcional refinada;
- retomada de sessão.

Aceite:

- adulto consegue iniciar, adaptar e encerrar com uma mão;
- cronômetro permanece opcional;
- registro não é interpretado como avaliação;
- nenhuma duplicação de execução.

### Fase 5 — Memórias e Jornada

**Objetivo:** tornar inequívoco o contrato cadastro versus consulta.

Entregas:

- Diário apresentado como Memórias;
- linha do tempo mais legível;
- tipos de entrada progressivos;
- Jornada com explicação permanente;
- origem dos padrões visível;
- vazios cuidadosos;
- exportação e privacidade contextualizadas.

Aceite:

- 90% dos participantes distinguem as duas áreas;
- ninguém entende Jornada como nota;
- editar, excluir e exportar continuam funcionando.

### Fase 6 — Riqueza silenciosa

**Objetivo:** adicionar identidade visual sem aumentar carga cognitiva.

Entregas:

- tokens decorativos;
- uma família visual aprovada;
- fundo do dashboard;
- detalhes de seção;
- comportamento Acolher;
- otimização de assets;
- documentação de uso e antiuso.

Aceite:

- os três critérios viscerais recebem “sim”; 
- contraste AA preservado;
- sem regressão relevante de performance;
- decoração ignorável durante tarefas.

### Fase 7 — Entender esta fase

**Objetivo:** separar orientação de desenvolvimento da Jornada.

**Estado:** iniciada. A rota `/orientacoes` já funciona como consulta e não cadastro; a arquitetura editorial final, a revisão das fontes e a decisão sobre `/crescimento` continuam pendentes.

Entregas:

- arquitetura editorial;
- nomenclatura;
- página de consulta;
- fontes e revisão;
- orientação de busca de apoio;
- atualização do redirecionamento `/crescimento`, se aprovada.

Aceite:

- não há checklist individual;
- variabilidade aparece explicitamente;
- fontes são acessíveis;
- revisão profissional concluída.

### Fase 8 — Piloto e estabilização

**Objetivo:** validar a experiência integral antes do merge final.

**Estado:** reservada para a última etapa, após a implementação técnica. Não deve ser substituída por uma inspeção interna do código: precisa de cuidadores reais e uma matriz de achados.

Entregas:

- preview estável;
- sessões com 5 a 8 cuidadores;
- matriz de achados;
- correção de bloqueantes;
- revisão de acessibilidade;
- revisão de performance;
- plano de merge e produção.

Aceite:

- critérios de usabilidade atingidos;
- zero achado bloqueante aberto;
- rollback testado;
- documento mestre atualizado.

---

## 19. Matriz de testes

### 19.1 Viewports mínimos

- 320 × 568.
- 360 × 800.
- 390 × 844.
- 412 × 915.
- 768 × 1024.
- 1366 × 768.
- 1440 × 900.

### 19.2 Navegadores

- Chrome Android atual.
- Safari iOS atual.
- Chrome desktop atual.
- Safari desktop atual, quando disponível.
- Firefox desktop atual.
- Edge atual.

### 19.3 Cenários funcionais

1. Entrar sem criança cadastrada.
2. Criar primeira criança.
3. Entrar com uma criança.
4. Entrar com várias crianças e escolher uma.
5. Escolher contexto do momento.
6. Abrir recomendação.
7. Trocar sugestão.
8. Iniciar atividade.
9. Pausar e retomar.
10. Encerrar antes do fim.
11. Não registrar reflexão.
12. Registrar reflexão.
13. Encontrar registro em Memórias.
14. Criar memória livre.
15. Editar e excluir memória.
16. Consultar Jornada.
17. Exportar dados.
18. Recolher aviso educacional e navegar.
19. Ativar Acolher e recarregar.
20. Abrir BrinContos em preparação.

### 19.4 Estados de rede

- conexão normal;
- resposta lenta;
- falha de leitura;
- falha de gravação;
- clique repetido;
- retorno após background;
- sessão expirada.

### 19.5 Acessibilidade

- navegação somente por teclado;
- leitor de tela nos fluxos principais;
- zoom 200%;
- fonte ampliada do sistema;
- redução de movimento;
- alto contraste quando aplicável;
- foco após fechar diálogo;
- anúncio de erro e sucesso.

### 19.6 Temas

Cada cenário visual relevante deve ser testado nos modos Vibrante e Acolher. O modo Acolher não pode ocultar informação funcional.

---

## 20. Roteiro de teste com cuidadores

Não explicar previamente a arquitetura. Pedir que a pessoa pense em voz alta.

### Tarefas

1. “Você tem poucos minutos e quer uma ideia. O que faria?”
2. “Essa proposta não serve agora. Encontre outra.”
3. “Comece a brincadeira e depois encerre porque a criança perdeu o interesse.”
4. “Guarde uma frase que você gostaria de lembrar.”
5. “Encontre essa frase novamente.”
6. “Veja o que a Jornada diz sobre o que vocês têm vivido.”
7. “Explique com suas palavras a diferença entre Memórias e Jornada.”
8. “Descubra se o produto está avaliando o desenvolvimento da criança.”
9. “Reduza os estímulos visuais.”
10. “Encontre onde os BrinContos estarão no futuro.”

### Perguntas posteriores

- O que você acha que o produto faz?
- Em algum momento você se sentiu avaliado ou cobrado?
- Houve algum termo difícil?
- Você sabia o que aconteceria antes de tocar?
- O que parece obrigatório?
- O que parece opcional?
- Qual parte você usaria com mais frequência?
- O que você esperava encontrar e não encontrou?
- A página parece calma, vazia, viva ou carregada?
- O que chamou atenção sem precisar?

### Registro

Para cada achado:

- tarefa;
- comportamento observado;
- fala não identificável;
- severidade;
- hipótese;
- decisão;
- responsável;
- prazo;
- evidência de correção.

---

## 21. Critérios globais de pronto

Uma fase só está pronta quando:

- objetivo de usuário está explícito;
- ação principal é identificável;
- mobile 320 px funciona sem rolagem horizontal;
- ambos os temas foram revisados;
- teclado e foco funcionam;
- carregamento, vazio, erro e sucesso existem;
- textos não avaliam nem culpam;
- rotas antigas continuam válidas;
- lint passa;
- TypeScript passa;
- testes passam;
- validação UTF-8 passa;
- build de produção passa;
- diff não inclui alterações alheias;
- documentação afetada foi atualizada;
- preview foi revisado antes de merge;
- não há achado bloqueante aberto.

---

## 22. Riscos e mitigação

| Risco | Impacto | Mitigação |
| --- | --- | --- |
| Embelezar sem melhorar compreensão | alto | testar modelo mental antes da decoração |
| Dashboard continuar longo | alto | priorizar ação e rebaixar conteúdo editorial |
| Jornada continuar parecendo avaliação | alto | explicação permanente, linguagem e teste com cuidadores |
| Memórias e Jornada continuarem sobrepostas | alto | contrato cadastro versus síntese em todas as entradas |
| Navegação “Mais” esconder demais | médio | manter tarefas frequentes fora dela e testar encontrabilidade |
| Modo Vibrante ficar excessivo | alto | aplicar limites de riqueza silenciosa no padrão |
| Modo Acolher perder informação | alto | tema só altera apresentação, nunca conteúdo funcional |
| Assets prejudicarem performance | médio | formatos modernos, tamanhos responsivos e orçamento de peso |
| Refatoração quebrar recomendador | alto | preservar contratos e testar determinismo |
| Mudança visual quebrar fluxo mobile | alto | matriz de viewports e preview por fase |
| Features antigas ficarem inacessíveis | médio | inventário de rotas e teste de alcançabilidade |
| Flags virarem dívida permanente | médio | data de remoção e commit específico |
| Instrumentação invadir privacidade | alto | taxonomia mínima, sem conteúdo livre ou inferências |

---

## 23. Decisões já tomadas

1. A implementação ocorrerá na branch `novaux`.
2. A experiência será mobile-first.
3. O dashboard será orientado ao próximo passo, não à exposição de módulos.
4. Atividades continuam separadas em explorar, conhecer e brincar.
5. Memórias é o território de cadastro e linha do tempo.
6. Jornada é síntese automática para consulta.
7. Jornada não terá cadastro de marcos.
8. Desenvolvimento será conteúdo de consulta, separado de Jornada.
9. BrinContos permanece em preparação e seu código não será apagado.
10. A grade de contexto do momento permanece 2 × 3 no mobile.
11. A preferência de recolhimento do aviso educacional permanece persistente.
12. O modo padrão já deve ser calmo.
13. O modo Acolher é uma redução adicional de estímulos.
14. A linguagem visual será de riqueza silenciosa.
15. Rotas e contratos de dados serão preservados inicialmente.
16. Não haverá migração de banco nas fases iniciais.
17. Não haverá pontuação, ranking, streak ou diagnóstico.
18. Implementação será incremental, testável e reversível.

---

## 24. Questões a validar, sem bloquear o início

Estas questões exigem teste com usuários e não devem ser decididas apenas por preferência interna:

1. “Memórias” é mais compreensível que “Diário” como rótulo principal?
2. “Brincar” é mais claro que “Atividades” na navegação?
3. “Nossa Jornada” reduz a sensação avaliativa?
4. “Mais” mantém boa encontrabilidade de Perfil e modo Acolher?
5. A grade de contexto deve recolher após a seleção?
6. “Brincar agora” ou “Ver como brincar” gera expectativa mais correta?
7. O blog deve permanecer no dashboard recorrente?
8. A dica da fase deve ser expansível ou encaminhar para outra área?
9. “Reduzir estímulos” deve ser o rótulo principal do modo Acolher?
10. Quanto de decoração é percebido como acolhedor sem se tornar distração?

O teste pode alterar rótulos e composição, mas não os princípios sagrados.

---

## 25. Fora de escopo desta iniciativa

- Produção editorial dos BrinContos.
- Diagnóstico ou triagem de desenvolvimento.
- Checklist individual de marcos.
- Gamificação por frequência.
- Rede social ou compartilhamento público.
- Chatbot infantil.
- Inferência automática a partir de fotos, voz ou texto livre.
- Reescrita do recomendador sem evidência de necessidade.
- Mudança de banco apenas para facilitar layout.
- Redesign completo da área pública antes de estabilizar a experiência autenticada.
- Loja e monetização, exceto por impactos diretos de navegação.

---

## 26. Governança do plano

### 26.1 Fonte de verdade

Este arquivo governa a implementação da nova UX. O `docs/DOCUMENTO_MESTRE.md` continua governando a identidade global e a arquitetura vigente em produção.

Durante o desenvolvimento:

- este plano descreve o alvo;
- o Documento Mestre descreve o que está vigente;
- após cada merge de fase, o Documento Mestre deve refletir a nova realidade.

### 26.2 Registro de decisões

Toda decisão que alterar princípios, arquitetura, rótulos principais ou escopo deve ser registrada ao final deste documento com:

- data;
- decisão;
- motivação;
- evidência;
- impacto;
- responsável.

### 26.3 Revisão

Revisar o plano:

- após cada piloto;
- antes de uma mudança de rota;
- antes de qualquer migração;
- quando BrinContos for retomado;
- quando surgir novo módulo principal;
- antes do merge final da `novaux`.

---

## 27. Log inicial de decisões

| Data | Decisão | Motivação | Impacto |
| --- | --- | --- | --- |
| 2026-07-22 | Criar branch `novaux` | isolar evolução estrutural da produção | desenvolvimento seguro e preview independente |
| 2026-07-22 | Adotar riqueza silenciosa | trazer identidade sem excesso de estímulo | sistema visual e critérios de decoração |
| 2026-07-22 | Separar Memórias de Jornada conceitualmente | reduzir dúvida entre cadastro e consulta | navegação, títulos e microcopy |
| 2026-07-22 | Preservar rotas e contratos inicialmente | reduzir risco de regressão | implementação predominantemente de apresentação |
| 2026-07-22 | Manter BrinContos em preparação | permitir desenvolvimento editorial cuidadoso | rota preservada, biblioteca não promovida |

---

## 28. Primeira sequência de trabalho autorizável

Quando a implementação for iniciada, a primeira sequência recomendada é:

1. Criar baseline visual e testes de navegação.
2. Extrair configuração única da navegação.
3. Implementar rótulos e agrupamentos novos atrás de composição reversível.
4. Criar componentes fundamentais de introdução, ajuda e estado vazio.
5. Reorganizar o dashboard sem alterar o recomendador.
6. Validar primeira visita e uso recorrente em mobile.
7. Revisar catálogo e detalhe da brincadeira.
8. Revisar modo de brincar e reflexão.
9. Reposicionar Diário como Memórias.
10. Reescrever apresentação da Jornada como síntese.
11. Aplicar sistema de riqueza silenciosa.
12. Executar piloto com cuidadores.
13. Corrigir bloqueantes.
14. Atualizar Documento Mestre.
15. Preparar merge progressivo para `main`.

Nenhuma etapa posterior deve ser usada para justificar atalhos nas etapas de clareza, acessibilidade, segurança ou validação.

---

## 29. Declaração final

A nova UX do Brincar Educando não será medida pela quantidade de elementos adicionados nem pela aparência isolada das telas. Ela será bem-sucedida quando uma família compreender o produto sem esforço, encontrar um convite possível, sentir liberdade para adaptar ou parar, guardar somente o que desejar e consultar sua história sem se sentir avaliada.

O produto deve parecer vivo sem ser barulhento, cuidadoso sem ser clínico, bonito sem ser decorativo demais e inteligente sem presumir conhecer a criança melhor do que sua família.

Essa é a experiência que este plano protege.
