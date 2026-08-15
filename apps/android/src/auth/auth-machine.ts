export type AuthStatus =
  | "booting"
  | "anonymous"
  | "authenticating"
  | "authenticated"
  | "access_denied"
  | "misconfigured"
  | "failed";

export type AuthState = {
  status: AuthStatus;
  email: string | null;
  message: string | null;
};

export type AuthEvent =
  | { type: "RESTORED"; email: string }
  | { type: "SIGNED_OUT" }
  | { type: "SUBMIT" }
  | { type: "ACCESS_DENIED" }
  | { type: "MISCONFIGURED"; message: string }
  | { type: "FAILED"; message: string }
  | { type: "RETRY" };

export const initialAuthState: AuthState = {
  status: "booting",
  email: null,
  message: null
};

export function authReducer(state: AuthState, event: AuthEvent): AuthState {
  switch (event.type) {
    case "RESTORED":
      return { status: "authenticated", email: event.email, message: null };
    case "SIGNED_OUT":
      return { status: "anonymous", email: null, message: null };
    case "SUBMIT":
      return { ...state, status: "authenticating", message: null };
    case "ACCESS_DENIED":
      return {
        status: "access_denied",
        email: state.email,
        message: "Esta conta ainda não tem acesso ao Brincar Educando."
      };
    case "MISCONFIGURED":
      return { status: "misconfigured", email: null, message: event.message };
    case "FAILED":
      return { status: "failed", email: null, message: event.message };
    case "RETRY":
      return { ...state, status: "booting", message: null };
    default: {
      const exhaustive: never = event;
      return exhaustive;
    }
  }
}

export function loginErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : "";

  if (message === "Invalid login credentials") {
    return "E-mail ou senha incorretos.";
  }

  if (message.toLowerCase().includes("network")) {
    return "Não foi possível conectar agora. Confira sua internet e tente novamente.";
  }

  return "Não foi possível entrar agora. Tente novamente.";
}
