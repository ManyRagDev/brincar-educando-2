import Link from "next/link";
import { BookOpen, Heart, Mail, Instagram } from "lucide-react";

const footerLinks = {
  conteudo: [
    { href: "/blog", label: "Blog" },
    { href: "/loja", label: "Loja" },
    { href: "/historias", label: "Histórias" },
  ],
  empresa: [
    { href: "/sobre", label: "Sobre nós" },
    { href: "/privacidade", label: "Privacidade" },
    { href: "/termos", label: "Termos de uso" },
  ],
  conta: [
    { href: "/auth", label: "Entrar" },
    { href: "/auth?mode=signup", label: "Criar conta" },
    { href: "/dashboard", label: "Dashboard" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[var(--color-muted)] border-t border-[var(--color-border)]">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-serif italic text-3xl font-black text-[var(--color-primary)]">
                Brincar.
              </span>
            </Link>
            <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed mb-6 max-w-xs">
              Conectando a ciência do desenvolvimento infantil com o brincar de
              cada dia.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all"
                aria-label="Newsletter"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-[var(--color-muted-foreground)] mb-4">
              Conteúdo
            </h3>
            <ul className="space-y-2">
              {footerLinks.conteudo.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-[var(--color-muted-foreground)] mb-4">
              Empresa
            </h3>
            <ul className="space-y-2">
              {footerLinks.empresa.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-[var(--color-muted-foreground)] mb-4">
              Minha conta
            </h3>
            <ul className="space-y-2">
              {footerLinks.conta.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--color-border)]">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[var(--color-muted-foreground)] text-center">
            © {new Date().getFullYear()} Brincar Educando. Todos os direitos
            reservados.
          </p>
          <p className="text-xs text-[var(--color-muted-foreground)] flex items-center gap-1">
            Feito com <Heart className="h-3 w-3 text-[var(--color-primary)]" />{" "}
            para famílias brasileiras
          </p>
        </div>
      </div>
    </footer>
  );
}
