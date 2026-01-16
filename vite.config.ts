import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: [".."], // Permite acesso a arquivos fora do root (se necessário) ou no mesmo nível de src
    },
  },
  plugins: [dyadComponentTagger(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@core": path.resolve(__dirname, "./_core"),
      "@infra": path.resolve(__dirname, "./_infrastructure"),
    },
  },
}));