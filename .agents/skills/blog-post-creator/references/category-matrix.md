# Matriz de Categorias Oficiais do Blog

Para manter a consistência visual nos cards ([ArticleCard.tsx](../../../components/blog/ArticleCard.tsx)) e no filtro de navegação ([CategoryFilter.tsx](../../../components/blog/CategoryFilter.tsx)), todo novo artigo **deve utilizar exatamente uma das categorias abaixo** no frontmatter.

---

## 🏷️ Categorias Válidas

| Categoria | Foco Temático | Exemplo de Temas |
| :--- | :--- | :--- |
| **Desenvolvimento** | Marcos do desenvolvimento, brincadeiras, marcos motores, linguagem, autonomia e abordagem Montessori. | *Brinquedos por idade, desenvolvimento socioemocional, coordenação motora fina.* |
| **Rotina** | Previsibilidade, rituais diários, sono, transições, equilíbrio de telas e organização do lar. | *Janelas de sono, transição do desfralde, rotina da noite sem estresse.* |
| **Saúde e Bem-Estar** | Cuidados com o recém-nascido, higiene, prevenção de acidentes, saúde emocional da mãe/pais e puerpério. | *Coto umbilical, febre e sinais de alerta, saúde mental materna.* |
| **Amamentação** | Pega correta, mitos e verdades, desmame gentil, apoio à nutriz e desafios da amamentação. | *Ciência vs mitos na amamentação, dor na amamentação.* |
| **Alimentação e Nutrição** | Introdução alimentar (BLW, tradicional, participativa), seletividade alimentar infantil e ambiente à mesa. | *BLW vs papinhas, como lidar com a recusa de legumes.* |
| **Primeira Infância** | Temas gerais sobre os primeiros anos de vida, comunicação do choro e vínculo nos primeiros meses. | *Por que o bebê chora, a importância dos primeiros 1000 dias.* |
| **Brincar** | Brincadeiras não estruturadas, brincar livre, contato com a natureza, brinquedos sensoriais e DIY. | *Benefícios do esconde-esconde, brincadeiras sensoriais com água e textura.* |
| **Comportamento** | Disciplina positiva, acolhimento de birras, limites firmes com afeto, mordidas e agressividade na infância. | *Por que crianças batem, como manter a calma na birra.* |

---

## ⚠️ Regras Técnicas de Formatação
1. **Case-Sensitive**: Escreva a categoria com a primeira letra maiúscula e acentuação correta (ex: use `"Saúde e Bem-Estar"` e não `"saude"` ou `"Saúde"`).
2. **Valor Único**: Não coloque arrays ou múltiplas categorias no campo `category:` do frontmatter. Se quiser adicionar palavras-chave extras, use o campo opcional `tags: ["sono", "recem-nascido"]`.
