import type { CapacitorConfig } from '@capacitor/cli';

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
  },
};

export default config;
