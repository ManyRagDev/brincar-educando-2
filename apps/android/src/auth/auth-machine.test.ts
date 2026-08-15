import { describe, expect, it } from "vitest";
import {
  authReducer,
  initialAuthState,
  loginErrorMessage
} from "./auth-machine";

describe("authReducer", () => {
  it("restaura uma sessão autenticada", () => {
    expect(authReducer(initialAuthState, { type: "RESTORED", email: "ana@exemplo.com" })).toEqual({
      status: "authenticated",
      email: "ana@exemplo.com",
      message: null
    });
  });

  it("não mantém a sessão depois do logout", () => {
    const authenticated = authReducer(initialAuthState, {
      type: "RESTORED",
      email: "ana@exemplo.com"
    });

    expect(authReducer(authenticated, { type: "SIGNED_OUT" })).toEqual({
      status: "anonymous",
      email: null,
      message: null
    });
  });

  it("traduz credenciais inválidas sem expor mensagem técnica", () => {
    expect(loginErrorMessage(new Error("Invalid login credentials"))).toBe(
      "E-mail ou senha incorretos."
    );
  });
});
