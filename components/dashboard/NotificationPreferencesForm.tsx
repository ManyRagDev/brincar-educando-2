"use client";

import { useEffect, useState } from "react";
import { Bell, HeartHandshake, BookMarked, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function NotificationPreferencesForm({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(true);
  const [prefs, setPrefs] = useState({
    convites_brincadeiras: true,
    lembretes_diario: true,
    novidades_fase: true,
  });

  useEffect(() => {
    async function loadPreferences() {
      const supabase = createClient();
      const { data } = (await supabase
        .from("usuario_notificacao_preferencias" as any)
        .select("convites_brincadeiras, lembretes_diario, novidades_fase")
        .eq("usuario_id", userId)
        .maybeSingle()) as { data: any };

      if (data) {
        setPrefs({
          convites_brincadeiras: data.convites_brincadeiras ?? true,
          lembretes_diario: data.lembretes_diario ?? true,
          novidades_fase: data.novidades_fase ?? true,
        });
      }
      setLoading(false);
    }
    loadPreferences();
  }, [userId]);

  const togglePreference = async (key: keyof typeof prefs) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);

    const supabase = createClient();
    try {
      await supabase.from("usuario_notificacao_preferencias" as any).upsert({
        usuario_id: userId,
        ...updated,
        atualizado_em: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Erro ao salvar preferência de notificação:", err);
    }
  };

  if (loading) {
    return <div className="p-4 text-xs text-[var(--color-muted-foreground)]">Carregando preferências...</div>;
  }

  return (
    <div className="space-y-3">
      {/* Convites de Brincadeira */}
      <div className="card-theme p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
            <HeartHandshake className="h-5 w-5 text-[var(--color-primary)]" />
          </div>
          <div>
            <p className="font-semibold text-[var(--color-foreground)]">Convites de Brincadeira</p>
            <p className="text-xs text-[var(--color-muted-foreground)]">Ideias leves nos fins de semana</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={prefs.convites_brincadeiras}
            onChange={() => togglePreference("convites_brincadeiras")}
          />
          <div className="w-11 h-6 bg-[var(--color-muted)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]" />
        </label>
      </div>

      {/* Lembretes do Diário */}
      <div className="card-theme p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-secondary)]/10 flex items-center justify-center">
            <BookMarked className="h-5 w-5 text-[var(--color-secondary)]" />
          </div>
          <div>
            <p className="font-semibold text-[var(--color-foreground)]">Lembretes do Diário</p>
            <p className="text-xs text-[var(--color-muted-foreground)]">Convite carinhoso para guardar uma fala ou foto</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={prefs.lembretes_diario}
            onChange={() => togglePreference("lembretes_diario")}
          />
          <div className="w-11 h-6 bg-[var(--color-muted)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]" />
        </label>
      </div>

      {/* Novidades da Fase */}
      <div className="card-theme p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <p className="font-semibold text-[var(--color-foreground)]">Novidades da Fase</p>
            <p className="text-xs text-[var(--color-muted-foreground)]">Avisos ao completar cada mês de vida</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={prefs.novidades_fase}
            onChange={() => togglePreference("novidades_fase")}
          />
          <div className="w-11 h-6 bg-[var(--color-muted)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]" />
        </label>
      </div>
    </div>
  );
}
