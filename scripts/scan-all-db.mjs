import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

const env = fs.readFileSync(".env.local", "utf8");
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=["']?(.*?)["']?$/m)?.[1]?.trim();

const client = createClient(url, key);

const MOJIBAKE_REGEX = /(?:Ã[\x80-\xBF]|Â[\x80-\xBF]|â[\x80-\xBF]{2}|[\uFFFD])/;

const tables = [
  "atividades",
  "historias",
  "criancas",
  "diario_entradas",
  "atividades_execucoes",
  "historico",
  "perfis",
  "artigos",
  "orientacoes",
  "recommendation_events",
  "recommendation_feedback"
];

async function scanAll() {
  console.log("Iniciando varredura completa do banco de dados...");
  
  for (const table of tables) {
    try {
      const { data, error } = await client.schema("brincareducando").from(table).select("*").limit(1000);
      if (error) {
        // Tenta no schema public
        const pubRes = await client.from(table).select("*").limit(1000);
        if (pubRes.error) {
          continue;
        }
        checkRows(table + " (public)", pubRes.data);
      } else {
        checkRows(table + " (brincareducando)", data);
      }
    } catch (err) {
      // Ignora erro
    }
  }
}

function checkRows(tableName, rows) {
  if (!rows || rows.length === 0) return;
  let corruptedCount = 0;
  const issues = [];

  for (const row of rows) {
    for (const [key, val] of Object.entries(row)) {
      if (typeof val === "string" && MOJIBAKE_REGEX.test(val)) {
        corruptedCount++;
        issues.push({ id: row.id || row.slug, key, val: val.slice(0, 100) });
      } else if (Array.isArray(val)) {
        val.forEach((item, idx) => {
          if (typeof item === "string" && MOJIBAKE_REGEX.test(item)) {
            corruptedCount++;
            issues.push({ id: row.id || row.slug, key: `${key}[${idx}]`, val: item.slice(0, 100) });
          }
        });
      } else if (typeof val === "object" && val !== null) {
        const jsonStr = JSON.stringify(val);
        if (MOJIBAKE_REGEX.test(jsonStr)) {
          corruptedCount++;
          issues.push({ id: row.id || row.slug, key: `${key} (json)`, val: jsonStr.slice(0, 100) });
        }
      }
    }
  }

  console.log(`[${tableName}] Linhas: ${rows.length} | Ocorrências de Mojibake: ${corruptedCount}`);
  if (issues.length > 0) {
    issues.slice(0, 5).forEach((iss) => {
      console.log(`   -> [${iss.id}] ${iss.key}: ${iss.val}`);
    });
  }
}

scanAll().catch(console.error);
