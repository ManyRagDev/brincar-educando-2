# Specification: Journey Expansion (Jornada Personalizada)

## 1. Goal
Transform the app from a static activity library into a personalized, guided parenting journey. The system will proactively suggest activities, support execution, and visualize the child's development progress.

## 2. Core Epics (The 4 Layers)

### Layer 1: Contextual Discovery
- **Feature:** "Para Hoje" (For Today) Section on Home.
- **Logic:** Suggest activities based on:
  - Child's Age (e.g., "18 months" -> focused on motor skills).
  - Time of Day (Morning = High Energy, Evening = Low Energy).
  - Usage History (Rotational logic: don't suggest what was just done).
  - Weather (Mocked or simple User Input for V1).

### Layer 1.5: Activity Library & Search (New)
- **Feature:** Global Search & Browse Page.
- **Goal:** "Total freedom of search" for parents.
- **Filters:**
  - Energy Level (Alta, Média, Baixa).
  - Category (Sensorial, Motora, etc.).
  - Age Range (Match vs. Explore).
  - Duration/Prep Time.
- **Personalization:**
  - "Recommended for [Child]" badge on search results.
  - Default sort boosts age-appropriate activities.

### Layer 0.5: Premium & Welcoming Experience (Cross-Cutting)
- **Visuals:** Use high-quality 3D avatars for empty states and "Hero" moments.
- **Tone:** Warm, encouraging copy (e.g., "Que tal descobrir algo novo?", "Perfeito para agora").
- **Animations:** Smooth layout transitions (Framer Motion) when filtering.
- **Feedback:** "Skeleton" loading states instead of spinners.

### Layer 2: Supported Execution
- **Feature:** "Mode Ativo" (Active Activity Mode).
- **UI:** A distraction-free, step-by-step view.
- **State:** Timer (optional), Checklist, "Done" button.
- **Goal:** Reduce cognitive load for parents during the activity.

### Layer 3: Reflection & Capture
- **Feature:** Post-Activity Feedback Flow.
- **Data Captured:**
  - Enjoyment Rating (1-5 Emojis).
  - Artifacts (Photos).
  - Notes (Journaling).
  - Skills Earned (Derived from Activity Tags).

### Layer 4: Progress Visualization
- **Feature:** "Diário" (Diary) Timeline & "Crescimento" (Growth) Dashboard.
- **Metrics:**
  - Activities completed vs. Goals.
  - Distribution by Category (Arte, Natureza, etc.).
  - "Streaks" or consistency markers.

---

## 3. Data Model Changes

### New Table: `brincareducando.atividades_execucoes`
To replace or augment the generic `historico`.

```sql
CREATE TABLE brincareducando.atividades_execucoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES brincareducando.usuarios(id),
    crianca_id UUID REFERENCES brincareducando.criancas(id),
    atividade_id UUID REFERENCES brincareducando.atividades(id),
    data_conclusao TIMESTAMPTZ DEFAULT NOW(),
    duracao_minutos INTEGER,
    avaliacao INTEGER CHECK (avaliacao BETWEEN 1 AND 5),
    notas TEXT,
    fotos_urls TEXT[], -- Array of storage paths
    habilidades_desbloqueadas TEXT[] -- Snapshot of skills at that time
);
```

### Updates to `brincareducando.atividades`
- Add `habilidades` (tags) if not present.
- Add `energia` ('alta', 'media', 'baixa').
- Add `preparo_minutos` (prep time).

---

## 4. UI/UX Requirements

- **Theme Consistency:** All new components must respect the `isAcolher` (Calm Mode) toggle.
- **Mobile First:** Big touch targets, bottom-heavy navigation.
- **Micro-Interactions:** Subtle animations for "Task Complete" or "Badge Earned".

## 5. Technical Stack

- **State:** `zustand` for the Active Mode session (timer, step progress).
- **Charts:** `recharts` for the Growth Dashboard.
- **Icons:** `lucide-react` (ensure consistency).
- **Storage:** Supabase Storage for user photos.
