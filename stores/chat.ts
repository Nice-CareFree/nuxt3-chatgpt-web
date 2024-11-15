import { defineStore } from 'pinia'

export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
  timestamp: Date
  error?: boolean
}

interface ContextMessage {
  role: 'system' | 'assistant' | 'user'
  content: string
}

interface ChatSettings {
  model: string
  temperature: number
  topP: number
  topK: number
  contextMessages: ContextMessage[]
}

export interface Chat {
  id: string
  title: string
  createdAt: Date
  settings: ChatSettings
  messages: Message[]
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    chats: [] as Chat[],
    currentChatId: null as string | null,
    _saveTimeout: null as NodeJS.Timeout | null,
    isUpdating: false
  }),

  getters: {
    currentChat(): Chat | undefined {
      return this.chats.find(chat => chat.id === this.currentChatId)
    }
  },

  actions: {
    saveChats() {
      if (process.client) {
        const chatsToSave = this.chats.map(chat => ({
          ...chat,
          messages: chat.messages.map(msg => ({
            ...msg,
            timestamp: msg.timestamp.getTime()
          }))
        }))
        localStorage.setItem('chats', JSON.stringify(chatsToSave))
      }
    },

    loadChats() {
      if (process.client) {
        const savedChats = localStorage.getItem('chats')
        if (savedChats) {
          try {
            const parsed = JSON.parse(savedChats)
            this.chats = parsed.map((chat: any) => ({
              ...chat,
              messages: chat.messages.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
              }))
            }))
            if (this.chats.length > 0 && !this.currentChatId) {
              this.currentChatId = this.chats[0].id
            }
          } catch (e) {
            console.error('Failed to parse saved chats:', e)
          }
        }
      }
    },

    createChat() {
      const newChat: Chat = {
        id: `chat-${Date.now()}`,
        title: '新对话',
        createdAt: new Date(),
        messages: [],
        settings: {
          model: 'gpt-3.5-turbo',
          temperature: 0.7,
          topP: 0.9,
          topK: 0,
          contextMessages: []
        }
      }
      
      this.chats.unshift(newChat)
      this.currentChatId = newChat.id
      this.saveChats()
    },

    updateChatSettings(chatId: string, settings: ChatSettings) {
      const chat = this.chats.find(c => c.id === chatId)
      if (!chat) return

      // 深拷贝设置对象
      chat.settings = JSON.parse(JSON.stringify(settings))
      
      // 立即保存到localStorage
      this.saveChats()
      
      console.log('Settings saved to localStorage:', settings)
    },

    deleteChat(id: string) {
      const index = this.chats.findIndex(chat => chat.id === id)
      if (index > -1) {
        this.chats.splice(index, 1)
        if (this.currentChatId === id) {
          this.currentChatId = this.chats[0]?.id || null
        }
        this.saveChats()
      }
    },

    selectChat(id: string) {
      if (this.currentChatId === id) return
      this.currentChatId = id
    },

    addMessage(message: Omit<Message, 'timestamp'>) {
      const chat = this.chats.find(c => c.id === this.currentChatId)
      if (!chat) return

      chat.messages.push({
        ...message,
        timestamp: new Date()
      })
      
      this.saveChats()
    },

    updateLastMessage(content: string, isError = false) {
      const chat = this.chats.find(c => c.id === this.currentChatId)
      if (!chat || !chat.messages.length) return

      const lastMessage = chat.messages[chat.messages.length - 1]
      lastMessage.content = content
      lastMessage.error = isError
      
      // 保存到localStorage
      this.saveChats()
    },

    init() {
      this.loadChats()
      if (this.chats.length === 0) {
        this.createChat()
      }
    },

    updateChatTitle(chatId: string, newTitle: string) {
      const chat = this.chats.find(c => c.id === chatId)
      if (chat) {
        chat.title = newTitle
        this.saveChats()
      }
    },

    $dispose() {
      if (this._saveTimeout) {
        clearTimeout(this._saveTimeout)
        this._saveTimeout = null
      }
      super.$dispose()
    },

    async sendMessage({ chatId, content, settings }: {
      chatId: string
      content: string
      settings: {
        model: string
        temperature: number
        topP: number
        topK: number
        contextMessages: any[]
      }
    }) {
      // ... existing code ...

      try {
        // 使用传入的 settings 进行 API 调用
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: messages,
            model: settings.model,           // 使用面板选择的模型
            temperature: settings.temperature,
            top_p: settings.topP,
            top_k: settings.topK,
            context_messages: settings.contextMessages,
          }),
        })
        // ... rest of the code ...
      } catch (error) {
        // ... error handling ...
      }
    }
  }
}) 