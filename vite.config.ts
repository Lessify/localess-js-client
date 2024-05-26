import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    exclude: ['node-fetch']
  },
  build: {
    rollupOptions: {
      external: ['node-fetch']
    },
    lib: {
      entry: './src/index.ts',
      fileName: 'index',
      name: 'localess',
      formats: ['es'],
    }
  }
})
