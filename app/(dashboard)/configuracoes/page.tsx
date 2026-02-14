import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bell, Shield, User, Moon, Palette, Trash2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configurações | Brincar Educando",
  robots: { index: false },
};

export default async function ConfiguracoesPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const userEmail = user.email ?? "";
  const userName = user.user_metadata?.full_name ?? "Usuário";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex items-center gap-4">
        <Link
          href="/dashboard"
          className="p-2 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="font-serif text-xl font-black text-[var(--color-foreground)]">
          Configurações
        </h1>
      </header>

      <div className="px-6 pb-8 max-w-2xl">
        {/* Profile Section */}
        <section className="mb-8">
          <h2 className="text-xs font-black uppercase tracking-widest text-[var(--color-muted-foreground)] mb-4">
            Perfil
          </h2>
          <div className="card-theme p-5">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-2xl">
                👤
              </div>
              <div className="flex-1">
                <p className="font-bold text-[var(--color-foreground)]">{userName}</p>
                <p className="text-sm text-[var(--color-muted-foreground)]">{userEmail}</p>
              </div>
            </div>
            <button className="w-full py-2.5 px-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] font-semibold text-sm hover:bg-[var(--color-muted)] transition-colors flex items-center justify-center gap-2">
              <User className="h-4 w-4" />
              Editar perfil
            </button>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="mb-8">
          <h2 className="text-xs font-black uppercase tracking-widest text-[var(--color-muted-foreground)] mb-4">
            Preferências
          </h2>
          <div className="space-y-3">
            {/* Theme - Managed by ThemeToggle component */}
            <div className="card-theme p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
                  <Palette className="h-5 w-5 text-[var(--color-primary)]" />
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-foreground)]">Tema visual</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">Acolher ou Vibrante</p>
                </div>
              </div>
              <span className="text-xs text-[var(--color-muted-foreground)] bg-[var(--color-muted)] px-2 py-1 rounded">
                Use o botão no menu
              </span>
            </div>

            {/* Notifications */}
            <div className="card-theme p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-secondary)]/10 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-[var(--color-secondary)]" />
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-foreground)]">Notificações</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">Receber novidades por email</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-[var(--color-muted)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
              </label>
            </div>

            {/* Newsletter */}
            <div className="card-theme p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Moon className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-foreground)]">Newsletter semanal</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">Dicas e novidades toda semana</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-[var(--color-muted)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Privacy & Security */}
        <section className="mb-8">
          <h2 className="text-xs font-black uppercase tracking-widest text-[var(--color-muted-foreground)] mb-4">
            Privacidade e Segurança
          </h2>
          <div className="space-y-3">
            <Link
              href="/privacidade"
              target="_blank"
              className="card-theme p-4 flex items-center justify-between hover:no-underline group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors">
                    Política de Privacidade
                  </p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">Como protegemos seus dados</p>
                </div>
              </div>
              <span className="text-[var(--color-muted-foreground)]">→</span>
            </Link>

            <button className="w-full card-theme p-4 flex items-center justify-between text-left hover:bg-[var(--color-muted)]/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-foreground)]">Alterar senha</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">Atualize sua senha de acesso</p>
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section>
          <h2 className="text-xs font-black uppercase tracking-widest text-[var(--color-muted-foreground)] mb-4">
            Zona de Perigo
          </h2>
          <div className="card-theme border-red-200 dark:border-red-900/30 p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <Trash2 className="h-5 w-5 text-red-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[var(--color-foreground)] mb-1">Excluir conta</p>
                <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
                  Esta ação é irreversível. Todos os seus dados, incluindo entradas do diário 
                  e histórico de atividades, serão permanentemente removidos.
                </p>
                <button className="px-4 py-2 rounded-lg border border-red-300 text-red-600 font-semibold text-sm hover:bg-red-50 transition-colors">
                  Solicitar exclusão da conta
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
