import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        globIgnores: ['clang/**', '**/ffmpeg-core-*.wasm'],
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
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ]
})