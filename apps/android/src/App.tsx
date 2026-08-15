import { App as NativeApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import {
  IonApp,
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonSpinner,
  setupIonicReact
} from "@ionic/react";
import {
  compassOutline,
  gridOutline,
  heartOutline,
  homeOutline,
  sparklesOutline
} from "ionicons/icons";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { authReducer, initialAuthState, loginErrorMessage } from "./auth/auth-machine";
import { readPublicMobileConfig } from "./services/config";
import { createSessionGateway, type RestoreResult, type SessionGateway } from "./services/session-service";

setupIonicReact({ mode: "md" });

type Destination = "today" | "play" | "memories" | "more";

const destinations: Array<{ id: Destination; label: string; icon: string }> = [
  { id: "today", label: "Hoje", icon: homeOutline },
  { id: "play", label: "Brincar", icon: sparklesOutline },
  { id: "memories", label: "Memórias", icon: heartOutline },
  { id: "more", label: "Mais", icon: gridOutline }
];

function firstName(email: string | null): string {
  if (!email) return "família";
  return email.split("@")[0] || "família";
}

function greeting(): string {
  const hour = new Date().getHours();
  return hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
}

function resultToState(dispatch: React.Dispatch<Parameters<typeof authReducer>[1]>, result: RestoreResult) {
  switch (result.kind) {
    case "authenticated":
      dispatch({ type: "RESTORED", email: result.email });
      return;
    case "access_denied":
      dispatch({ type: "ACCESS_DENIED" });
      return;
    case "anonymous":
      dispatch({ type: "SIGNED_OUT" });
      return;
    default: {
      const exhaustive: never = result;
      return exhaustive;
    }
  }
}

function LoadingScreen() {
  return (
    <main className="screen screen-centered" aria-live="polite">
      <div className="brand-mark" aria-hidden="true">B</div>
      <IonSpinner name="crescent" color="primary" />
      <p>Preparando seu espaço.</p>
    </main>
  );
}

function LoginScreen({ gateway, onResult }: { gateway: SessionGateway; onResult: (result: RestoreResult) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    try {
      onResult(await gateway.signIn(email.trim(), password));
    } catch (error) {
      setMessage(loginErrorMessage(error));
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="screen login-screen">
      <div className="brand-mark" aria-hidden="true">B</div>
      <div className="login-heading">
        <p className="eyebrow">BRINCAR EDUCANDO</p>
        <h1>Bem-vindo de volta.</h1>
        <p>Continue de onde parou, com um passo de cada vez.</p>
      </div>
      <form className="login-form" onSubmit={submit}>
        <label htmlFor="email">E-mail</label>
        <IonInput id="email" type="email" inputMode="email" autocomplete="email" value={email} onIonInput={(event) => setEmail(event.detail.value ?? "")} required />
        <label htmlFor="password">Senha</label>
        <IonInput id="password" type="password" autocomplete="current-password" value={password} onIonInput={(event) => setPassword(event.detail.value ?? "")} required />
        {message ? <p className="inline-message error" role="alert">{message}</p> : null}
        <IonButton type="submit" expand="block" disabled={pending}>
          {pending ? "Entrando…" : "Entrar"}
        </IonButton>
      </form>
      <p className="login-help">Recuperação de senha e criação de conta chegam nas próximas entregas.</p>
    </main>
  );
}

function AccessDeniedScreen({ onSignOut }: { onSignOut: () => void }) {
  return (
    <main className="screen screen-centered">
      <div className="soft-icon" aria-hidden="true"><IonIcon icon={compassOutline} /></div>
      <p className="eyebrow">ACESSO PENDENTE</p>
      <h1>Esta conta ainda não está pronta para entrar.</h1>
      <p>Use uma conta já autorizada ou fale com o suporte para concluir o acesso.</p>
      <IonButton fill="outline" onClick={onSignOut}>Usar outra conta</IonButton>
    </main>
  );
}

function UnavailableScreen({ destination }: { destination: Destination }) {
  const title = destinations.find((item) => item.id === destination)?.label ?? "Esta área";
  return (
    <section className="unavailable-card" aria-live="polite">
      <IonIcon icon={compassOutline} aria-hidden="true" />
      <p className="eyebrow">VERSÃO DE DESENVOLVIMENTO</p>
      <h2>{title} chega em breve aqui.</h2>
      <p>Esta primeira entrega prepara sessão, retorno rápido e uma navegação de aplicativo. O conteúdo dessa área será migrado nas próximas fases.</p>
    </section>
  );
}

function TodayScreen({ email }: { email: string | null }) {
  return (
    <section className="today-screen">
      <header className="today-header">
        <div>
          <p className="eyebrow">UM MOMENTO DE CADA VEZ</p>
          <h1>{greeting()}, {firstName(email)}.</h1>
        </div>
        <div className="avatar" aria-label="Perfil da família">{firstName(email).slice(0, 1).toUpperCase()}</div>
      </header>
      <div className="now-thread" aria-hidden="true"><span /></div>
      <article className="next-step-card">
        <p className="eyebrow">SEU PRÓXIMO PASSO</p>
        <h2>Como está o momento por aí?</h2>
        <p>A experiência personalizada de Hoje chega na próxima entrega. Por enquanto, esta versão já cuida da entrada e do retorno ao aplicativo.</p>
        <IonButton fill="clear">Explorar esta versão <span aria-hidden="true">→</span></IonButton>
      </article>
      <section className="foundation-note">
        <IonIcon icon={sparklesOutline} aria-hidden="true" />
        <div>
          <h2>Nesta versão</h2>
          <p>Sessão segura, abertura direta e navegação contínua — sem landing page.</p>
        </div>
      </section>
    </section>
  );
}

function AuthenticatedShell({ email, onSignOut }: { email: string | null; onSignOut: () => void }) {
  const [destination, setDestination] = useState<Destination>("today");

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const listener = NativeApp.addListener("backButton", () => {
      if (destination !== "today") {
        setDestination("today");
        return;
      }
      void NativeApp.exitApp();
    });

    return () => {
      void listener.then((handle) => handle.remove());
    };
  }, [destination]);

  return (
    <main className="app-shell">
      <IonContent fullscreen className="app-content">
        {destination === "today" ? <TodayScreen email={email} /> : <UnavailableScreen destination={destination} />}
        {destination === "more" ? <button className="sign-out-link" type="button" onClick={onSignOut}>Sair desta conta</button> : null}
      </IonContent>
      <nav className="bottom-navigation" aria-label="Navegação principal">
        {destinations.map((item) => (
          <button key={item.id} type="button" className={destination === item.id ? "active" : ""} aria-current={destination === item.id ? "page" : undefined} onClick={() => setDestination(item.id)}>
            <IonIcon icon={item.icon} aria-hidden="true" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </main>
  );
}

export default function App() {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  const config = useMemo(() => readPublicMobileConfig(), []);
  const gateway = useMemo(() => (config ? createSessionGateway(config) : null), [config]);

  const restore = useCallback(async () => {
    if (!gateway) {
      dispatch({ type: "MISCONFIGURED", message: "A configuração pública do aplicativo está incompleta." });
      return;
    }

    try {
      resultToState(dispatch, await gateway.restore());
    } catch {
      dispatch({ type: "FAILED", message: "Não foi possível restaurar sua sessão agora." });
    }
  }, [gateway]);

  useEffect(() => {
    void restore();
  }, [restore]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const listener = NativeApp.addListener("appStateChange", ({ isActive }) => {
      if (isActive && state.status === "authenticated") {
        void restore();
      }
    });

    return () => {
      void listener.then((handle) => handle.remove());
    };
  }, [restore, state.status]);

  const signOut = useCallback(async () => {
    try {
      await gateway?.signOut();
    } finally {
      dispatch({ type: "SIGNED_OUT" });
    }
  }, [gateway]);

  if (state.status === "booting" || state.status === "authenticating") {
    return <IonApp><LoadingScreen /></IonApp>;
  }

  if (state.status === "misconfigured" || state.status === "failed") {
    return (
      <IonApp>
        <main className="screen screen-centered">
          <div className="soft-icon" aria-hidden="true"><IonIcon icon={compassOutline} /></div>
          <h1>Não foi possível preparar o aplicativo.</h1>
          <p>{state.message}</p>
          <IonButton fill="outline" onClick={() => { dispatch({ type: "RETRY" }); void restore(); }}>Tentar novamente</IonButton>
        </main>
      </IonApp>
    );
  }

  if (state.status === "access_denied") {
    return <IonApp><AccessDeniedScreen onSignOut={() => void signOut()} /></IonApp>;
  }

  if (state.status === "authenticated") {
    return <IonApp><AuthenticatedShell email={state.email} onSignOut={() => void signOut()} /></IonApp>;
  }

  if (!gateway) {
    return null;
  }

  return <IonApp><LoginScreen gateway={gateway} onResult={(result) => resultToState(dispatch, result)} /></IonApp>;
}
