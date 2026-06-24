import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../src/main/resources/static',
    emptyOutDir: true,
  },
  server: {
    host: '0.0.0.0',
    watch: {
      usePolling: true
    },
    proxy: {
      '/api': {
        target: 'http://app:8080' || process.env.VITE_API_URL || 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.js',
    coverage: {
      provider: 'v8',
      all: true,
      include: ['src/**/*.jsx'],
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 85,
        statements: 85
      }
    }
  }
})

