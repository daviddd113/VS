import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/VS/', // Repo-Name mit / am Anfang und Ende
  plugins: [react()],
});
