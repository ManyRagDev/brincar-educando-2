import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  ensureBrincarEducandoAccessResult,
  getManyLabsEnvironmentDiagnostics,
} from "@/lib/supabase/manylabs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const envDiagnostics = getManyLabsEnvironmentDiagnostics();

  console.info("[ManyLabs] ensure-access route invoked", {
    ...envDiagnostics,
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
        {
          error: "manylabs_server_not_configured",
          diagnostics: accessResult.diagnostics ?? envDiagnostics,
        },
        { status: 500 }
      );
    }

    if (accessResult.reason === "rpc_failed") {
      return NextResponse.json(
        {
          error: "manylabs_rpc_failed",
          diagnostics: envDiagnostics,
        },
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
