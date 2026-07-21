import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Configuración de Vitest. Las pruebas cubren la lógica pura del proyecto
// (mappers, SEO y configuración), por lo que basta el entorno "node".
// Se replica el alias "@" → ./src que usa la app (ver tsconfig.json).
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
