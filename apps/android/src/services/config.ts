export type PublicMobileConfig = {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

type PublicEnv = {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
};

export function readPublicMobileConfig(env: PublicEnv = import.meta.env as PublicEnv): PublicMobileConfig | null {
  const supabaseUrl = env.VITE_SUPABASE_URL?.trim();
  const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY?.trim();

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return { supabaseUrl, supabaseAnonKey };
}
