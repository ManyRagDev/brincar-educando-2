"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BookOpen, Clock3, Pencil, Trash2 } from "lucide-react";
import { deleteActivityExecution, deleteDiaryEntry, updateDiaryEntry } from "@/app/(dashboard)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type UnifiedDiaryItem =
  | { kind: "memory"; id: string; childId: string; date: string; title: string | null; content: string; mood: string | null; tags: string[]; registrationType: string; imageUrl: string | null }
  | { kind: "activity"; id: string; childId: string; date: string; title: string; category: string; durationMinutes: number | null; perception: string | null; observedSignals: string[]; note: string | null; endReason: string | null }
  | { kind: "story"; id: string; childId: string; date: string; title: string; completed: boolean; progressSeconds: number | null };

const typeLabels: Record<string, string> = { livre: "Memória", fala: "Fala", descoberta: "Descoberta", desafio: "Desafio", riso: "Fez rir", foto: "Foto" };

export function UnifiedDiaryTimeline({ items }: { items: UnifiedDiaryItem[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Extract<UnifiedDiaryItem, { kind: "memory" }> | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function startEditing(item: Extract<UnifiedDiaryItem, { kind: "memory" }>) {
    setEditing(item); setEditTitle(item.title ?? ""); setEditContent(item.content); setError(null);
  }

  async function saveEdit() {
    if (!editing) return;
    const result = await updateDiaryEntry(editing.id, { childId: editing.childId, title: editTitle, content: editContent, mood: editing.mood, tags: editing.tags, registrationType: editing.registrationType });
    if (!result.ok) { setError(result.message); return; }
    setEditing(null); router.refresh();
  }

  async function remove(item: UnifiedDiaryItem) {
    if (item.kind === "story") return;
    const result = item.kind === "memory" ? await deleteDiaryEntry(item.id, item.childId) : await deleteActivityExecution(item.id, item.childId);
    if (!result.ok) { setError(result.message); return; }
    setConfirmDelete(null); router.refresh();
  }

  if (items.length === 0) return <div className="mt-4 rounded-3xl border border-dashed border-[var(--color-border)] p-8 text-center text-sm text-[var(--color-muted-foreground)]">O diário ainda está vazio. Um registro curto já é suficiente para começar.</div>;

  return (
    <div className="mt-5 space-y-4">
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
      {items.map((item) => (
        <article key={`${item.kind}:${item.id}`} className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <div className="flex items-start justify-between gap-3">
            <div><p className="text-xs font-black uppercase tracking-wide text-[var(--color-primary)]">{item.kind === "memory" ? typeLabels[item.registrationType] ?? "Memória" : item.kind === "activity" ? "Brincadeira" : "História"}</p><h3 className="mt-1 text-lg font-black">{item.kind === "memory" ? item.title ?? "Um momento de vocês" : item.title}</h3><p className="mt-1 text-xs text-[var(--color-muted-foreground)]">{new Date(item.date).toLocaleString("pt-BR", { dateStyle: "medium", timeStyle: "short" })}</p></div>
            {item.kind !== "story" && <div className="flex gap-1">{item.kind === "memory" && <button type="button" className="grid size-11 place-items-center rounded-full hover:bg-[var(--color-muted)]" onClick={() => startEditing(item)} aria-label="Editar memória"><Pencil className="size-4" /></button>}<button type="button" className="grid size-11 place-items-center rounded-full text-red-700 hover:bg-red-50" onClick={() => setConfirmDelete(item.id)} aria-label="Excluir registro"><Trash2 className="size-4" /></button></div>}
          </div>
          {item.kind === "memory" ? <><p className="mt-4 whitespace-pre-wrap text-sm leading-6">{item.content}</p>{item.imageUrl && <div className="relative mt-4 aspect-video overflow-hidden rounded-2xl"><Image src={item.imageUrl} alt="Foto privada desta memória" fill sizes="(min-width: 768px) 640px, 100vw" className="object-cover" /></div>}</> : item.kind === "activity" ? <><p className="mt-3 text-sm text-[var(--color-muted-foreground)]">{item.perception === "gostou" ? "Pareceu um bom momento" : item.perception === "mais_ou_menos" ? "Foi mais ou menos" : item.perception === "nao_era_o_momento" ? "Não era o momento" : "Sem percepção registrada"}</p>{item.observedSignals.length > 0 && <p className="mt-2 text-sm"><strong>Chamou atenção:</strong> {item.observedSignals.map((signal) => signal.replaceAll("_", " ")).join(", ")}.</p>}{item.note && <p className="mt-2 rounded-2xl bg-[var(--color-muted)] p-3 text-sm">“{item.note}”</p>}{item.durationMinutes !== null && <p className="mt-2 flex items-center gap-1 text-xs text-[var(--color-muted-foreground)]"><Clock3 className="size-3" />{item.durationMinutes} min registrados</p>}</> : <p className="mt-3 flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]"><BookOpen className="size-4" />{item.completed ? "Leitura concluída em família" : item.progressSeconds ? "Leitura iniciada — pode continuar quando quiserem" : "História aberta em família"}</p>}
          {confirmDelete === item.id && <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-950"><p className="font-bold">Excluir definitivamente este registro?</p><p className="mt-1">Essa ação não pode ser desfeita{item.kind === "memory" ? " e também apaga a foto privada" : ""}.</p><div className="mt-3 flex gap-2"><Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancelar</Button><Button variant="destructive" onClick={() => void remove(item)}>Excluir</Button></div></div>}
        </article>
      ))}

      {editing && <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"><section role="dialog" aria-modal="true" aria-labelledby="edit-memory-title" className="w-full max-w-lg rounded-3xl bg-[var(--color-card)] p-6"><h2 id="edit-memory-title" className="text-xl font-black">Editar memória</h2><Input className="mt-4" value={editTitle} onChange={(event) => setEditTitle(event.target.value)} placeholder="Título (opcional)" /><Textarea className="mt-3 min-h-40" value={editContent} onChange={(event) => setEditContent(event.target.value)} /><div className="mt-4 flex justify-end gap-2"><Button variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button><Button onClick={() => void saveEdit()} disabled={!editContent.trim()}>Salvar alterações</Button></div></section></div>}
    </div>
  );
}
