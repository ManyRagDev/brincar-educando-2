"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Camera, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { createDiaryEntry } from "@/app/(dashboard)/actions";

const moods = [
  { emoji: "😊", label: "Feliz" },
  { emoji: "🌟", label: "Especial" },
  { emoji: "😄", label: "Animado" },
  { emoji: "🤗", label: "Carinhoso" },
  { emoji: "😌", label: "Tranquilo" },
  { emoji: "😢", label: "Difícil" },
  { emoji: "😠", label: "Desafiador" },
  { emoji: "😴", label: "Cansativo" },
];

const typeCopy = {
  livre: { title: "Escrever livremente", placeholder: "O que vocês querem lembrar?" },
  fala: { title: "Uma frase que ela disse", placeholder: "Escreva a frase e, se quiser, conte o contexto…" },
  descoberta: { title: "Uma descoberta", placeholder: "O que despertou curiosidade ou apareceu de um jeito novo?" },
  desafio: { title: "Um desafio de hoje", placeholder: "O que foi difícil? O que ajudou — ou o que vocês querem tentar depois?" },
  riso: { title: "Algo que fez rir", placeholder: "Guarde a cena engraçada do jeito que aconteceu…" },
  foto: { title: "Uma foto", placeholder: "Conte em uma linha o que esta foto ajuda a lembrar…" },
} as const;

type RegistrationType = keyof typeof typeCopy;

export function NewEntryForm({ childName, criancaId, registrationType }: { childName?: string | null; criancaId?: string | null; registrationType: RegistrationType }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [tags, setTags] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);

  async function handleSave() {
    if (!content.trim()) return;
    setIsSaving(true);
    setSaveError(null);

    const tagsArray = tags.split(",").map((t) => t.trim()).filter(Boolean);
    const result = await createDiaryEntry({
      childId: criancaId,
      title,
      content,
      mood: selectedMood,
      tags: tagsArray,
      registrationType,
    }, photo ?? undefined);

    if (!result.ok) {
      setSaveError(result.message);
      setIsSaving(false);
      return;
    }

    router.push("/diario");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/diario"
          className="flex items-center gap-2 text-sm font-semibold text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <h1 className="font-serif text-xl font-black text-[var(--color-foreground)]">
          {typeCopy[registrationType].title}
        </h1>
        <Button
          onClick={handleSave}
          disabled={isSaving || !content.trim()}
          size="sm"
          className="btn-primary-theme gap-1.5"
        >
          <Save className="h-3.5 w-3.5" />
          {isSaving ? "Salvando..." : "Salvar"}
        </Button>
      </div>

      {/* Mood selector */}
      <div>
        <Label className="text-xs font-black uppercase tracking-widest text-[var(--color-muted-foreground)] mb-3 block">
          Como foi o dia?
        </Label>
        <div className="flex gap-2 flex-wrap">
          {moods.map(({ emoji, label }) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setSelectedMood(emoji)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl border-2 transition-all ${
                selectedMood === emoji
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10"
                  : "border-[var(--color-border)] bg-[var(--color-card)]"
              }`}
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-[10px] font-bold text-[var(--color-muted-foreground)]">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Título (opcional)</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={childName ? `Ex: Primeira palavra do ${childName}!` : "Ex: Primeira palavra do Léo!"}
          className="bg-[var(--color-card)] border-[var(--color-border)] text-lg font-semibold"
        />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label htmlFor="content">O que aconteceu?</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={typeCopy[registrationType].placeholder}
          rows={8}
          className="bg-[var(--color-card)] border-[var(--color-border)] resize-none leading-relaxed"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="photo" className="flex items-center gap-2"><Camera className="size-4" />Foto privada (opcional)</Label>
        <Input
          id="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
        />
        <p className="text-xs text-[var(--color-muted-foreground)]">
          Até 5 MB. A foto fica em armazenamento privado, com acesso temporário apenas na conta da família. Ela não é usada para treinar modelos.
        </p>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="marcos, linguagem, sensorial..."
          className="bg-[var(--color-card)] border-[var(--color-border)]"
        />
        {/* Quick tag suggestions */}
        <div className="flex flex-wrap gap-2 mt-2">
          {["marcos", "linguagem", "motricidade", "emoções", "família", "brincadeira"].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                const current = tags.split(",").map((t) => t.trim()).filter(Boolean);
                if (!current.includes(tag)) {
                  setTags(current.length > 0 ? `${tags}, ${tag}` : tag);
                }
              }}
              className="px-3 py-1 rounded-full bg-[var(--color-muted)] text-xs font-bold text-[var(--color-muted-foreground)] hover:bg-[var(--color-border)] transition-colors"
            >
              +{tag}
            </button>
          ))}
        </div>
      </div>

      {saveError && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
          {saveError}
        </p>
      )}

      {/* Date info */}
      <p className="text-xs text-[var(--color-muted-foreground)] text-center">
        Registrado em {new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
      </p>
    </div>
  );
}
