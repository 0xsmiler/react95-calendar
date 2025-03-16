import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

export default defineConfig(() => {
  return {
    build: {
      outDir: "dist",
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor'; // Dependencies in a separate chunk
            }
            if (id.includes('Peedy')) {
              return 'peedy-chunk'; // Custom chunk for Peedy-related code
            }
            if (id.includes('Rocky')) {
              return 'rocky-chunk'; // Custom chunk for Rocky-related code
            }
          },
        },
      },
      commonjsOptions: {
        esmExternals: true,
      },
    },
    plugins: [react()], [eslint()] 
    :[],
  };
});
