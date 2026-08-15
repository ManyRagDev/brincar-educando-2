import { Preferences } from "@capacitor/preferences";
import { createClient, type User } from "@supabase/supabase-js";
import type { PublicMobileConfig } from "./config";

type AsyncStorage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

const capacitorStorage: AsyncStorage = {
  async getItem(key) {
    const { value } = await Preferences.get({ key });
    return value;
  },
  async setItem(key, value) {
    await Preferences.set({ key, value });
  },
  async removeItem(key) {
    await Preferences.remove({ key });
  }
};

export type RestoreResult =
  | { kind: "anonymous" }
  | { kind: "authenticated"; email: string }
  | { kind: "access_denied" };

export type SessionGateway = {
  restore: () => Promise<RestoreResult>;
  signIn: (email: string, password: string) => Promise<RestoreResult>;
  signOut: () => Promise<void>;
};

function displayEmail(user: User): string {
  return user.email ?? "sua conta";
}

export function createSessionGateway(config: PublicMobileConfig): SessionGateway {
  const client = createClient(config.supabaseUrl, config.supabaseAnonKey, {
    db: { schema: "brincareducando" },
    auth: {
      storage: capacitorStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    }
  });

  async function hasAppAccess(): Promise<boolean> {
    const { data, error } = await client
      .schema("brincareducando")
      .rpc("current_user_has_manylabs_app_access");

    return !error && data === true;
  }

  async function validateCurrentUser(): Promise<RestoreResult> {
    const {
      data: { user },
      error
    } = await client.auth.getUser();

    if (error || !user) {
      return { kind: "anonymous" };
    }

    return (await hasAppAccess())
      ? { kind: "authenticated", email: displayEmail(user) }
      : { kind: "access_denied" };
  }

  return {
    async restore() {
      const {
        data: { session }
      } = await client.auth.getSession();

      return session ? validateCurrentUser() : { kind: "anonymous" };
    },
    async signIn(email, password) {
      const { error } = await client.auth.signInWithPassword({ email, password });
      if (error) {
        throw error;
      }

      return validateCurrentUser();
    },
    async signOut() {
      const { error } = await client.auth.signOut();
      if (error) {
        throw error;
      }
    }
  };
}
