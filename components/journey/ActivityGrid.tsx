import { createClient } from "@/lib/supabase/server";
import { ActivityCard, Activity } from "./ActivityCard";
import { PremiumEmptyState } from "@/components/ui/PremiumEmptyState";

interface ActivityGridProps {
    searchParams: { [key: string]: string | string[] | undefined };
    /** Idade da criança em meses, passada pelo servidor para aplicar filtro de faixa etária */
    childAgeMonths?: number | null;
}

export async function ActivityGrid({ searchParams, childAgeMonths = null }: ActivityGridProps) {
    const supabase = await createClient();

    // Extract search params
    const q = typeof searchParams.q === 'string' ? searchParams.q : null;
    const energia = typeof searchParams.energia === 'string' ? searchParams.energia : null;
    const local = typeof searchParams.local === 'string' ? searchParams.local : null;
    const categoria = typeof searchParams.categoria === 'string' ? searchParams.categoria : null;
    const idadeAdequada = searchParams.idade_adequada === '1';

    // Build query
    let query = supabase
        .from('atividades')
        .select('*');

    if (q) {
        query = query.or(`titulo.ilike.%${q}%,descricao.ilike.%${q}%,materiais.cs.{${q}}`);
        // Note: Array contains logic for 'materiais' might verify exact string match in array.
        // For partial text search in array, Supabase/Postgres needs specific operators.
        // Simple ilike on text columns is safer.
        // For materiais (text[]), .cs. means "contains".
        // A full text search solution would be better but simple ilike is okay for MVP titles.
    }

    if (energia) {
        query = query.eq('energia', energia);
    }

    if (local) {
        query = query.eq('local', local);
    }

    if (categoria) {
        query = query.eq('categoria', categoria);
    }

    // Filtro por faixa etária da criança (ativado via botão especial)
    if (idadeAdequada && childAgeMonths !== null) {
        // idade_min_meses <= childAgeMonths <= idade_max_meses
        query = query
            .lte('idade_min_meses', childAgeMonths)
            .gte('idade_max_meses', childAgeMonths);
    }

    // Default order
    query = query.order('titulo', { ascending: true });

    const { data: activities, error } = await query;

    if (error) {
        console.error("Error fetching activities:", error);
        return (
            <div className="text-center p-10 text-destructive">
                Ocorreu um erro ao carregar as brincadeiras. Tente novamente.
            </div>
        );
    }

    if (!activities || activities.length === 0) {
        return (
            <PremiumEmptyState
                title={q ? `Nenhuma brincadeira encontrada para "${q}"` : "Nenhuma brincadeira encontrada"}
                description="Tente mudar os filtros ou buscar por outro termo. Que tal 'Bola' ou 'Pintura'?"
                actionLabel="Limpar busca"
                actionLink="/atividades"
            // imageSrc="/public/images/brinquedo.png" // Using default icon fallback for now
            />
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
            {activities.map((activity, index) => (
                <ActivityCard
                    key={activity.id}
                    activity={activity as unknown as Activity}
                    index={index}
                />
            ))}
        </div>
    );
}
