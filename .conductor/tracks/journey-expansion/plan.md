# Plan: Journey Expansion

## Phase 1: Foundation (Badges & Reflection)
*Focus: Improving the utility of individual activities and capturing data.*
- [x] **Schema Update**: Create `atividades_execucoes` table and update `atividades` with new metadata columns.
- [x] **Component**: Create `ActivityBadge` component (Contextual labels: "🔥 Trending", "🌤️ Outdoor").
- [x] **Feature**: Implement `PostActivityReflection` flow (Modal/Page after finishing activity).
- [x] **Logic**: Connect "Concluir" button to Database Insert.

## Phase 2: Visualization (Diary & Timeline)
*Focus: Showing value back to the user.*
- [x] **Page**: Refactor `/diario` to use a `Timeline` layout instead of a grid.
- [x] **Component**: Create `TimelineEntry` with support for photos and ratings.
- [x] **Logic**: Group executions by Date (Week/Month).
- [x] **UX**: Add "Empty State" encouraging the first activity.

## Phase 3: Intelligent Discovery (For Today)
*Focus: Reducing decision paralysis.*
- [x] **Algorithm**: Implement `get_suggested_activities` (Edge Function or Client Logic).
  - *Inputs*: Child Age, Time of Day, History.
- [x] **Component**: Create `SugestaoPorHoje` (Hero replacement) on Home.
- [ ] **Integration**: Wire up the "Começar Agora" button to the Active Mode.

## Phase 3.5: Library & Search (New)
*Focus: Freedom of exploration and Premium Feel.*
- [ ] **Data**: Create Seed Script to import `atividades.json` into Supabase.
- [ ] **Data**: Verify/Update tags and categories in DB.
- [ ] **Page**: Create `/atividades` (Library Page).
- [ ] **Feature**: Implement Search Bar + Filters (Energy, Category, Age).
- [ ] **Logic**: Implement "Recommended for You" sorting algorithm.
- [ ] **UI**: Create "Premium Empty States" using 3D avatars.
- [ ] **UI**: Add "Skeleton" loading states for search results.

## Phase 4: Active Mode & Growth
*Focus: The "during" experience and long-term retention.*
- [x] **Page**: Create `/atividade-ativa/[id]` (Distraction-free mode).
- [x] **State**: Setup `useActiveSession` store (Zustand).
- [x] **Page**: Create `/crescimento` (Dashboard) with `recharts`.
- [x] **Verificaton**: End-to-end test of the User Journey (Discovery -> Execution -> Reflection -> Analysis).

## Refinement: Dashboard 2.0
*Focus: Personalization and Context.*
- [x] **Layout**: New Hero Card with "Why this activity?".
- [x] **Context**: Dynamic Greeting + Child Age.
- [x] **Logic**: Server-side fetching for Featured + Grid suggestions.
