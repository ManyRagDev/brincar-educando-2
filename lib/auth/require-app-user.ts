import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireAppUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { data: hasAccess, error } = await supabase.rpc(
    "current_user_has_manylabs_app_access",
  );

  if (error || hasAccess !== true) redirect("/auth/access-denied");

  return { supabase, user };
}

