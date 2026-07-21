import { notFound } from "next/navigation";
import { StoryReader } from "@/components/stories/StoryReader";
import { requireAppUser } from "@/lib/auth/require-app-user";
import { getActiveChild } from "@/lib/children/active-child";

export default async function StoryReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const { supabase, user } = await requireAppUser(); const { activeChild } = await getActiveChild(supabase, user.id); if (!activeChild) notFound();
  const { data: story } = await supabase.from("historias").select("id, titulo, descricao, proposta_familiar, linguagem_acessivel, conteudo_versao, historias_textos(ordem, titulo_pagina, conteudo, texto_alternativo, prompt_pausa), historias_prompts(tipo, pergunta, orientacao_adulto, ordem), historias_extensoes(titulo, descricao, tipo, materiais, duracao_minutos, ordem)").eq("slug", id).eq("publicado", true).maybeSingle();
  if (!story) notFound();
  const pages = story.historias_textos ?? [];
  const prompts = story.historias_prompts as unknown as { tipo: string; pergunta: string; orientacao_adulto: string | null; ordem: number }[];
  const extensions = story.historias_extensoes as unknown as { titulo: string; descricao: string; tipo: string; materiais: string[]; duracao_minutos: number | null; ordem: number }[];
  return <StoryReader childId={activeChild.id} childName={activeChild.nome} story={{ ...story, pages: [...pages].sort((a,b)=>a.ordem-b.ordem), prompts: [...prompts].sort((a,b)=>a.ordem-b.ordem), extensions: [...extensions].sort((a,b)=>a.ordem-b.ordem) }} />;
}
