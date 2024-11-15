<template>
  <Card class="w-full max-w-2xl mx-auto">
    <CardHeader>
      <CardTitle>AI 助手</CardTitle>
      <CardDescription>
        与AI助手进行对话
      </CardDescription>
    </CardHeader>
    
    <CardContent>
      <ScrollArea ref="scrollArea" class="h-[600px] pr-4">
        <div class="flex flex-col gap-2">
          <ChatMessage
            v-for="message in messages"
            :key="message.id"
            :message="message"
          />
        </div>
      </ScrollArea>
    </CardContent>

    <CardFooter>
      <form @submit.prevent="sendMessage" class="flex w-full gap-2">
        <Input
          v-model="input"
          placeholder="输入消息..."
          :disabled="isLoading"
        />
        <Button type="submit" :disabled="isLoading || !input">
          发送
        </Button>
      </form>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import type { ChatMessage } from '~/types/chat'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

const messages = ref<ChatMessage[]>([])
const input = ref('')
const isLoading = ref(false)
const scrollArea = ref<InstanceType<typeof ScrollArea>>()

// 滚动到底部函数
const scrollToBottom = async () => {
  await nextTick()
  if (scrollArea.value) {
    const element = scrollArea.value.$el
    element.scrollTop = element.scrollHeight
  }
}

async function sendMessage() {
  if (!input.value.trim() || isLoading.value) return
  
  // 添加用户消息
  const userMessage: ChatMessage = {
    id: Date.now().toString(),
    role: 'user',
    content: input.value,
    timestamp: new Date()
  }
  messages.value.push(userMessage)
  await scrollToBottom()
  
  // 清空输入
  input.value = ''
  isLoading.value = true
  
  try {
    // 模拟AI响应
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const aiMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: '这是一个模拟的AI响应。',
      timestamp: new Date()
    }
    messages.value.push(aiMessage)
    await scrollToBottom()
  } finally {
    isLoading.value = false
  }
}
</script> 