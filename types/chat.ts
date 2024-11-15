export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
  timestamp: Date
  error?: boolean
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  error?: boolean
}

export interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean
} 