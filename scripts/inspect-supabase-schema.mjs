import { readFile } from "node:fs/promises";

const envText = await readFile(new URL("../.env.local", import.meta.url), "utf8");
const env = Object.fromEntries(
  envText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const separator = line.indexOf("=");
      return [line.slice(0, separator), line.slice(separator + 1).replace(/^['"]|['"]$/g, "")];
    }),
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY são obrigatórias.");
}

const response = await fetch(`${url}/rest/v1/`, {
  headers: {
    apikey: anonKey,
    Accept: "application/openapi+json",
    "Accept-Profile": "brincareducando",
  },
});

if (!response.ok) {
  const body = await response.text();
  let detail = "resposta sem detalhe";
  try {
    const parsed = JSON.parse(body);
    detail = parsed.message ?? parsed.hint ?? parsed.code ?? detail;
  } catch {
    // Não imprimir a resposta bruta de um serviço remoto.
  }
  throw new Error(`Falha ao consultar o schema exposto (${response.status}): ${detail}`);
}

const document = await response.json();
const definitions = document.definitions ?? document.components?.schemas ?? {};
const sanitized = Object.fromEntries(
  Object.entries(definitions).map(([name, definition]) => [
    name,
    Object.fromEntries(
      Object.entries(definition.properties ?? {}).map(([property, details]) => [
        property,
        {
          type: details.type ?? null,
          format: details.format ?? null,
          nullable: details.nullable ?? !definition.required?.includes(property),
        },
      ]),
    ),
  ]),
);

process.stdout.write(`${JSON.stringify(sanitized, null, 2)}\n`);
