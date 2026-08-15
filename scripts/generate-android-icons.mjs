import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";

const sourceIcon = path.resolve("public/quadrado_logo.png");
const resDir = path.resolve("android/app/src/main/res");

const sizes = [
  { dir: "mipmap-mdpi", size: 48 },
  { dir: "mipmap-hdpi", size: 72 },
  { dir: "mipmap-xhdpi", size: 96 },
  { dir: "mipmap-xxhdpi", size: 144 },
  { dir: "mipmap-xxxhdpi", size: 192 },
];

async function generate() {
  console.log(`Gerando ícones a partir de: ${sourceIcon}`);

  for (const { dir, size } of sizes) {
    const targetDir = path.join(resDir, dir);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // 1. ic_launcher.png (quadrado / cantos padrão)
    await sharp(sourceIcon)
      .resize(size, size, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(targetDir, "ic_launcher.png"));

    // 2. ic_launcher_round.png (ícone redondo)
    const circleSvg = Buffer.from(
      `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white" /></svg>`
    );

    await sharp(sourceIcon)
      .resize(size, size, { fit: "cover" })
      .composite([{ input: circleSvg, blend: "dest-in" }])
      .png()
      .toFile(path.join(targetDir, "ic_launcher_round.png"));

    // 3. ic_launcher_foreground.png (para adaptive icons)
    const fgSize = Math.round(size * 0.72);
    const padding = Math.round((size - fgSize) / 2);

    await sharp(sourceIcon)
      .resize(fgSize, fgSize, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .resize(size, size)
      .png()
      .toFile(path.join(targetDir, "ic_launcher_foreground.png"));

    console.log(`✓ Gerado ${dir} (${size}x${size}px)`);
  }

  console.log("Todos os ícones Android foram gerados com sucesso!");
}

generate().catch(console.error);
