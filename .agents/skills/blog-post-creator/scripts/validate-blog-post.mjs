#!/usr/bin/env node

/**
 * Script de validação automática e anti-alucinação para posts de blog (.mdx)
 * Uso: node validate-blog-post.mjs <caminho-para-o-post.mdx>
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ALLOWED_CATEGORIES = [
  "Desenvolvimento",
  "Rotina",
  "Saúde e Bem-Estar",
  "Amamentação",
  "Alimentação e Nutrição",
  "Primeira Infância",
  "Brincar",
  "Comportamento",
  "Sono",
  "Maternidade",
];

const FORBIDDEN_TERMS = [
  { term: "superbebê", label: "Alegação de superdesempenho" },
  { term: "superbebe", label: "Alegação de superdesempenho" },
  { term: "gênio", label: "Alegação de superdesempenho" },
  { term: "genio", label: "Alegação de superdesempenho" },
  { term: "prodígio", label: "Alegação de superdesempenho" },
  { term: "prodigio", label: "Alegação de superdesempenho" },
  { term: "aumenta o qi", label: "Alegação de ganho cognitivo infundado" },
  { term: "aumentar o qi", label: "Alegação de ganho cognitivo infundado" },
  { term: "estimula o cérebro", label: "Clichê pseudocientífico" },
  { term: "estimular o cérebro", label: "Clichê pseudocientífico" },
  { term: "acelera o desenvolvimento", label: "Aceleração infantil proibida" },
  { term: "acelerar o desenvolvimento", label: "Aceleração infantil proibida" },
  { term: "previne autismo", label: "Alegação médica/terapêutica proibida" },
  { term: "cura autismo", label: "Alegação médica/terapêutica proibida" },
  { term: "previne atrasos", label: "Promessa diagnóstica/terapêutica indevida" },
  { term: "trata déficit", label: "Alegação médica/terapêutica proibida" },
  { term: "trata tdah", label: "Alegação médica/terapêutica proibida" },
  { term: "método infalível", label: "Promessa irrealista e garantia indevida" },
  { term: "metodo infalivel", label: "Promessa irrealista e garantia indevida" },
  { term: "100% garantido", label: "Promessa irrealista e garantia indevida" },
  { term: "resultado garantido", label: "Garantia individual proibida" },
  { term: "criança normal", label: "Linguagem não inclusiva / capacitista" },
  { term: "crianca normal", label: "Linguagem não inclusiva / capacitista" },
  { term: "criança atrasada", label: "Rotulação capacitista proibida" },
  { term: "crianca atrasada", label: "Rotulação capacitista proibida" },
  { term: "preguiçoso", label: "Rotulação pejorativa de comportamento" },
  { term: "preguicoso", label: "Rotulação pejorativa de comportamento" },
  { term: "malcriado", label: "Rotulação pejorativa de comportamento" },
  { term: "birrento", label: "Rotulação pejorativa de comportamento" },
  { term: "manhoso", label: "Rotulação pejorativa de comportamento" },
];

const REGISTERED_COMPONENTS = ["Info", "Tip", "Warning", "Callout", "Checklist", "ProductEmbed", "Image"];

function validatePost(filePath) {
  const errors = [];
  const warnings = [];

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Arquivo não encontrado: ${filePath}`);
    process.exit(1);
  }

  const rawContent = fs.readFileSync(filePath, "utf8");
  const fileName = path.basename(filePath);
  const expectedSlug = fileName.replace(/\.mdx?$/, "");

  let data, content;
  try {
    const parsed = matter(rawContent);
    data = parsed.data;
    content = parsed.content;
  } catch (err) {
    errors.push(`Erro crítico ao analisar o Frontmatter YAML: ${err.message}`);
    return { errors, warnings };
  }

  // 1. Validação de campos obrigatórios do Frontmatter
  const requiredFields = ["title", "slug", "date", "excerpt", "category", "readTime", "thumbnail"];
  for (const field of requiredFields) {
    if (!data[field]) {
      errors.push(`Campo obrigatório ausente no Frontmatter: '${field}'`);
    }
  }

  // 2. Validação do Slug
  if (data.slug && data.slug !== expectedSlug) {
    errors.push(`O slug do frontmatter ('${data.slug}') não corresponde ao nome do arquivo ('${expectedSlug}')`);
  }

  if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) {
    errors.push(`O slug '${data.slug}' deve conter apenas letras minúsculas sem acento, números e hífens.`);
  }

  // 3. Validação de Categoria Oficial
  if (data.category && !ALLOWED_CATEGORIES.includes(data.category)) {
    errors.push(
      `Categoria inválida: '${data.category}'. As categorias oficiais são: ${ALLOWED_CATEGORIES.join(", ")}`
    );
  }

  // 4. Validação da Thumbnail
  if (data.thumbnail && !data.thumbnail.startsWith("/")) {
    warnings.push(`O caminho da thumbnail deve iniciar com barra (ex: '/images/${expectedSlug}.png').`);
  }

  // 5. Validação de Hierarquia de Títulos (Proibição de # H1 no corpo)
  const lines = content.split("\n");
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("# ") && !trimmed.startsWith("##")) {
      errors.push(
        `Linha ${index + 1}: Uso de '# H1' proibido no corpo do MDX ('${trimmed}'). Comece seus títulos a partir de '## H2', pois o template .tsx já injeta o H1.`
      );
    }
  });

  // 6. Varredura Anti-Alucinação (Termos Proibidos)
  const lowerContent = rawContent.toLowerCase();
  for (const item of FORBIDDEN_TERMS) {
    // Regex buscando palavra inteira ou expressão
    const regex = new RegExp(`\\b${item.term}\\b`, "i");
    if (regex.test(lowerContent)) {
      errors.push(`Termo proibido detectado: '${item.term}' (${item.label}).`);
    }
  }

  // 7. Validação de Fechamento de Tags dos Componentes MDX Customizados
  for (const comp of REGISTERED_COMPONENTS) {
    const openTags = (content.match(new RegExp(`<${comp}[\\s>]`, "g")) || []).length;
    const closeTags = (content.match(new RegExp(`</${comp}>`, "g")) || []).length;
    const selfClosing = (content.match(new RegExp(`<${comp}[^>]*/>`, "g")) || []).length;

    if (openTags !== closeTags + selfClosing) {
      errors.push(
        `Desbalanceamento no componente <${comp}>: ${openTags} abertura(s) vs ${closeTags} fechamento(s) (+ ${selfClosing} auto-fechamento).`
      );
    }
  }

  return { errors, warnings };
}

// Execução CLI
const args = process.argv.slice(2);

let filesToValidate = [];

if (args.length === 0 || args[0] === "--all") {
  const blogDir = path.resolve(process.cwd(), "content/blog");
  if (fs.existsSync(blogDir)) {
    filesToValidate = fs
      .readdirSync(blogDir)
      .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
      .map((f) => path.join(blogDir, f));
  }
} else {
  filesToValidate = [path.resolve(process.cwd(), args[0])];
}

if (filesToValidate.length === 0) {
  console.log("Uso: node validate-blog-post.mjs [caminho-para-o-post.mdx | --all]");
  process.exit(1);
}

let totalErrors = 0;
let totalWarnings = 0;

console.log(`\n🔍 Iniciando validação de ${filesToValidate.length} artigo(s)...\n`);

for (const filePath of filesToValidate) {
  const fileName = path.basename(filePath);
  const { errors, warnings } = validatePost(filePath);

  if (errors.length > 0) {
    console.error(`❌ [FALHA] ${fileName}:`);
    errors.forEach((e) => console.error(`   - ${e}`));
    totalErrors += errors.length;
  } else if (warnings.length > 0) {
    console.log(`⚠️ [AVISO] ${fileName}:`);
    warnings.forEach((w) => console.log(`   - ${w}`));
    totalWarnings += warnings.length;
  } else {
    console.log(`✅ [OK] ${fileName}`);
  }
}

console.log("\n------------------------------------------------------------");
console.log(`Resumo: ${filesToValidate.length} arquivo(s) avaliado(s).`);
console.log(`Total de Erros: ${totalErrors} | Total de Avisos: ${totalWarnings}`);
console.log("------------------------------------------------------------\n");

if (totalErrors > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
