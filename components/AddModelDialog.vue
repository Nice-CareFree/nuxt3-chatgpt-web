<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>添加自定义模型</DialogTitle>
        <DialogDescription>
          添加一个新的自定义模型配置。请填写以下信息。
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="handleSubmit" class="grid gap-4 py-4">
        <div class="grid gap-2">
          <Label for="name">模型名称</Label>
          <Input id="name" v-model="form.name" placeholder="例如: Claude-2" />
        </div>
        <div class="grid gap-2">
          <Label for="id">模型ID</Label>
          <Input id="id" v-model="form.id" placeholder="例如: claude-2" />
        </div>
        <div class="grid gap-2">
          <Label for="description">描述</Label>
          <Textarea 
            id="description" 
            v-model="form.description" 
            placeholder="描述这个模型的特点..."
          />
        </div>
        <div class="grid gap-2">
          <Label for="baseUrl">API地址</Label>
          <Input 
            id="baseUrl" 
            v-model="form.baseUrl" 
            placeholder="https://api.example.com" 
          />
        </div>
        <div class="grid gap-2">
          <Label for="apiKey">API密钥</Label>
          <Input 
            id="apiKey" 
            type="password" 
            v-model="form.apiKey" 
            placeholder="输入API密钥" 
          />
        </div>
        <DialogFooter>
          <Button type="submit">保存</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useModelStore } from '@/stores/model'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const modelStore = useModelStore()

const form = ref({
  name: '',
  id: '',
  description: '',
  baseUrl: '',
  apiKey: '',
  iconName: 'bot' // 默认图标
})

const handleSubmit = () => {
  modelStore.addCustomModel({
    ...form.value,
  })
  emit('update:open', false)
  form.value = {
    name: '',
    id: '',
    description: '',
    baseUrl: '',
    apiKey: '',
    iconName: 'bot'
  }
}
</script> 