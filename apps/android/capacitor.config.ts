import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "br.com.brincareducando.app.dev",
  appName: "Brincar Educando Dev",
  webDir: "dist",
  android: {
    allowMixedContent: false,
    captureInput: true
  }
};

export default config;
