"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, Chrome } from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "signin" | "signup" | "reset";

interface AuthFormProps {
  defaultMode?: Mode;
}

export function AuthForm({ defaultMode = "signin" }: AuthFormProps) {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const supabase = createClient();

  const [showUnifiedChoice, setShowUnifiedChoice] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
        });
        if (error) setError(error.message);
        else setSuccess("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
        return;
      }

      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              app_id: "brincareducando" // Isolation metadata
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        // Supabase often returns success even if user exists (to prevent email enumeration)
        // If identities is empty, it means the user already exists.
        const userExists = error?.message.toLowerCase().includes("user already registered") ||
          (data?.user && data.user.identities && data.user.identities.length === 0);

        if (userExists) {
          setShowUnifiedChoice(true);
        } else if (error) {
          setError(error.message);
        } else {
          setSuccess("Conta criada! Verifique seu e-mail para confirmar.");
        }
        return;
      }

      // Sign in
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(
          error.message === "Invalid login credentials"
            ? "E-mail ou senha incorretos."
            : error.message
        );
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    });
  }

  async function handleOAuth() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  }

  if (showUnifiedChoice) {
    return (
      <div className="space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="p-4 rounded-2xl bg-primary/10 border-2 border-primary/20 text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-2xl">
            ✨
          </div>
          <div>
            <h3 className="font-bold text-[var(--color-foreground)]">Conta ManyLabs Detectada!</h3>
            <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
              Vimos que você já faz parte da nossa rede em outro app. Como deseja prosseguir?
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              className="w-full btn-primary-theme"
              onClick={() => {
                setMode("signin");
                setShowUnifiedChoice(false);
                setError(null);
              }}
            >
              Usar minha conta ManyLabs
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setEmail("");
                setPassword("");
                setName("");
                setShowUnifiedChoice(false);
                setError(null);
              }}
            >
              Usar outro e-mail
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex rounded-xl bg-[var(--color-muted)] p-1">
        {(["signin", "signup"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); setError(null); setSuccess(null); setShowUnifiedChoice(false); }}
            className={cn(
              "flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200",
              mode === m
                ? "bg-[var(--color-card)] text-[var(--color-foreground)] shadow-sm"
                : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
            )}
          >
            {m === "signin" ? "Entrar" : "Criar conta"}
          </button>
        ))}
      </div>

      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl font-black text-[var(--color-foreground)]">
          {mode === "signin"
            ? "Bem-vindo de volta!"
            : mode === "signup"
              ? "Vamos começar"
              : "Recuperar senha"}
        </h2>
        <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
          {mode === "signin"
            ? "Entre para continuar sua jornada."
            : mode === "signup"
              ? "Crie sua conta gratuita."
              : "Enviaremos um link para redefinir sua senha."}
        </p>
      </div>

      {/* OAuth */}
      {mode !== "reset" && (
        <Button
          type="button"
          variant="outline"
          className="w-full gap-3 border-[var(--color-border)] h-12 rounded-2xl font-bold bg-[var(--color-background)] hover:bg-[var(--color-muted)] hover:scale-[1.01] transition-all"
          onClick={handleOAuth}
          disabled={isPending}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continuar com Google
        </Button>
      )}

      {/* Divider */}
      {mode !== "reset" && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--color-border)]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[var(--color-background)] px-3 text-[var(--color-muted-foreground)]">
              ou com e-mail
            </span>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <div className="space-y-1.5">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ana Souza"
              required
              autoComplete="name"
              className="bg-[var(--color-input)] border-[var(--color-border)]"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            autoComplete="email"
            className="bg-[var(--color-input)] border-[var(--color-border)]"
          />
        </div>

        {mode !== "reset" && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              {mode === "signin" && (
                <button
                  type="button"
                  className="text-xs text-[var(--color-primary)] font-semibold hover:underline"
                  onClick={() => setMode("reset")}
                >
                  Esqueci a senha
                </button>
              )}
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                className="bg-[var(--color-input)] border-[var(--color-border)] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}

        {/* Error / Success */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
            {success}
          </div>
        )}

        <Button
          type="submit"
          className="w-full btn-primary-theme"
          disabled={isPending}
        >
          {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {mode === "signin"
            ? "Entrar"
            : mode === "signup"
              ? "Criar conta"
              : "Enviar link"}
        </Button>
      </form>

      {/* Back to signin from reset */}
      {mode === "reset" && (
        <button
          type="button"
          onClick={() => setMode("signin")}
          className="w-full text-center text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
        >
          ← Voltar ao login
        </button>
      )}
    </div>
  );
}
