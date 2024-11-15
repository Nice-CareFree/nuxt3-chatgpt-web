// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  ssr: false,
  modules: [
    'shadcn-nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    'nuxt-lucide-icons',
    '@pinia/nuxt'
  ],
  // @ts-ignore - shadcn-nuxt 模块会注入这些类型
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    dataValue: 'theme'
  },
  css: [
    '@/assets/css/main.css'
  ],
  nitro: {
    compressPublicAssets: true,
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'markdown': ['md-editor-v3']
          }
        }
      }
    }
  }
})