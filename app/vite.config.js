import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensure the build output is directed to 'dist'
    emptyOutDir: true, // Clear the dist folder before building
    rollupOptions: {
      input: './index.html', // Ensure Vite uses your `index.html` as the entry point
    },
  },
  publicDir: 'public', // Ensure static files are copied from the public directory
});