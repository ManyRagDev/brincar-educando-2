import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // The Android client owns its generated Vite and Gradle artifacts. They are
    // verified by apps/android's TypeScript, Vitest and Gradle commands instead.
    "apps/android/node_modules/**",
    "apps/android/dist/**",
    "apps/android/android/**",
    // Generated Capacitor assets in the legacy APK are also outside the Next
    // lint boundary.
    "android/**",
  ]),
]);

export default eslintConfig;
