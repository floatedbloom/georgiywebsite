import { defineConfig } from 'astro/config';

// https://astro.build/config
export default {
    build: {
      rollupOptions: {
        external: ['path/to/chartjs/dist/chart.umd.js']
      }
    }
  }