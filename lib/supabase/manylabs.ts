import "server-only";

import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

type ManyLabsDatabase = {
  brincareducando: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
    Functions: {
      ensure_manylabs_app_access: {
        Args: {
          p_user_id: string;
          p_email: string | null;
          p_display_name: string | null;
        };
        Returns: boolean;
      };
      has_manylabs_app_access: {
        Args: {
          p_user_id: string;
        };
        Returns: boolean;
      };
    };
  };
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let adminClient: SupabaseClient<ManyLabsDatabase> | null = null;

export type ManyLabsAccessResult =
  | { ok: true }
  | { ok: false; reason: "server_not_configured" | "rpc_failed" | "access_denied"; message?: string };

function getAdminClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("ManyLabs admin Supabase environment is not configured");
  }

  if (!adminClient) {
    adminClient = createClient<ManyLabsDatabase>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return adminClient;
}

export function getManyLabsDisplayName(user: User): string | null {
  const metadata = user.user_metadata ?? {};
  const name =
    metadata.full_name ??
    metadata.name ??
    metadata.nome ??
    metadata.display_name ??
    null;

  return typeof name === "string" && name.trim() ? name.trim() : null;
}

export async function ensureBrincarEducandoAccessResult(user: User): Promise<ManyLabsAccessResult> {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .schema("brincareducando")
      .rpc("ensure_manylabs_app_access", {
        p_user_id: user.id,
        p_email: user.email ?? null,
        p_display_name: getManyLabsDisplayName(user),
      });

    if (error) {
      console.error("[ManyLabs] ensure_manylabs_app_access failed:", error.message);
      return { ok: false, reason: "rpc_failed", message: error.message };
    }

    if (data !== true) {
      return { ok: false, reason: "access_denied" };
    }

    return { ok: true };
  } catch (error) {
    console.error("[ManyLabs] ensure access unexpected failure:", error);

    if (error instanceof Error && error.message.includes("environment is not configured")) {
      return { ok: false, reason: "server_not_configured", message: error.message };
    }

    return {
      ok: false,
      reason: "rpc_failed",
      message: error instanceof Error ? error.message : "Unexpected ManyLabs access failure",
    };
  }
}

export async function ensureBrincarEducandoAccess(user: User): Promise<boolean> {
  const result = await ensureBrincarEducandoAccessResult(user);
  return result.ok;
}

export async function hasBrincarEducandoAccess(userId: string): Promise<boolean> {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .schema("brincareducando")
      .rpc("has_manylabs_app_access", {
        p_user_id: userId,
      });

    if (error) {
      console.error("[ManyLabs] has_manylabs_app_access failed:", error.message);
      return false;
    }

    return data === true;
  } catch (error) {
    console.error("[ManyLabs] has access unexpected failure:", error);
    return false;
  }
}
