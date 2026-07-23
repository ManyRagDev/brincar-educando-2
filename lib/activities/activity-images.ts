const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const categoryImages: Record<string, string> = {
  sensorial: "/images/activities/sensorial.png",
  criativa: "/images/activities/criativa.png",
  cognitiva: "/images/activities/cognitiva.png",
  movimento: "/images/activities/movimento.png",
  "ao ar livre": "/images/activities/ao-ar-livre.png",
};

const individualRasterImages = new Set([
  "bate-pausa-escuta",
  "cabana-aberta-de-caixa",
  "caca-aos-pares-na-gaveta-de-meias",
  "caca-as-letras-do-proprio-nome",
  "caixa-de-sons-da-cozinha",
]);

export function getActivityImagePath({
  titulo,
  categoria,
}: {
  titulo?: string | null;
  categoria?: string | null;
}) {
  const title = titulo?.toLocaleLowerCase() ?? "";
  const activitySlug = slugify(title);
  if (activitySlug === "torre-de-potes-e-panelas") return "/panelas.png";
  if (individualRasterImages.has(activitySlug)) return `/images/activities/${activitySlug}.png`;
  if (categoria && categoryImages[categoria]) return categoryImages[categoria];
  if (titulo) return `/images/activities/${slugify(titulo)}.svg`;
  return "/images/activities/criativa.webp";
}

export function getActivityImageAlt(titulo?: string | null) {
  return titulo ? `Ilustração da brincadeira ${titulo}` : "Ilustração de brincadeira";
}

export { slugify };
