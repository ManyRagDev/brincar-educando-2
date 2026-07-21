import { PerfilCriancaForm } from "@/components/dashboard/PerfilCriancaForm";
import { redirect } from "next/navigation";
import { getActiveChild } from "@/lib/children/active-child";
import { requireAppUser } from "@/lib/auth/require-app-user";

export default async function OnboardingPage() {
    const { supabase, user } = await requireAppUser();
    const { activeChild: existingChild, needsSelection } = await getActiveChild(supabase, user.id);

    if (needsSelection) redirect("/dashboard");

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
