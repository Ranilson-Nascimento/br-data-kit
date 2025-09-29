import { defineConfig } from 'vite'

export default defineConfig({
  root: 'demo',
  build: {
    outDir: '../docs'
  },
  resolve: {
    alias: {
      'br-data-kit': '../src/index.ts'
    }
  }
})