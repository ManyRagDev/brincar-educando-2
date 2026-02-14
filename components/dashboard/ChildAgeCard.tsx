"use client";

import Image from "next/image";
import { Sparkles, Heart } from "lucide-react";

interface ChildAgeCardProps {
  nome: string;
  idadeTexto: string;
  avatarId?: string;
  corFavorita?: string;
}

const avatarMap: Record<string, string> = {
  boy: "/images/avatars/boy.png",
  girl: "/images/avatars/girl.png",
  star: "/images/avatars/star.png",
  fox: "/images/avatars/fox.png",
  dino: "/images/avatars/dino.png",
  boy2: "/images/avatars/boy2.png",
};

const corClasses: Record<string, string> = {
  rosa: "from-pink-400 to-rose-500",
  azul: "from-blue-400 to-cyan-500",
  verde: "from-green-400 to-emerald-500",
  amarelo: "from-yellow-400 to-amber-500",
  roxo: "from-purple-400 to-violet-500",
  laranja: "from-orange-400 to-red-500",
};

export function ChildAgeCard({
  nome,
  idadeTexto,
  avatarId = "boy",
  corFavorita = "azul",
}: ChildAgeCardProps) {
  const avatarSrc = avatarMap[avatarId] || avatarMap.boy;
  const gradientClass = corClasses[corFavorita] || corClasses.azul;

  return (
    <div className="relative inline-flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-white/80 border border-[var(--color-primary)]/15 shadow-lg shadow-[var(--color-primary)]/10 overflow-hidden">
      {/* Subtle gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradientClass} opacity-[0.06]`} />
      
      {/* Decorative blur orb */}
      <div className={`absolute right-0 top-0 w-16 h-16 bg-gradient-to-br ${gradientClass} opacity-10 rounded-full blur-xl translate-x-1/2 -translate-y-1/2`} />

      {/* Avatar container */}
      <div className="relative flex-shrink-0">
        <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${gradientClass} p-[2px] shadow-md`}>
          <div className="w-full h-full rounded-full bg-white p-0.5 flex items-center justify-center overflow-hidden">
            <Image
              src={avatarSrc}
              alt={`Avatar de ${nome}`}
              width={36}
              height={36}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        {/* Small status indicator */}
        <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-gradient-to-br ${gradientClass} border-2 border-white shadow-sm`} />
      </div>

      {/* Text content */}
      <div className="relative flex flex-col pr-1">
        <div className="flex items-center gap-1 mb-0.5">
          <Heart className="w-2.5 h-2.5 text-[var(--color-primary)] fill-[var(--color-primary)]/40" />
          <span className="text-[9px] font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider">
            Crescendo
          </span>
        </div>
        <span className="text-[13px] font-bold leading-tight whitespace-nowrap">
          <span className={`bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent`}>{nome}</span>
          <span className="mx-1 text-[var(--color-muted-foreground)]/40">•</span>
          <span className="text-[var(--color-foreground)]">{idadeTexto}</span>
        </span>
      </div>

      {/* Sparkle decoration */}
      <Sparkles className="w-3 h-3 text-[var(--color-primary)]/40 absolute right-2 top-2" />
    </div>
  );
}
