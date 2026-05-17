import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureBrincarEducandoAccess } from "@/lib/supabase/manylabs";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const hasAccess = await ensureBrincarEducandoAccess(user);

  if (!hasAccess) {
    return NextResponse.json(
      { error: "brincareducando_access_required" },
      { status: 403 }
    );
  }

  return NextResponse.json({ ok: true });
}
