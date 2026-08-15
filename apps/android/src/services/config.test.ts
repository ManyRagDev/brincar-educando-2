import { describe, expect, it } from "vitest";
import { readPublicMobileConfig } from "./config";

describe("readPublicMobileConfig", () => {
  it("recusa configuração parcial", () => {
    expect(readPublicMobileConfig({ VITE_SUPABASE_URL: "https://example.supabase.co" })).toBeNull();
  });

  it("aceita apenas valores públicos completos", () => {
    expect(
      readPublicMobileConfig({
        VITE_SUPABASE_URL: "https://example.supabase.co",
        VITE_SUPABASE_ANON_KEY: "public-anon-key"
      })
    ).toEqual({
      supabaseUrl: "https://example.supabase.co",
      supabaseAnonKey: "public-anon-key"
    });
  });
});
