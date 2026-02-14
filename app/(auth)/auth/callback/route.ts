import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      // Sincronizar metadados se for o primeiro login via Google ou faltar o app_id
      const currentAppId = data.user.user_metadata?.app_id;

      if (currentAppId !== "brincareducando") {
        await supabase.auth.updateUser({
          data: {
            app_id: "brincareducando",
            // Garantir que o nome venha do Google se for novo
            nome: data.user.user_metadata?.full_name || data.user.user_metadata?.name
          }
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return user to error page or signin
  return NextResponse.redirect(`${origin}/auth?error=auth_callback_failed`);
}
