import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // GitHub Pages serves from /portfolio/, while Vercel serves from the domain root.
  base: process.env.GITHUB_ACTIONS ? '/portfolio/' : '/',
  plugins: [react()],
  build: {
    target: 'es2022',
    cssCodeSplit: false,
  },
});
