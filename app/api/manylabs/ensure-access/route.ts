import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureBrincarEducandoAccessResult } from "@/lib/supabase/manylabs";

export async function POST() {
  console.info("[ManyLabs] ensure-access route invoked", {
    hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  });

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.warn("[ManyLabs] ensure-access unauthorized", {
      hasError: Boolean(error),
      errorMessage: error?.message,
    });
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const accessResult = await ensureBrincarEducandoAccessResult(user);

  if (!accessResult.ok) {
    console.warn("[ManyLabs] ensure-access denied", {
      userId: user.id,
      email: user.email,
      reason: accessResult.reason,
      message: accessResult.message,
    });

    if (accessResult.reason === "server_not_configured") {
      return NextResponse.json(
        { error: "manylabs_server_not_configured" },
        { status: 500 }
      );
    }

    if (accessResult.reason === "rpc_failed") {
      return NextResponse.json(
        { error: "manylabs_rpc_failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "brincareducando_access_required" },
      { status: 403 }
    );
  }

  console.info("[ManyLabs] ensure-access granted", {
    userId: user.id,
    email: user.email,
  });

  return NextResponse.json({ ok: true });
}
