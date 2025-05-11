// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';
import clerk from '@clerk/astro'
import node from '@astrojs/node';
import { dark } from '@clerk/themes'

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [
    react(), 
    clerk({
      appearance: {
        baseTheme: [dark],
      }
    })
  ],
  output: 'server',
  adapter: node({
    mode: 'standalone'
  })
});