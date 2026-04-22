import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";

// https://vitejs.dev/config/
export default defineConfig({
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          reactVendor: ["react", "react-dom", "react-router-dom"],
          chartVendor: ["recharts", "d3", "date-fns"],
          motionVendor: ["framer-motion"],
        },
      },
    },
  },
  plugins: [
    tsconfigPaths(),
    react(),
    process.env.NODE_ENV === "development" ? tagger() : null,
  ].filter(Boolean),
  server: {
    port: "4028",
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: ['.amazonaws.com', '.builtwithrocket.new'],
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true,
      },
    },
  }
});