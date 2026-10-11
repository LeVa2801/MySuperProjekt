import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        globIgnores: ['clang/**'],
      },
      manifest: {
        name: 'Meta Dev Dashboard',
        short_name: 'MetaDash',
        description: 'Command Center & 3D Renderer',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone', // Sorgt dafür, dass sie sich wie eine App öffnet
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})