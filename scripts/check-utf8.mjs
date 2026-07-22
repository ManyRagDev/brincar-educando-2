import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const fix = process.argv.includes("--fix");
const root = process.cwd();
const knownTextExtensions = new Set([
  ".css", ".csv", ".cjs", ".html", ".js", ".json", ".md", ".mdx", ".mjs",
  ".scss", ".sql", ".svg", ".toml", ".ts", ".tsx", ".txt", ".yaml", ".yml",
]);
const knownTextNames = new Set([
  ".editorconfig", ".env", ".env.local", ".gitattributes", ".gitignore", "Dockerfile",
]);
const fatalUtf8Decoder = new TextDecoder("utf-8", { fatal: true });
const mojibakePattern = /(?:\u00c3[\u0080-\u00bf]|\u00c2(?:[\u0080-\u009f]|\u00a0|\u00aa|\u00ba)|\u00e2(?:\u20ac|\u2122|\u0153|\u201c|\u201d|\u02dc|\u2020|\u2021|\u02c6|\u2030|\u0160|\u2039|\u0152|\u017d|\u2018|\u2019|\u2022|\u2013|\u2014)|\u00f0\u0178|\u00ef\u00bb\u00bf)/g;
const forbiddenControlsPattern = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g;

function repositoryFiles() {
  const output = execFileSync("git", ["ls-files", "-co", "--exclude-standard", "-z"], { cwd: root });
  return output.toString("utf8").split("\0").filter(Boolean);
}

function isTextFile(file) {
  const basename = path.basename(file);
  return knownTextExtensions.has(path.extname(file).toLowerCase())
    || knownTextNames.has(basename)
    || basename.startsWith(".env.");
}

function inspectText(file, text, hasBom) {
  const findings = [];
  const mojibake = text.match(mojibakePattern);
  const controls = text.match(forbiddenControlsPattern);

  if (hasBom) findings.push(`${file}: UTF-8 BOM desnecessário`);
  if (text.includes("\uFFFD")) findings.push(`${file}: contém U+FFFD (caractere de substituição)`);
  if (mojibake) findings.push(`${file}: possível mojibake (${[...new Set(mojibake)].join(", ")})`);
  if (controls) findings.push(`${file}: contém ${controls.length} caractere(s) de controle`);
  if (text !== text.normalize("NFC")) findings.push(`${file}: texto fora da normalização Unicode NFC`);
  if (text.includes("\r")) findings.push(`${file}: final de linha diferente de LF`);
  if (text.length > 0 && !text.endsWith("\n")) findings.push(`${file}: ausência de nova linha final`);

  return findings;
}

const findings = [];
let scanned = 0;
let fixed = 0;

for (const file of repositoryFiles().filter(isTextFile)) {
  const absolutePath = path.join(root, file);
  const bytes = fs.readFileSync(absolutePath);
  let text;

  try {
    text = fatalUtf8Decoder.decode(bytes);
  } catch {
    findings.push(`${file}: bytes inválidos para UTF-8`);
    continue;
  }

  scanned += 1;
  const hasBom = bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf;

  if (fix) {
    let normalized = text.replace(/^\uFEFF/, "").normalize("NFC").replace(/\r\n?/g, "\n");
    if (normalized && !normalized.endsWith("\n")) normalized += "\n";
    if (normalized !== text) {
      fs.writeFileSync(absolutePath, normalized, "utf8");
      fixed += 1;
      text = normalized;
    }
  }

  findings.push(...inspectText(file, text, fix ? false : hasBom));
}

if (findings.length) {
  console.error(`Auditoria UTF-8 reprovada (${findings.length} achados):`);
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

if (fix) {
  console.log(`Normalização concluída: ${scanned} arquivos verificados; ${fixed} ajustados para UTF-8/NFC/LF.`);
} else {
  console.log(`Auditoria UTF-8 aprovada: ${scanned} arquivos textuais em UTF-8, NFC, LF e sem BOM/mojibake.`);
}
