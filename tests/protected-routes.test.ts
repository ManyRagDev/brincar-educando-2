import assert from "node:assert/strict";
import test from "node:test";
import { isProtectedPath } from "../lib/auth/protected-routes.ts";

test("protege todas as rotas privadas e seus descendentes", () => {
  for (const path of [
    "/dashboard",
    "/atividade-ativa/pintura",
    "/configuracoes",
    "/crescimento",
    "/jornada",
    "/onboarding",
    "/orientacoes",
  ]) {
    assert.equal(isProtectedPath(path), true, path);
  }
});

test("não captura prefixos parecidos nem páginas públicas", () => {
  for (const path of ["/", "/blog", "/sobre", "/atividades-publicas", "/dashboard-demo"]) {
    assert.equal(isProtectedPath(path), false, path);
  }
});
