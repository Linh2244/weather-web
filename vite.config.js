import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png'],
      manifest: {
        name: 'Thời Tiết - Weather Web',
        short_name: 'Thời Tiết',
        description: 'Trang web thời tiết cho Việt Nam',
        theme_color: '#0ea5e9',
        background_color: '#0ea5e9',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'favicon.png', sizes: '1024x1024', type: 'image/png' },
        ],
      },
    }),
  ],
})
