import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/shadow/', // Matches https://cgaczewski-yt.github.io/shadow/
});
