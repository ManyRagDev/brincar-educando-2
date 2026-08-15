import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const apkPath = resolve(root, "android/app/build/outputs/apk/debug/app-debug.apk");
const capacitorConfigPath = resolve(root, "android/app/src/main/assets/capacitor.config.json");
const manifestPath = resolve(root, "android/app/src/main/AndroidManifest.xml");

if (![apkPath, capacitorConfigPath, manifestPath].every(existsSync)) {
  throw new Error("APK, configuração Capacitor ou manifesto Android ausente. Execute npm run cap:sync e gere o APK antes de verificar.");
}

const config = JSON.parse(readFileSync(capacitorConfigPath, "utf8"));
const manifest = readFileSync(manifestPath, "utf8");
const apk = readFileSync(apkPath);
const generatedAt = new Date().toISOString();
const report = {
  generatedAt,
  packageId: config.appId,
  webDir: config.webDir,
  hasRemoteServerUrl: Object.hasOwn(config, "server") && Object.hasOwn(config.server, "url"),
  allowsMixedContent: config.android?.allowMixedContent === true,
  pluginCount: Array.isArray(config.android?.includePlugins) ? config.android.includePlugins.length : 0,
  hasPushPermission: manifest.includes("android.permission.POST_NOTIFICATIONS"),
  hasCameraPermission: manifest.includes("android.permission.CAMERA"),
  hasMediaPermission: manifest.includes("android.permission.READ_MEDIA_IMAGES"),
  apk: {
    path: apkPath,
    bytes: statSync(apkPath).size,
    sha256: createHash("sha256").update(apk).digest("hex")
  }
};

const destination = resolve(root, "reports/verified", generatedAt.replaceAll(":", "-").replaceAll(".", "-"));
mkdirSync(destination, { recursive: true });
writeFileSync(resolve(destination, "android-apk.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));

if (
  report.packageId !== "br.com.brincareducando.app.dev" ||
  report.hasRemoteServerUrl ||
  report.allowsMixedContent ||
  report.pluginCount !== 0 ||
  report.hasPushPermission ||
  report.hasCameraPermission ||
  report.hasMediaPermission
) {
  process.exitCode = 1;
}
