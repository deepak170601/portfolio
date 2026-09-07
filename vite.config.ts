import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  // GitHub Pages serves from /portfolio/, while Vercel serves from the domain root.
  base: mode === 'github' ? '/portfolio/' : '/',
  plugins: [react()],
  build: {
    target: 'es2022',
    cssCodeSplit: false,
  },
}));
