import type { CapacitorConfig } from '@capacitor/cli';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const hasAndroidFirebaseConfig = existsSync(
  resolve(process.cwd(), 'android', 'app', 'google-services.json'),
);

if (!hasAndroidFirebaseConfig) {
  console.warn(
    '[capacitor] android/app/google-services.json não encontrado; push notifications desativadas para evitar crash nativo.',
  );
}

const config: CapacitorConfig = {
  appId: 'br.com.brincareducando.app',
  appName: 'Brincar Educando',
  webDir: 'public',
  server: {
    url: 'https://brincar-educando-2-nf2m.vercel.app',
    cleartext: true,
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    // The push plugin crashes the native process when Firebase is not configured.
    // Running `cap sync` after adding google-services.json enables it automatically.
    includePlugins: hasAndroidFirebaseConfig
      ? ['@capacitor/push-notifications']
      : [],
  },
};

export default config;
