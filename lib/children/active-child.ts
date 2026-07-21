import "server-only";

import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@/lib/supabase/database.types";
import { resolveActiveChild } from "@/lib/children/resolve-active-child";

export const ACTIVE_CHILD_COOKIE = "brincar_educando_active_child";

export type Child = Tables<"criancas">;
export type ChildSummary = Pick<
  Child,
  "id" | "nome" | "data_nascimento" | "genero" | "avatar_id" | "cor_favorita" | "interesses"
>;

type AppClient = SupabaseClient<Database, "brincareducando">;

export async function getActiveChild(supabase: AppClient, userId: string) {
  const cookieStore = await cookies();
  const requestedChildId = cookieStore.get(ACTIVE_CHILD_COOKIE)?.value;
  const { data, error } = await supabase
    .from("criancas")
    .select("id, nome, data_nascimento, genero, avatar_id, cor_favorita, interesses")
    .eq("usuario_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error("Não foi possível carregar os perfis infantis.", { cause: error });
  }

  const children = data ?? [];
  const { activeChild, needsSelection } = resolveActiveChild(children, requestedChildId);

  return {
    activeChild,
    children,
    needsSelection,
  };
}
