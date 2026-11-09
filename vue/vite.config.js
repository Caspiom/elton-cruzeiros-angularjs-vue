import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base './' deixa o build funcionar em qualquer subpasta (ex.: GitHub Pages).
export default defineConfig({
  base: './',
  plugins: [vue()]
})
