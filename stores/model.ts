import { defineStore } from 'pinia'
import { Bird, Rabbit, Bot } from 'lucide-vue-next'

export interface Model {
  id: string
  name: string
  iconName: string
  description: string
  baseUrl?: string
  apiKey?: string
}

const iconMap = {
  'bird': Bird,
  'rabbit': Rabbit,
  'bot': Bot
}

export const useModelStore = defineStore('model', {
  state: () => ({
    globalModels: [
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        iconName: 'bird',
        description: '快速且通用的模型'
      },
      {
        id: 'gpt-4',
        name: 'GPT-4',
        iconName: 'rabbit',
        description: '更强大的大语言模型'
      }
    ] as Model[],
    customModels: [] as Model[],
    initialized: false
  }),

  getters: {
    allModels: (state) => [...state.globalModels, ...state.customModels],
    modelsWithIcons: (state) => {
      return state.allModels.map(model => ({
        ...model,
        icon: iconMap[model.iconName as keyof typeof iconMap] || Bot
      }))
    }
  },

  actions: {
    loadCustomModels() {
      if (process.client) {
        const savedSettings = localStorage.getItem('settings')
        if (savedSettings) {
          const settings = JSON.parse(savedSettings)
          if (settings.customModels && Array.isArray(settings.customModels)) {
            this.customModels = settings.customModels
          }
        }
      }
    },

    init() {
      if (this.initialized) return
      this.loadCustomModels()
      this.initialized = true
    }
  }
}) 