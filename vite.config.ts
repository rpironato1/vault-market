import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8361, // [REGRESSION-GUARD] Não alterar essa porta sem antes validar com a equipe de infraestrutura
    fs: {
      allow: [".."], // Permite servir arquivos de _core, _infrastructure e packages
    },
  },
  plugins: [dyadComponentTagger(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@core": path.resolve(__dirname, "./_core"),
      "@infra": path.resolve(__dirname, "./_infrastructure"),
      "@contracts": path.resolve(__dirname, "./packages/contracts"),
    },
  },
}));