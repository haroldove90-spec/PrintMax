import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
      dedupe: ['react', 'react-dom'],
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'lucide-react', '@supabase/supabase-js'],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('/xlsx/')) return 'vendor-xlsx';
              if (id.includes('/@supabase/')) return 'vendor-supabase';
              if (id.includes('/lucide-react/')) return 'vendor-icons';
              if (id.includes('/react/') || id.includes('/react-dom/')) return 'vendor-react';
            }
          },
        },
      },
    },
    server: {
      // HMR websocket is not supported in the Cloud Run preview proxy.
      // Setting hmr: false prevents the '[vite] failed to connect to websocket' red error.
      hmr: false,
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
