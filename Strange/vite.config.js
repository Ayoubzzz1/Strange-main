import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Example: Manually split lodash into a separate chunk
          if (id.includes('node_modules/lodash')) {
            return 'lodash';
          }
          // You can add other conditions for other large dependencies if needed
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Adjust the chunk size limit to 1MB (1000 KB)
  },
})
