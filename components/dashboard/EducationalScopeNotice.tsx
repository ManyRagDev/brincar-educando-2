import Link from "next/link";
import { HeartHandshake } from "lucide-react";

export function EducationalScopeNotice() {
  return (
    <aside
      aria-label="Escopo do Brincar Educando"
      className="border-b border-amber-200/70 bg-amber-50 px-5 py-3 text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100"
    >
      <div className="mx-auto flex max-w-6xl items-start gap-3 lg:pl-4">
        <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <p className="text-sm leading-relaxed">
          O Brincar Educando oferece ideias para brincar, observar e fortalecer vínculos. Ele não avalia o
          desenvolvimento nem substitui o acompanhamento de profissionais. Se algo preocupa sua família, veja{" "}
          <Link href="/orientacoes" className="font-bold underline underline-offset-2">
            como buscar apoio
          </Link>
          .
        </p>
      </div>
    </aside>
  );
}
