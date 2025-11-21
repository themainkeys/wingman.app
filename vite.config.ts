import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  define: {
    // This ensures process.env exists in the browser to prevent crashes
    // Real environment variables should be injected by the build platform
    'process.env': {}
  }
});