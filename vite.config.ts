import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    base: './', 
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    define: {
      // CRITICAL FIX: This pulls the API_KEY from Netlify's build environment
      // and literally replaces 'process.env.API_KEY' in your code with the actual key string.
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      
      // We remove the empty 'process.env': {} polyfill because it can overwrite the specific key above.
    }
  };
});