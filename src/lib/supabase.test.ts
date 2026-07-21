import { afterEach, describe, expect, it, vi } from "vitest";
import { getSupabaseConfig } from "@/lib/supabase";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getSupabaseConfig", () => {
  it("devuelve null cuando faltan las variables de entorno", () => {
    vi.stubEnv("SUPABASE_URL", "");
    vi.stubEnv("SUPABASE_SERVICE_KEY", "");
    expect(getSupabaseConfig()).toBeNull();
  });

  it("devuelve null si solo está definida una de las dos variables", () => {
    vi.stubEnv("SUPABASE_URL", "https://proyecto.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_KEY", "");
    expect(getSupabaseConfig()).toBeNull();
  });

  it("devuelve la configuración y quita la barra final de la URL", () => {
    vi.stubEnv("SUPABASE_URL", "https://proyecto.supabase.co/");
    vi.stubEnv("SUPABASE_SERVICE_KEY", "clave-secreta");

    expect(getSupabaseConfig()).toEqual({
      url: "https://proyecto.supabase.co",
      key: "clave-secreta",
    });
  });
});
