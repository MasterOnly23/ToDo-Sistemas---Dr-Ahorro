import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://192.168.0.74:3501', // URL de backend de Django - todas las solicitudes que comiencen por /api se redirigen a esa url
    },
  },
});
