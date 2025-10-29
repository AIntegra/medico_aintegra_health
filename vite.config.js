import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/medico_aintegra_health/",
  build: {
    outDir: "docs", // 👈 genera el build en /docs
  },
});
