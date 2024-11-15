import type { Config } from 'tailwindcss'

export default {
  // ... 其他配置
  theme: {
    extend: {
      // 添加自定义滚动条样式类
      scrollbar: {
        thin: 'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400'
      }
    }
  }
} satisfies Config 