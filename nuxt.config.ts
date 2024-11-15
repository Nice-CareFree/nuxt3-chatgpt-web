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
    // 添加开发服务器配置
    devProxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true
      }
    }
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    },
    optimizeDeps: {
      include: ['md-editor-v3']
    },
    // 添加服务器配置
    server: {
      host: '127.0.0.1',
      port: 3000,
      strictPort: true,
      hmr: {
        protocol: 'ws',
        host: '127.0.0.1',
        port: 24678
      }
    }
  },
  // 修改生成配置
  experimental: {
    payloadExtraction: false
  },
  // 添加路由配置
  router: {
    options: {
      // hashMode: true  // 删除此行
    }
  },
  app: {
    baseURL: '/',
    buildAssetsDir: 'assets',
    // 添加头部配置
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' }
      ]
    }
  }
})