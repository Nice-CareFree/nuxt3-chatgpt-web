<template>
  <form class="flex h-screen flex-col gap-6 md:gap-8 p-4 md:p-6 overflow-auto">
    <fieldset class="grid gap-4 md:gap-6 rounded-lg border p-4 md:p-6 shrink-0 bg-card">
      <legend class="px-2 text-sm font-medium">对话设置</legend>
      
      <!-- 模型选择 -->
      <div class="grid gap-2 md:gap-3">
        <Label for="model">模型</Label>
        <Select v-model="chatSettings.model">
          <SelectTrigger id="model" class="items-start">
            <SelectValue>
              <template v-if="chatSettings.model">
                <div class="flex items-center gap-3">
                  <component :is="getModelIcon(chatSettings.model)" class="size-5 shrink-0" />
                  <div class="truncate">
                    {{ getModelName(chatSettings.model) }}
                  </div>
                </div>
              </template>
              <template v-else>
                选择模型
              </template>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <!-- 全局预设模型 -->
            <SelectGroup>
              <SelectLabel>预设模</SelectLabel>
              <SelectItem 
                v-for="model in modelStore.globalModels"
                :key="model.id"
                :value="model.id"
              >
                <div class="flex items-start gap-3 text-muted-foreground">
                  <component :is="getModelIcon(model.id)" class="size-5 shrink-0" />
                  <div class="grid gap-0.5">
                    <p class="font-medium text-foreground">{{ model.name }}</p>
                    <p class="text-xs">{{ model.description }}</p>
                  </div>
                </div>
              </SelectItem>
            </SelectGroup>

            <!-- 自定义模型 -->
            <SelectGroup v-if="modelStore.customModels.length">
              <SelectLabel>自定义模型</SelectLabel>
              <SelectItem 
                v-for="model in modelStore.customModels"
                :key="model.id"
                :value="model.id"
              >
                <div class="flex items-start gap-3 text-muted-foreground">
                  <component :is="getModelIcon(model.id)" class="size-5 shrink-0" />
                  <div class="grid gap-0.5">
                    <p class="font-medium text-foreground">{{ model.name }}</p>
                    <p class="text-xs">{{ model.description }}</p>
                  </div>
                </div>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <!-- 对话参数设置 -->
      <div class="space-y-4 md:space-y-6">
        <!-- Temperature -->
        <div class="grid gap-3">
          <div class="flex items-center justify-between">
            <Label for="temperature">Temperature</Label>
            <span class="text-sm text-muted-foreground">
              {{ chatSettings.temperature[0].toFixed(2) }}
            </span>
          </div>
          <Slider
            v-model="chatSettings.temperature"
            :min="0"
            :max="2"
            :step="0.01"
            class="w-full"
          />
          <p class="text-xs text-muted-foreground">
            较高的值会使输出更加随机，而较低的值会使其更加集中和确定。
          </p>
        </div>

        <!-- Top P -->
        <div class="grid gap-3">
          <div class="flex items-center justify-between">
            <Label for="top-p">Top P</Label>
            <span class="text-sm text-muted-foreground">
              {{ chatSettings.topP[0].toFixed(2) }}
            </span>
          </div>
          <Slider
            v-model="chatSettings.topP"
            :min="0"
            :max="1"
            :step="0.01"
            class="w-full"
          />
          <p class="text-xs text-muted-foreground">
            控制模型输出的多样性，较高的值会产生更多样的结果。
          </p>
        </div>

        <!-- Top K -->
        <div class="grid gap-3">
          <div class="flex items-center justify-between">
            <Label for="top-k">Top K</Label>
            <span class="text-sm text-muted-foreground">
              {{ chatSettings.topK[0] }}
            </span>
          </div>
          <Slider
            v-model="chatSettings.topK"
            :min="0"
            :max="100"
            :step="1"
            class="w-full"
          />
          <p class="text-xs text-muted-foreground">
            限制模型在每一步只考虑概率最高的K个词。0表示不限制。
          </p>
        </div>
      </div>
    </fieldset>

    <!-- 上下文对话 -->
    <div class="flex-1 min-h-0">
      <fieldset class="h-full grid grid-rows-[auto,1fr] gap-4 md:gap-6 rounded-lg border p-4 md:p-6 bg-card">
        <div class="flex items-center justify-between">
          <legend class="px-2 text-sm font-medium">上下文对话</legend>
          <Button 
            type="button"
            variant="outline" 
            size="sm"
            @click.prevent="addContextMessage"
            class="gap-1.5"
          >
            <Plus class="h-4 w-4" />
            新增
          </Button>
        </div>

        <!-- 上下文对话列表 - 减小高度到 300px -->
        <div class="overflow-y-auto pr-2">
          <div class="space-y-6">
            <div 
              v-for="(message, index) in chatSettings.contextMessages" 
              :key="index"
              class="relative grid gap-4 rounded-lg border p-6 bg-muted/50"
            >
              <!-- 删除按钮 -->
              <Button
                type="button"
                variant="ghost"
                size="icon"
                class="absolute right-3 top-3 h-6 w-6 hover:bg-destructive/90 hover:text-destructive-foreground"
                @click.prevent="removeContextMessage(index)"
              >
                <X class="h-4 w-4" />
              </Button>

              <!-- 角色选择 -->
              <div class="grid gap-2">
                <Label>角色</Label>
                <Select v-model="message.role">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="选择角色" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">系统</SelectItem>
                    <SelectItem value="assistant">助手</SelectItem>
                    <SelectItem value="user">用户</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <!-- 内容输入 -->
              <div class="grid gap-2">
                <Label>内容</Label>
                <Textarea
                  v-model="message.content"
                  :rows="3"
                  placeholder="输入对话内容..."
                  class="resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { Bird, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select'
import { useChatStore } from '@/stores/chat'
import { useModelStore } from '@/stores/model'
import { storeToRefs } from 'pinia'
import { useDebounceFn } from '@vueuse/core'
import { Plus} from 'lucide-vue-next'

const chatStore = useChatStore()
const modelStore = useModelStore()

// 从model store获取带图标的模型列表
const { modelsWithIcons } = storeToRefs(modelStore)

// 添加初始化标志
const isInitializing = ref(true)
const isUpdatingSettings = ref(false)

// 修改默认设置的类型定义
const defaultSettings = {
  model: 'gpt-3.5-turbo',
  temperature: 0.7,  // 改回单个数值
  topP: 0.9,        // 改回单个数值
  topK: 0,          // 改回单个数值
  contextMessages: [] as Array<{
    role: 'system' | 'assistant' | 'user'
    content: string
  }>
}

// 当前对话的设置
const chatSettings = ref({
  model: defaultSettings.model,
  temperature: [defaultSettings.temperature], // 转换为数组用于slider
  topP: [defaultSettings.topP],              // 转换为数组用于slider
  topK: [defaultSettings.topK],              // 转换为数组用于slider
  contextMessages: [...defaultSettings.contextMessages]
})

// 修改类型定义
interface ChatSettings {
  model: string
  temperature: number[]  // 改为数类型
  topP: number[]        // 改为数组类型
  topK: number[]        // 改为数组类型
  contextMessages: Array<{
    role: 'system' | 'assistant' | 'user'
    content: string
  }>
}

// 监听当前对话ID的变化
watch(() => chatStore.currentChatId, async (newId) => {
  if (!newId) return
  
  isInitializing.value = true
  const currentChat = chatStore.chats.find(chat => chat.id === newId)
  
  if (currentChat?.settings) {
    // 加载当前对话的设置
    chatSettings.value = {
      model: currentChat.settings.model || defaultSettings.model,
      temperature: [currentChat.settings.temperature || defaultSettings.temperature],
      topP: [currentChat.settings.topP || defaultSettings.topP],
      topK: [currentChat.settings.topK || defaultSettings.topK],
      contextMessages: [...(currentChat.settings.contextMessages || [])]
    }
  } else {
    // 使用默认设置
    chatSettings.value = {
      model: defaultSettings.model,
      temperature: [defaultSettings.temperature],
      topP: [defaultSettings.topP],
      topK: [defaultSettings.topK],
      contextMessages: []
    }
  }
  
  // 添加nextTick等待DOM更新
  await nextTick()
  isInitializing.value = false
}, { immediate: true })

// 修改watch实现,一次性保存所有设置
watch(chatSettings, (newSettings) => {
  if (isInitializing.value) return
  
  // 保存设置到当前对话
  if (chatStore.currentChatId) {
    const settingsToSave = {
      model: newSettings.model,
      temperature: newSettings.temperature[0],
      topP: newSettings.topP[0],
      topK: newSettings.topK[0],
      contextMessages: newSettings.contextMessages
    }
    
    console.log('Saving all settings:', settingsToSave)
    chatStore.updateChatSettings(chatStore.currentChatId, settingsToSave)
  }
}, { deep: true })

// 获取模型图标
function getModelIcon(modelId: string) {
  const model = modelsWithIcons.value.find(m => m.id === modelId)
  return model?.icon || Bird
}

// 获取模型名称
function getModelName(modelId: string) {
  const model = modelsWithIcons.value.find(m => m.id === modelId)
  return model?.name || modelId
}

// 添加上下文对话
function addContextMessage() {
  chatSettings.value.contextMessages.push({
    role: 'system',
    content: ''
  })
}

// 删除上下文对话
function removeContextMessage(index: number) {
  chatSettings.value.contextMessages.splice(index, 1)
}

// 暴露给父组件
defineExpose({
  chatSettings
})

// 在组件挂载时加载自定义模型

</script> 