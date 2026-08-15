import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import { repairMojibake, repairDeep } from "../lib/text/repair-mojibake.ts";

const env = fs.readFileSync(".env.local", "utf8");
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=["']?(.*?)["']?$/m)?.[1]?.trim();

const client = createClient(url, key);
const supabase = client.schema("brincareducando");

async function fixAtividades() {
  console.log("Consultando tabela brincareducando.atividades...");
  const { data: rows, error } = await supabase.from("atividades").select("*");
  if (error) {
    console.error("Erro ao buscar atividades:", error);
    return;
  }

  console.log(`Encontradas ${rows.length} atividades. Analisando e corrigindo campos...`);

  let updatedCount = 0;

  for (const row of rows) {
    const original = JSON.stringify(row);
    const updatedPayload = {};

    for (const [col, val] of Object.entries(row)) {
      if (col === "id" || col === "created_at" || col === "updated_at") continue;

      if (typeof val === "string") {
        updatedPayload[col] = repairMojibake(val);
      } else if (Array.isArray(val) || (typeof val === "object" && val !== null)) {
        updatedPayload[col] = repairDeep(val);
      } else {
        updatedPayload[col] = val;
      }
    }

    if (JSON.stringify({ ...row, ...updatedPayload }) !== original) {
      const { error: updateError } = await supabase
        .from("atividades")
        .update(updatedPayload)
        .eq("id", row.id);

      if (updateError) {
        console.error(`Erro ao atualizar atividade ${row.id}:`, updateError.message);
      } else {
        updatedCount++;
        console.log(`✓ Atividade corrigida: [${row.slug}]`);
      }
    }
  }

  console.log(`\nConcluído! ${updatedCount} atividades foram higienizadas e atualizadas no Supabase.`);
}

fixAtividades().catch(console.error);
