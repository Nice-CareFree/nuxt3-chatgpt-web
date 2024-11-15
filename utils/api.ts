interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ChatCompletionOptions {
  model: string
  temperature?: number
  top_p?: number
  stream?: boolean
  messages: Message[]
  baseUrl?: string
  apiKey?: string
}

interface OpenAIError {
  error: {
    message: string
    type: string
    param: string | null
    code: string
  }
}

export async function* createChatCompletion(options: ChatCompletionOptions) {
  const settings = localStorage.getItem('settings')
  const globalSettings = settings ? JSON.parse(settings) : {}
  
  const apiKey = options.apiKey || globalSettings.apiKey
  const apiEndpoint = options.baseUrl || globalSettings.apiEndpoint || 'https://api.openai.com'
  
  try {
    const response = await fetch(`${apiEndpoint}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        ...options,
        stream: true
      })
    })

    if (!response.ok) {
      const error = await response.json() as OpenAIError
      throw new Error(error.error?.message || 'API请求失败')
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    while (reader) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n').filter(line => line.trim() !== '')

      for (const line of lines) {
        if (line.includes('[DONE]')) {
          yield '[DONE]'
          break
        }

        try {
          const data = JSON.parse(line.replace('data: ', ''))
          const content = data.choices[0]?.delta?.content || ''
          if (content) yield content
        } catch (e) {
          console.error('解析响应失败:', e)
        }
      }
    }
  } catch (error) {
    throw error
  }
} 