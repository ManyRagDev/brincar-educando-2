import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

const env = fs.readFileSync(".env.local", "utf8");
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=["']?(.*?)["']?$/m)?.[1]?.trim();

const client = createClient(url, key);
const supabase = client.schema("brincareducando");

const MOJIBAKE_REGEX = /(?:Ã[\x80-\xBF]|Â[\x80-\xBF]|â[\x80-\xBF]{2}|[\uFFFD])/;

async function checkTable(table, fields) {
  const { data, error } = await supabase.from(table).select("*").limit(500);
  if (error) {
    console.log("Error querying table", table, error.message);
    return;
  }
  if (!data) return;
  let count = 0;
  for (const row of data) {
    for (const field of fields) {
      const val = row[field];
      if (typeof val === "string" && MOJIBAKE_REGEX.test(val)) {
        console.log(`[MOJIBAKE] Table ${table} | ID: ${row.id || row.slug} | Field: ${field}`);
        console.log("  Value:", val.slice(0, 120));
        count++;
      } else if (Array.isArray(val)) {
        val.forEach((item, idx) => {
          if (typeof item === "string" && MOJIBAKE_REGEX.test(item)) {
            console.log(`[MOJIBAKE] Table ${table} | ID: ${row.id || row.slug} | Field: ${field}[${idx}]`);
            console.log("  Value:", item.slice(0, 120));
            count++;
          }
        });
      }
    }
  }
  console.log(`Table ${table}: ${data.length} rows checked, ${count} mojibake instances found.`);
}

async function run() {
  await checkTable("atividades", ["titulo", "descricao", "resumo", "justificativa_fase", "materiais", "passos", "beneficios", "habilidades"]);
  await checkTable("historias", ["titulo", "descricao", "conteudo"]);
  await checkTable("desenvolvimento_marcos", ["titulo", "descricao", "categoria"]);
  await checkTable("criancas", ["nome", "interesses"]);
  console.log("Database scan finished.");
}

run().catch(console.error);
