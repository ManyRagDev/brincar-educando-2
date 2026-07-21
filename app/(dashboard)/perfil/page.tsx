import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BookMarked,
  Edit3,
  Heart,
  Library,
  Plus,
  Sparkles,
} from "lucide-react";
import { ChildSelectionPrompt } from "@/components/dashboard/ChildSelectionPrompt";
import { requireAppUser } from "@/lib/auth/require-app-user";
import { getActiveChild } from "@/lib/children/active-child";
import { calculateAge } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Perfil | Brincar Educando",
  robots: { index: false },
};

const avatarMap: Record<string, string> = {
  boy: "/images/avatars/boy.png",
  girl: "/images/avatars/girl.png",
  star: "/images/avatars/star.png",
  fox: "/images/avatars/fox.png",
  dino: "/images/avatars/dino.png",
  boy2: "/images/avatars/boy2.png",
};

export default async function PerfilPage() {
  const { supabase, user } = await requireAppUser();
  const { activeChild, children, needsSelection } = await getActiveChild(supabase, user.id);
  const parentName =
    user.user_metadata?.nome ?? user.user_metadata?.full_name ?? "Responsável";

  const [activitiesCount, diaryCount, storiesCount] = activeChild
    ? await Promise.all([
        supabase
          .from("atividades_execucoes")
          .select("id", { count: "exact", head: true })
          .eq("crianca_id", activeChild.id),
        supabase
          .from("diario_entradas")
          .select("id", { count: "exact", head: true })
          .eq("crianca_id", activeChild.id),
        supabase
          .from("historico")
          .select("id", { count: "exact", head: true })
          .eq("crianca_id", activeChild.id)
          .eq("concluido", true),
      ])
    : [{ count: 0 }, { count: 0 }, { count: 0 }];

  const interests = Array.isArray(activeChild?.interesses)
    ? activeChild.interesses.filter((item): item is string => typeof item === "string")
    : [];
  const avatarSrc =
    (activeChild?.avatar_id && avatarMap[activeChild.avatar_id]) ?? avatarMap.boy;

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-6 pb-4 pt-8">
        <Link
          href="/dashboard"
          aria-label="Voltar para Hoje"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </Link>
        <h1 className="font-serif text-xl font-black">Perfil da criança</h1>
        {activeChild ? (
          <Link
            href="/onboarding"
            aria-label={`Editar perfil de ${activeChild.nome}`}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]"
          >
            <Edit3 className="h-4 w-4" aria-hidden="true" />
          </Link>
        ) : (
          <div className="h-11 w-11" />
        )}
      </header>

      <div className="px-6 pb-10">
        {needsSelection ? (
          <ChildSelectionPrompt />
        ) : !activeChild ? (
          <section className="flex flex-col items-center justify-center space-y-4 py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-muted)] text-4xl">
              🧸
            </div>
            <div>
              <h2 className="text-xl font-black">Vamos conhecer a criança?</h2>
              <p className="text-[var(--color-muted-foreground)]">
                Um perfil simples ajuda a sugerir experiências adequadas à fase.
              </p>
            </div>
            <Link
              href="/onboarding"
              className="btn-primary-theme flex min-h-11 items-center gap-2 rounded-full px-6 py-2"
            >
              <Plus className="h-4 w-4" aria-hidden="true" /> Criar perfil
            </Link>
          </section>
        ) : (
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
            <div className="space-y-4">
              <section className="card-theme p-6 text-center">
                <div className="relative mx-auto mb-4 h-32 w-32 overflow-hidden rounded-3xl border-4 border-white bg-[var(--color-primary)]/10 shadow-xl">
                  <Image
                    src={avatarSrc}
                    alt={`Avatar de ${activeChild.nome}`}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <h2 className="font-serif text-2xl font-black">{activeChild.nome}</h2>
                <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                  {calculateAge(activeChild.data_nascimento)}
                </p>
                {children.length > 1 && (
                  <p className="mt-4 text-xs text-[var(--color-muted-foreground)]">
                    Você pode trocar a criança ativa no menu lateral.
                  </p>
                )}
              </section>

              <section className="card-theme p-5">
                <p className="mb-3 text-xs font-black uppercase tracking-widest text-[var(--color-muted-foreground)]">
                  Responsável
                </p>
                <p className="font-bold">{parentName}</p>
                <p className="text-xs text-[var(--color-muted-foreground)]">{user.email}</p>
              </section>
            </div>

            <section className="card-theme p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  <Heart className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[var(--color-muted-foreground)]">
                    O que encanta
                  </p>
                  <h3 className="font-serif text-lg font-black">Interesses informados</h3>
                </div>
              </div>
              {interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <span
                      key={interest}
                      className="rounded-full bg-[var(--color-muted)] px-3 py-1.5 text-sm font-semibold"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  Vocês ainda não registraram interesses. Eles podem mudar — e tudo bem.
                </p>
              )}
              <Link
                href="/onboarding"
                className="mt-5 inline-flex min-h-11 items-center text-sm font-bold text-[var(--color-primary)]"
              >
                Ajustar perfil
              </Link>
            </section>

            <div className="space-y-4">
              <section className="card-theme p-6">
                <div className="mb-5 flex items-center gap-3">
                  <Library className="h-5 w-5 text-[var(--color-primary)]" aria-hidden="true" />
                  <h3 className="font-serif text-lg font-black">Registros desta jornada</h3>
                </div>
                <dl className="space-y-3">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-[var(--color-muted-foreground)]">Brincadeiras vividas</dt>
                    <dd className="font-black">{activitiesCount.count ?? 0}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-[var(--color-muted-foreground)]">Memórias registradas</dt>
                    <dd className="font-black">{diaryCount.count ?? 0}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-[var(--color-muted-foreground)]">Histórias compartilhadas</dt>
                    <dd className="font-black">{storiesCount.count ?? 0}</dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-3xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 p-6">
                <div className="mb-3 flex items-center gap-2 font-black">
                  <Sparkles className="h-5 w-5 text-[var(--color-primary)]" aria-hidden="true" />
                  Acompanhar com carinho
                </div>
                <p className="text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                  Estes registros mostram experiências da família, não uma nota de desenvolvimento.
                  Cada criança tem seu ritmo. Se algo preocupar você, converse com o pediatra ou outro
                  profissional que acompanhe a criança.
                </p>
                <Link
                  href="/diario"
                  className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[var(--color-primary)]"
                >
                  <BookMarked className="h-4 w-4" aria-hidden="true" /> Ver diário
                </Link>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
