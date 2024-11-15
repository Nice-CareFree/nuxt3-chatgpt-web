<template>
  <form 
    class="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
    @submit.prevent="handleSubmit"
  >
    <Label for="message" class="sr-only">
      消息
    </Label>
    <Textarea
      id="message"
      v-model="input"
      placeholder="输入消息..."
      class="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
      @keydown="handleKeydown"
    />
    <div class="flex items-center p-3 pt-0">
      <Popover>
        <PopoverTrigger as-child>
          <Button 
            variant="ghost" 
            size="icon"
            type="button"
            @click="handleFileUpload"
          >
            <Paperclip class="size-4" :class="{'text-primary': uploadedFile}" />
            <span class="sr-only">上传文件</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent v-if="uploadedFile" class="w-80">
          <div class="flex flex-col gap-4 w-full overflow-hidden">
            <div class="space-y-2">
              <h4 class="font-medium leading-none">已上传文件</h4>
              <p class="text-sm text-muted-foreground truncate">{{ uploadedFile.name }}</p>
            </div>
            <!-- 图片预览 -->
            <img v-if="isImage" :src="filePreview" class="max-h-40 object-contain" />
            <!-- 文档预览 -->
            <div v-else class="flex items-center gap-2">
              <File class="size-8" />
              <span class="text-sm">{{ uploadedFile.name }}</span>
            </div>
            <!-- 删除按钮 -->
            <Button variant="destructive" size="sm" @click="removeFile">
              删除文件
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      
      <!-- 隐藏的文件上传输入框 -->
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        @change="onFileSelected"
      />
      
      <Button 
        type="submit" 
        size="sm" 
        class="ml-auto gap-1.5"
        :disabled="isLoading || (!input.trim() && !uploadedFile)"
      >
        <template v-if="!isLoading">
          发送消息
          <CornerDownLeft class="size-3.5" />
        </template>
        <template v-else>
          <Loader2 class="size-3.5 animate-spin" />
        </template>
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, onUnmounted } from 'vue'
import { CornerDownLeft, Loader2, Paperclip, File } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
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

// 添加文件上传相关的代码
const fileInput = ref<HTMLInputElement | null>(null)
const uploadedFile = ref<File | null>(null)
const filePreview = ref('')

const isImage = computed(() => {
  return uploadedFile.value?.type.startsWith('image/')
})

const handleFileUpload = () => {
  fileInput.value?.click()
}

const onFileSelected = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    uploadedFile.value = file
    if (isImage.value) {
      // 将图片转换为base64
      const reader = new FileReader()
      reader.onload = (e) => {
        filePreview.value = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }
}

const removeFile = () => {
  if (filePreview.value) {
    URL.revokeObjectURL(filePreview.value)
  }
  uploadedFile.value = null
  filePreview.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleSubmit = async () => {
  if ((!input.value.trim() && !uploadedFile.value) || isLoading.value) return
  
  let message = input.value

  // 如果有文件,添加到消息末尾
  if (uploadedFile.value) {
    const fileContent = isImage.value 
      ? `\n![${uploadedFile.value.name}](${filePreview.value})`
      : `\n[${uploadedFile.value.name}](file://${uploadedFile.value.name})`
    message += fileContent
  }

  input.value = ''
  removeFile()
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

    // 构建息数组
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

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    if (e.shiftKey) {
      // Shift + Enter: 换行
      return
    } else {
      // 仅 Enter: 发送
      e.preventDefault()
      handleSubmit()
    }
  }
}

// 组件卸载时清理
onUnmounted(() => {
  if (filePreview.value) {
    URL.revokeObjectURL(filePreview.value)
  }
})
</script>

<style scoped>
.resize-none {
  resize: none;
}
</style> 