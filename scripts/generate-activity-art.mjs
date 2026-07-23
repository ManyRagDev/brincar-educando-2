import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const source = JSON.parse(fs.readFileSync(path.join(root, "public/atividades/atividades_brincar_educando.json"), "utf8"));
const out = path.join(root, "public/images/activities");
fs.mkdirSync(out, { recursive: true });

const slugify = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const palette = ["#ff766b", "#f4b942", "#68b99a", "#68a8d8", "#c18dd6", "#ed9f78"];
const extraTitles = [
  "Caça aos pares na gaveta de meias", "Cabana aberta de caixa", "Bate-pausa: escuta", "Cadê o pano grande", "Caça às letras do próprio nome", "Caixa de sons caseira", "Caminho de obstáculos com cadeiras", "Caixa de sons da cozinha", "Cantigas com gestos no colo", "Canção do nome e da pausa", "Caminhos do corpo no chão", "Caretas e respostas", "Cesto de objetos grandes", "Cidade de caixas", "Coloca e tira objetos grandes", "Cuidando do boneco", "Conversa de rostos", "Dança das estátuas na sala", "Desenhar o som", "Desenho gigante no papelão", "Desenho com água na varanda", "Duas escolhas para o boneco", "Empurra para e volta", "Entrega e recebe", "Folha grande ao vento", "Espelho de gestos com o adulto", "Escultura de papel amassado", "Grande e pequeno", "Guardar cantando", "Histórias em sequência com fotos", "Jogo da bandeja que some", "Janela de luz e sombra", "Histórias olhando livro ao contrário", "Labirinto de caixa de papelão", "Livro resistente: aponta ou olha", "Mãos que se encontram", "Missão de entregar recados pela casa", "Passeio narrado no colo", "Organizar talheres da família", "Passos e pausas pela voz", "Pintura com esponja e prato", "Pintura com gelo colorido", "Pular de almofada em almofada", "Rolando garrafa de água pelo caminho", "Rimas com nomes da família", "Sacola surpresa de tecidos", "Sons da janela", "Tapete sensorial improvisado", "Transferir água com esponja", "Orquestra de uma panela"
];

function scene(title, category, index) {
  const t = title.toLowerCase();
  const color = palette[index % palette.length];
  const accent = palette[(index + 2) % palette.length];
  let objects = `<circle cx="176" cy="116" r="37" fill="#f1b58e"/><path d="M140 108c8-43 72-43 82 0-25-13-56-13-82 0Z" fill="#6c4a3f"/><path d="M154 155c18 18 35 18 52 0" fill="none" stroke="#7d493e" stroke-width="7" stroke-linecap="round"/>`;
  if (/pintura|desenh|gelo|esponja|papel/.test(t)) objects += `<rect x="285" y="126" width="185" height="112" rx="15" fill="#fffaf0" stroke="#d9c8ae" stroke-width="5"/><path d="M310 211c30-60 57 30 90-37 24-49 42 16 60-20" fill="none" stroke="${color}" stroke-width="18" stroke-linecap="round"/><circle cx="286" cy="274" r="24" fill="${accent}"/><circle cx="345" cy="274" r="24" fill="${color}"/>`;
  else if (/panela|pote|tampa|talher|cozinha|água|agua|escorredor/.test(t)) objects += `<ellipse cx="362" cy="220" rx="118" ry="34" fill="${color}"/><path d="M250 215v39c0 28 224 28 224 0v-39" fill="${accent}" stroke="#8b6a54" stroke-width="6"/><circle cx="310" cy="215" r="17" fill="#f8d78b"/><circle cx="368" cy="215" r="17" fill="#8fc8ac"/><circle cx="426" cy="215" r="17" fill="#89b8dc"/>`;
  else if (/meia|roupa|tecido|cheiro|sensorial|folha|nuvem|céu|ceu/.test(t)) objects += `<path d="M290 132c28 0 28 40 2 56l-20 14c-19 14-5 51 25 51h90c30 0 42-32 22-51l-20-15c-25-19-18-55 4-55" fill="${color}" stroke="#8b6a54" stroke-width="6"/><path d="M330 151c20 25 50 25 72 0" fill="none" stroke="#fff2db" stroke-width="9" stroke-linecap="round"/>`;
  else if (/caixa|cidade|labirinto|caminho|trilha|linha|obstáculo|obstaculo|bandeja/.test(t)) objects += `<path d="M286 153 388 112l96 45-99 43z" fill="${color}" stroke="#8b6a54" stroke-width="6"/><path d="M286 153v94l99 47v-94M484 157v92l-99 45" fill="${accent}" stroke="#8b6a54" stroke-width="6"/><circle cx="355" cy="225" r="13" fill="#fff2db"/>`;
  else if (/dança|danca|cantiga|eco|rima|história|historia|palavra|nome|letra|recado/.test(t)) objects += `<path d="M305 215c35-67 104-67 136 0" fill="none" stroke="${color}" stroke-width="18" stroke-linecap="round"/><circle cx="315" cy="247" r="16" fill="${accent}"/><circle cx="432" cy="247" r="16" fill="${accent}"/><path d="M343 270c28 20 52 20 80 0" fill="none" stroke="#8b6a54" stroke-width="7" stroke-linecap="round"/>`;
  else if (/água|agua|boia|afunda|chuva|regar|plantar|feijão|feijao/.test(t)) objects += `<path d="M286 168h178v84c0 25-178 25-178 0z" fill="#9bd5e8" stroke="#6b8d9b" stroke-width="6"/><path d="M335 152c20-36 42-36 62 0" fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round"/><circle cx="343" cy="211" r="14" fill="#f2bf66"/><circle cx="400" cy="224" r="14" fill="#8fc8ac"/>`;
  else objects += `<path d="M290 238c0-80 142-80 142 0" fill="none" stroke="${color}" stroke-width="24" stroke-linecap="round"/><circle cx="330" cy="242" r="18" fill="${accent}"/><circle cx="396" cy="242" r="18" fill="#f2bf66"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" role="img"><rect width="640" height="360" rx="32" fill="#fff8ed"/><circle cx="548" cy="74" r="55" fill="${color}" opacity=".18"/><path d="M0 292c130-26 224 12 336-5 122-19 188 10 304-10v83H0Z" fill="#f7e2c4"/><path d="M0 96c85-30 148-20 235 5 93 26 205-31 405 1" fill="none" stroke="${accent}" stroke-width="8" opacity=".22" stroke-linecap="round"/>${objects}<path d="M130 184c-18 19-26 39-24 59M222 184c17 19 25 39 23 59" stroke="#7d493e" stroke-width="12" stroke-linecap="round"/><circle cx="110" cy="246" r="16" fill="${color}"/><circle cx="238" cy="246" r="16" fill="${accent}"/><path d="M95 290c38 18 77 18 116 0" fill="none" stroke="#e9b88e" stroke-width="8" stroke-linecap="round"/></svg>`;
}

const allItems = [...source, ...extraTitles.map((titulo, index) => ({ titulo, categoria: ["sensorial", "criativa", "cognitiva", "movimento"][index % 4] }))];
for (const [index, item] of allItems.entries()) {
  const file = path.join(out, `${slugify(item.titulo)}.svg`);
  fs.writeFileSync(file, scene(item.titulo, item.categoria, index), "utf8");
}
console.log(`Generated ${allItems.length} activity illustrations.`);
