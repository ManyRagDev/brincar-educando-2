import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { AuthForm } from "@/components/auth/AuthForm";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrar | Brincar Educando",
  description: "Entre ou crie sua conta no Brincar Educando.",
  robots: { index: false },
};

interface AuthPageProps {
  searchParams: Promise<{ mode?: string }>;
}

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const { mode } = await searchParams;
  const isSignup = mode === "signup";

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col relative">
      {/* Theme toggle — fixed top-right */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-10">
        <ThemeToggle showLabel={true} />
      </div>

      {/* Main area: logo + form, centered */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm flex flex-col items-center gap-8">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/logotipo.png"
              alt="Brincar Educando"
              width={720}
              height={248}
              className="h-48 w-auto object-contain"
              priority
            />
          </Link>

          {/* Form */}
          <div className="w-full">
            <Suspense fallback={<div className="h-96 animate-pulse bg-[var(--color-muted)] rounded-xl" />}>
              <AuthForm defaultMode={isSignup ? "signup" : "signin"} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-6 text-center">
        <p className="text-xs text-[var(--color-muted-foreground)]">
          Ao continuar, você concorda com nossos{" "}
          <Link href="/termos" className="text-[var(--color-primary)] font-semibold hover:underline">
            Termos
          </Link>{" "}
          e{" "}
          <Link href="/privacidade" className="text-[var(--color-primary)] font-semibold hover:underline">
            Privacidade
          </Link>
          .
        </p>
      </footer>
    </div>
  );
}
