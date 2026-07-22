import {
  BookMarked,
  BookOpen,
  Dumbbell,
  Home,
  Info,
  LayoutGrid,
  Settings,
  Sprout,
  User,
  type LucideIcon,
} from "lucide-react";

export type DashboardNavigationItem = {
  href: string;
  label: string;
  mobileLabel?: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
};

export const primaryDashboardNavigation: DashboardNavigationItem[] = [
  {
    href: "/dashboard",
    label: "Hoje",
    description: "Encontrar um convite possível para agora",
    icon: Home,
  },
  {
    href: "/atividades",
    label: "Brincar",
    description: "Explorar outras ideias de brincadeira",
    icon: Dumbbell,
  },
  {
    href: "/diario",
    label: "Memórias",
    description: "Guardar e rever momentos de vocês",
    icon: BookMarked,
  },
  {
    href: "/jornada",
    label: "Jornada",
    mobileLabel: "Jornada",
    description: "Ver uma síntese do repertório vivido",
    icon: Sprout,
  },
];

export const discoveryNavigation: DashboardNavigationItem[] = [
  {
    href: "/orientacoes",
    label: "Entender esta fase",
    description: "Consultar orientações sem checklist ou avaliação",
    icon: Info,
  },
  {
    href: "/historias",
    label: "BrinContos",
    description: "Histórias para viver juntos — em preparação",
    icon: BookOpen,
    badge: "em breve",
  },
];

export const accountNavigation: DashboardNavigationItem[] = [
  {
    href: "/perfil",
    label: "Perfil da família",
    description: "Crianças e preferências de vocês",
    icon: User,
  },
  {
    href: "/configuracoes",
    label: "Configurações",
    description: "Preferências e conta",
    icon: Settings,
  },
];

export const mobileMoreNavigation: DashboardNavigationItem[] = [
  ...discoveryNavigation,
  ...accountNavigation,
];

export const mobileMoreItem: DashboardNavigationItem = {
  href: "/mais",
  label: "Mais",
  description: "Orientações, BrinContos, perfil e preferências",
  icon: LayoutGrid,
};

export function isNavigationItemActive(pathname: string, href: string) {
  return pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));
}
