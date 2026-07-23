/** Repairs strings that were accidentally decoded as Windows-1252/Latin-1. */
export function repairMojibake(value: string | null | undefined) {
  if (!value || !/[ÃÂâ]/.test(value)) return value ?? "";
  try {
    return decodeURIComponent(escape(value));
  } catch {
    return value;
  }
}

export function repairStringArray(values: unknown) {
  return Array.isArray(values)
    ? values.filter((item): item is string => typeof item === "string").map(repairMojibake)
    : [];
}
