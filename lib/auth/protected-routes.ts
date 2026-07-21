export const PROTECTED_ROUTE_PREFIXES = [
  "/dashboard",
  "/atividades",
  "/atividade-ativa",
  "/diario",
  "/historias",
  "/crescimento",
  "/jornada",
  "/orientacoes",
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
