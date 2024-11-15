<template>
  <div :class="[
    'flex gap-3 md:p-4 p-3',
    message.role === 'assistant' ? 'bg-muted/50' : 'bg-background',
    message.error ? 'border-red-200 bg-red-50 dark:bg-red-950/50' : ''
  ]">
    <div class="md:w-8 w-7 md:h-8 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm md:text-base">
      {{ message.role === 'assistant' ? 'AI' : '你' }}
    </div>
    <div class="flex-1 space-y-2">
      <div :class="[
        'prose prose-neutral dark:prose-invert max-w-none md:prose-base prose-sm',
        message.error ? 'text-red-600 dark:text-red-400' : ''
      ]">
        <MdPreview :modelValue="messageContent" :codeFoldable="false" />
      </div>
      <div class="text-[10px] md:text-xs text-muted-foreground">
        {{ formattedTime }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { MdPreview } from "md-editor-v3"
import "md-editor-v3/lib/style.css"

interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
  timestamp: Date
  error?: boolean
}

const props = defineProps<{
  message: Message
}>()

function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 使用计算属性优化渲染
const formattedTime = computed(() => {
  return formatTime(props.message.timestamp)
})

const messageContent = computed(() => {
  return props.message.content
})
</script> 