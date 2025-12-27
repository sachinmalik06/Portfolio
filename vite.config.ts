import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { vitePluginMetaTags } from "./vite-plugin-meta-tags";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), vitePluginMetaTags()],
  assetsInclude: ['**/*.glb'],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "use-sync-external-store/shim/with-selector": "use-sync-external-store/shim/with-selector.js",
    },
  },
  optimizeDeps: {
    include: ["use-sync-external-store"],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "framer-motion"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-slot"],
        },
      },
    },
  },
});
