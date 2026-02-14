import { SupabaseClient } from "@supabase/supabase-js";

export async function getDashboardSuggestions(supabase: SupabaseClient, childAgeMonths: number | null) {
    const hour = new Date().getHours();

    // 1. Determinar energia baseada no horário
    let energyFilter: string[] = [];
    let timeContext = "";

    if (hour >= 6 && hour < 12) {
        energyFilter = ["alta", "media"];
        timeContext = "Manhã de energia! ☀️";
    } else if (hour >= 12 && hour < 18) {
        energyFilter = ["media", "alta"];
        timeContext = "Tarde criativa! 🎨";
    } else {
        energyFilter = ["baixa", "media"];
        timeContext = "Hora de acalmar... 🌙";
    }

    // 2. Buscar atividades candidatas (Featured)
    // Filtra por energia do horário e, se disponível, pela faixa etária da criança
    let featuredQuery = supabase
        .schema("brincareducando")
        .from("atividades")
        .select("id, slug, titulo, descricao, imagem_url, energia, preparo_minutos, categoria, beneficios")
        .in("energia", energyFilter);

    if (childAgeMonths !== null) {
        // idade_min_meses <= childAgeMonths <= idade_max_meses
        featuredQuery = featuredQuery
            .lte("idade_min_meses", childAgeMonths)
            .gte("idade_max_meses", childAgeMonths);
    }

    const { data: featuredData, error: featuredError } = await featuredQuery.limit(5);

    if (featuredError) {
        console.error("[Dashboard] Error fetching featured:", featuredError);
        return null;
    }

    // 3. Buscar outras sugestões (Grid)
    // Buscamos um pool maior (15 itens) para ter variedade e filtrar em memória
    let othersQuery = supabase
        .schema("brincareducando")
        .from("atividades")
        .select("id, slug, titulo, descricao, imagem_url, energia, preparo_minutos, categoria");

    if (childAgeMonths !== null) {
        othersQuery = othersQuery
            .lte("idade_min_meses", childAgeMonths)
            .gte("idade_max_meses", childAgeMonths);
    }

    const { data: othersData, error: othersError } = await othersQuery.limit(15);

    if (othersError) {
        console.error("[Dashboard] Error fetching others:", othersError);
    }

    // Se não encontrou nenhuma featured (muito raro se o banco estiver populado),
    // tentamos pegar do pool geral como fallback
    let candidates = featuredData || [];
    if (candidates.length === 0 && othersData && othersData.length > 0) {
        // Adapter para transformar 'others' em 'featured' (faltam beneficios, mas ok)
        candidates = othersData as any[];
        timeContext = "Sugestão especial ✨"; // Contexto genérico
    }

    if (candidates.length === 0) {
        return null;
    }

    // Escolhe uma featured aleatória
    const randomIndex = Math.floor(Math.random() * candidates.length);
    const featured = candidates[randomIndex];

    // Prepara 'others'
    let finalOthers = othersData || [];

    // Remove a featured da lista de outros
    finalOthers = finalOthers.filter((a) => a.id !== featured.id);

    // Embaralha e pega 4
    finalOthers = finalOthers.sort(() => 0.5 - Math.random()).slice(0, 4);

    // Garante que temos um objeto de retorno válido
    return {
        featured: {
            ...featured,
            context: timeContext,
        },
        others: finalOthers,
    };
}
