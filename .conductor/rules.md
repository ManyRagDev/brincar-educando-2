# Rules: Conductor Protocol

## Arquitetura & Código
- **Clean Code & DRY**: Priorizar legibilidade e evitar duplicação.
- **Single Responsibility**: Componentes e funções devem ter apenas uma responsabilidade.
- **App Router Patterns**: Usar `Server Components` por padrão, extraindo `Client Components` apenas quando necessário (interatividade).
- **Type Safety**: TypeScript rigoroso em toda a aplicação. Evitar `any`.

## UI/UX
- **Design System First**: Usar os tokens definidos em `globals.css` e componentes de `components/ui`.
- **Acessibilidade**: Seguir padrões ARIA fornecidos pelo Radix UI.
- **Performance**: Otimizar imagens com `next/image` e gerenciar estados de loading no Next.js.

## Workflow Conductor
1. **Plan Before Code**: Toda funcionalidade complexa exige um `plan.md` em `.conductor/tracks/`.
2. **Sync Docs**: Código nunca deve estar mais atualizado que a documentação.
3. **Task Integrity**: Atualizar sempre o `tracks.md` ao finalizar tarefas.
