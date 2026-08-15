/**
 * Sanitizador e reparador universal de caracteres UTF-8 corrompidos (Mojibake).
 * Converte sequências UTF-8 que foram interpretadas como Latin-1/Windows-1252 de volta para caracteres legítimos.
 * Seguro contra emojis, pontuação especial (travessões, aspas) e strings já corretas.
 */

const MOJIBAKE_PATTERN = /(?:Ã[\x80-\xBF]|Â[\x80-\xBF]|â[\x80-\xBF]{2}|[\uFFFD])/;

// Mapa de substituição determinístico para padrões comuns de mojibake em língua portuguesa
const MOJIBAKE_MAP: Record<string, string> = {
  "Ã¡": "á",
  "Ã©": "é",
  "Ã­": "í",
  "Ã³": "ó",
  "Ãº": "ú",
  "Ã£": "ã",
  "Ãµ": "õ",
  "Ã¢": "â",
  "Ãª": "ê",
  "Ã®": "î",
  "Ã´": "ô",
  "Ã»": "û",
  "Ã§": "ç",
  "Ã€": "À",
  "Ã‰": "É",
  "Ã": "Í",
  "Ã“": "Ó",
  "Ãš": "Ú",
  "Ãƒ": "Ã",
  "Ã•": "Õ",
  "Ã‚": "Â",
  "ÃŠ": "Ê",
  "ÃŽ": "Î",
  "Ã”": "Ô",
  "Ã›": "Û",
  "Ã‡": "Ç",
  "â€“": "–",
  "â€”": "—",
  "â€˜": "‘",
  "â€™": "’",
  "â€œ": "“",
  "â€": "”",
  "â€¢": "•",
  "â€¦": "…",
  "Â°": "°",
  "Âª": "ª",
  "Âº": "º",
  "Â§": "§",
  "Â ": " ",
};

export function repairMojibake(value: string | null | undefined): string {
  if (!value) return value ?? "";
  if (typeof value !== "string") return String(value);

  // Se não contém nenhum padrão suspeito, retorna imediatamente
  if (!MOJIBAKE_PATTERN.test(value)) {
    return value;
  }

  let result = value;

  // 1. Tenta decodificação por buffer Latin1 -> UTF8 quando toda a string é puramente Latin1 mal decodificado
  try {
    const latin1Buffer = Buffer.from(value, "binary");
    const utf8Decoded = latin1Buffer.toString("utf8");
    // Se a decodificação reduziu ou eliminou os caracteres suspeitos sem introduzir substituições inválidas (\uFFFD)
    if (!utf8Decoded.includes("\uFFFD") && !MOJIBAKE_PATTERN.test(utf8Decoded)) {
      return utf8Decoded;
    }
  } catch {
    // Fallback para substituição de dicionário
  }

  // 2. Aplicação do mapa determinístico
  for (const [corrupted, clean] of Object.entries(MOJIBAKE_MAP)) {
    if (result.includes(corrupted)) {
      result = result.replaceAll(corrupted, clean);
    }
  }

  return result;
}

export function repairStringArray(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return values
    .filter((item): item is string => typeof item === "string")
    .map(repairMojibake);
}

/**
 * Sanitiza recursivamente strings, arrays e objetos JSON.
 */
export function repairDeep<T>(input: T): T {
  if (input === null || input === undefined) {
    return input;
  }

  if (typeof input === "string") {
    return repairMojibake(input) as unknown as T;
  }

  if (Array.isArray(input)) {
    return input.map((item) => repairDeep(item)) as unknown as T;
  }

  if (typeof input === "object") {
    const copy: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      copy[key] = repairDeep(value);
    }
    return copy as T;
  }

  return input;
}
