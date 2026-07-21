# Plano de implementação — Sistema de Jornada Familiar

## Estratégia

Entregar em fatias verticais que já sejam úteis para famílias reais. Cada fase termina com fluxo funcional, dados confiáveis e critérios de qualidade; nenhuma fase depende de “encher o catálogo” antes de gerar valor.

## Fase 0 — Integridade e fundação

- [x] Remover percentuais e marcos fictícios do perfil.
- [x] Renomear “Crescimento” para “Jornada” e retirar streak como KPI principal.
- [x] Centralizar proteção de todas as rotas autenticadas.
- [x] Eliminar `any` nas entidades principais e tipar os clientes Supabase.
- [x] Regenerar os tipos autoritativos a partir do banco remoto reconciliado.
- [x] Criar fonte única para criança ativa, com seletor para famílias com múltiplas crianças.
- [x] Documentar o contrato esperado e os invariantes de isolamento familiar.
- [x] Capturar o baseline remoto e alinhar esquema, migrations, funções, grants e RLS.
- [x] Definir aviso de escopo educacional e fluxo de preocupação com desenvolvimento.

**Aceite:** nenhuma tela comunica avaliação infantil não sustentada; qualquer rota privada exige usuário e acesso ao app; todas as consultas usam a criança ativa.

## Fase 1 — “Hoje” realmente útil

- [x] Implementar saudação por horário e seletor de criança.
- [x] Criar check-in contextual opcional.
- [x] Substituir recomendação aleatória por ranking determinístico e explicável.
- [x] Considerar idade, contexto, interesses, histórico recente e feedback.
- [x] Oferecer recomendação principal + alternativa simples + outro clima.
- [x] Implementar “trocar sugestão” com motivo opcional.
- [x] Remover campainha decorativa.
- [x] Criar estados de vazio, erro, primeira visita e ausência de match.
- [x] Instrumentar impressão, abertura, troca e início.

**Aceite:** um cuidador encontra uma opção viável em até 30 segundos e entende por que ela foi sugerida.

## Fase 2 — Conteúdo e modo Brincar

- [x] Evoluir esquema de atividades com segurança, mediação, adaptações, prompts, variações e revisão.
- [x] Criar workflow editorial e estados de publicação.
- [x] Refatorar detalhe da atividade para a nova estrutura.
- [x] Transformar modo ativo em preparação + passos + prompts + adaptação/encerramento.
- [x] Tornar cronômetro opcional.
- [x] Refazer reflexão pós-atividade com linguagem observacional.
- [x] Persistir feedback completo e motivo de encerramento.
- [x] Implementar mídia privada ou remover CTA de foto até estar pronto.
- [x] Revisar e enriquecer o primeiro lote de 20–30 atividades prioritárias.

**Aceite:** cada atividade publicada é segura, executável, adaptável, rastreável e oferece suporte real ao adulto durante a interação.

## Fase 3 — Diário e Jornada

- [x] Unificar atividades, histórias e registros livres numa linha do tempo por criança.
- [x] Adicionar registros rápidos de fala, descoberta, desafio e foto.
- [x] Implementar edição, exclusão e exportação.
- [x] Criar insights descritivos e probabilísticos baseados apenas em histórico real.
- [x] Mostrar repertório de experiências, preferências observadas e próximos convites.
- [x] Implementar controles de privacidade e URLs assinadas.

**Aceite:** o diário guarda memória com pouco esforço e a Jornada devolve padrões úteis sem nota, comparação ou diagnóstico.

## Fase 4 — Brincontos

- [x] Definir modelo editorial e de dados para histórias, páginas, áudio, prompts e extensões.
- [x] Criar biblioteca por momento, tema, idade e duração.
- [x] Implementar modo leitura acessível e progresso por criança.
- [x] Adicionar pausas e perguntas abertas.
- [x] Integrar sessões de leitura ao diário e ao recomendador.
- [x] Produzir e revisar lote inicial de histórias.

**Aceite:** famílias conseguem descobrir, compartilhar e retomar histórias; cada história possui autoria, revisão e proposta de interação.

## Fase 5 — Personalização adaptativa e qualidade

- [x] Versionar pesos e regras do recomendador.
- [x] Criar painel de cobertura e qualidade do conteúdo.
- [x] Implementar feedback “mais/menos como esta”.
- [x] Medir razões de troca e reduzir atrito por contexto.
- [x] Auditar vieses por faixa etária, estrutura familiar e necessidades de acessibilidade.
- [x] Criar calendário de revisão científica/editorial.
- [ ] Testes de usabilidade com cuidadores e revisão com profissionais.

**Aceite:** recomendações melhoram com sinais transparentes, sem inferências clínicas e com monitoramento de qualidade.

## Ordem da primeira entrega de código

1. Integridade do perfil e proteção de rotas.
2. Criança ativa.
3. Modelo de recomendação V1.
4. Dashboard Hoje.
5. Fluxo atividade → brincar → reflexão.
6. Jornada sem métricas falsas.

## Critérios transversais

- Mobile first e acessibilidade AA.
- Server Components por padrão.
- Tipagem estrita.
- RLS e privacidade verificadas.
- Conteúdo com fonte e revisão.
- Testes para regras do recomendador.
- Eventos de produto sem dados sensíveis desnecessários.
- Nenhuma mensagem que gere culpa, comparação ou promessa de desenvolvimento.
