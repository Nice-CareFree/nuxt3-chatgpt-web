<template>
  <div class="relative mt-2 md:mt-4">
    <Textarea
      v-model="input"
      placeholder="输入消息..."
      :rows="1"
      class="resize-none pr-12 md:text-base text-sm"
      @keydown.enter.prevent="handleSubmit"
    />
    <Button
      class="absolute right-2 top-1/2 -translate-y-1/2"
      size="icon"
      :disabled="isLoading || !input.trim()"
      @click="handleSubmit"
    >
      <Send v-if="!isLoading" class="md:h-4 md:w-4 h-3.5 w-3.5" />
      <Loader2 v-else class="md:h-4 md:w-4 h-3.5 w-3.5 animate-spin" />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Send, Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createChatCompletion } from '@/utils/api'
import { useChatStore } from '@/stores/chat'
import { useModelStore } from '@/stores/model'

const chatStore = useChatStore()
const modelStore = useModelStore()

// 获取全局设置
const globalSettings = JSON.parse(localStorage.getItem('settings') || '{"contextCount": 5}')

interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

const props = defineProps<{
  contextMessages?: Array<{
    role: 'system' | 'assistant' | 'user'
    content: string
  }>
  model?: string
  temperature?: number
  topP?: number
}>()

const emit = defineEmits<{
  send: [message: string]
  receive: [message: string, isError?: boolean]
  complete: []
}>()

const input = ref('')
const isLoading = ref(false)

const STREAM_TIMEOUT = 30000 // 30秒超时

// 添加节流时间间隔
const EMIT_THROTTLE = 100 // 100ms
const lastEmitTime = ref(0)

const handleSubmit = async () => {
  if (!input.value.trim() || isLoading.value) return
  
  const message = input.value
  input.value = ''
  isLoading.value = true
  
  // 先发送用户消息并触发滚动
  emit('send', message)
  
  const currentChat = chatStore.currentChat
  if (!currentChat) throw new Error('未找到当前对话')

  console.log('Props model:', props.model)
  console.log('Current chat settings model:', currentChat.settings.model)
  
  // 使用props传入的model,如果没有则使用当前对话的设置
  const modelToUse = props.model || currentChat.settings.model
  console.log('Model to use:', modelToUse)
  
  const model = modelStore.allModels.find(m => m.id === modelToUse)
  if (!model) throw new Error('未找到模型配置')

  let response = ''
  let timeoutId: NodeJS.Timeout | null = null

  try {
    // 在发送请求前添加日志
    console.log('Sending request with settings:', {
      model: modelToUse,
      temperature: props.temperature,
      topP: props.topP
    })

    // 构建消息数组
    const messages = [
      // 1. 上下文对话列表 - 确保非空且内容不为空
      ...(props.contextMessages?.filter(msg => msg.content.trim()) || []),
      
      // 2. 历史消息
      ...currentChat.messages
        .slice(-(globalSettings.contextCount * 2))
        .map(msg => ({
          role: msg.role,
          content: msg.content
        })),

      // 3. 当前用户消息
      {
        role: 'user',
        content: message
      }
    ]

    console.log('Final messages array:', messages) // 添加日志

    // 使用props传入的参数
    for await (const chunk of createChatCompletion({
      model: modelToUse,
      messages,
      temperature: props.temperature ?? currentChat.settings.temperature,
      top_p: props.topP ?? currentChat.settings.topP,
      baseUrl: model.baseUrl,
      apiKey: model.apiKey,
      stream: true
    })) {
      if (chunk === '[DONE]') {
        break
      }
      
      response += chunk
      const now = Date.now()
      if (now - lastEmitTime.value >= EMIT_THROTTLE) {
        emit('receive', response)
        lastEmitTime.value = now
      }
    }
    
    // 确保发送最后一次更
    emit('receive', response)
    emit('complete')
  } catch (error: any) {
    console.error('发送消息失败:', error)
    emit('receive', error.message || '请求失败，请检查API设置', true)
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    isLoading.value = false
  }
}
</script>

<style scoped>
.resize-none {
  resize: none;
}
</style> 