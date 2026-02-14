import { createClient } from "@/lib/supabase/server";
import { PerfilCriancaForm } from "@/components/dashboard/PerfilCriancaForm";

export default async function OnboardingPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    // Fetch existing children to see if we are in "edit" mode or just returning
    const { data: criancas } = await supabase
        .from("criancas")
        .select("*")
        .order("created_at", { ascending: false });

    const existingChild = criancas && criancas.length > 0 ? criancas[0] : null;

    return (
        <div className="min-h-screen bg-[var(--color-background)] py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
            <div className="max-w-2xl w-full space-y-8 bg-[var(--color-card)] p-8 rounded-3xl shadow-xl border-2 border-[var(--color-border)]">
                <div className="text-center space-y-2">
                    <h1 className="font-serif text-4xl font-black text-[var(--color-foreground)]">
                        {existingChild ? "Editar Perfil Mágico ✨" : "Bem-vindo ao Brincar Educando! ✨"}
                    </h1>
                    <p className="text-lg text-[var(--color-muted-foreground)]">
                        {existingChild
                            ? "Ajuste os detalhes do perfil para uma experiência ainda melhor."
                            : "Para começarmos essa jornada mágica, precisamos conhecer um pouco mais sobre a criança."
                        }
                    </p>
                </div>

                <div className="mt-8 pt-8 border-t border-[var(--color-border)]">
                    <PerfilCriancaForm
                        initialData={existingChild}
                        isEditing={!!existingChild}
                    />
                </div>

                <p className="text-center text-sm text-[var(--color-muted-foreground)] mt-6">
                    Não se preocupe, você poderá editar essas informações a qualquer momento.
                </p>
            </div>
        </div>
    );
}
