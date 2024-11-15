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
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
        { name: 'keywords', content: '奈斯AI,奈斯AI-Web,AI,ChatGPT,AI聊天机器人,AI聊天,AI聊天助手,AI聊天工具,AI聊天软件,AI聊天应用,AI聊天服务,AI聊天平台,AI聊天开发,AI聊天技术,AI聊天工具,AI聊天软件,AI聊天应用,AI聊天服务,AI聊天平台,AI聊天开发,AI聊天技术' },
        { name: 'description', content: '奈斯AI-Web是一款基于ChatGPT的AI聊天机器人，支持多种语言，支持多种模型，支持多种API，支持多种文档，支持多种设置，支持多种功能，支持多种应用，支持多种服务，支持多种平台，支持多种开发，支持多种技术' }
      ],
      title: '奈斯AI-Web',
    }
  }
})