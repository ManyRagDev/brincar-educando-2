export const PROTECTED_ROUTE_PREFIXES = [
  "/dashboard",
  "/dashboard-legado",
  "/atividades",
  "/atividade-ativa",
  "/diario",
  "/historias",
  "/crescimento",
  "/jornada",
  "/orientacoes",
  "/mais",
  "/perfil",
  "/configuracoes",
  "/onboarding",
  "/admin",
] as const;

export function isProtectedPath(pathname: string) {
  return PROTECTED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
