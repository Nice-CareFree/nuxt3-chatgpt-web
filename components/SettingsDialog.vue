<template>
  <div class="w-full">
    <Tabs default-value="general" class="w-full">
      <!-- Tab List -->
      <TabsList class="grid w-full grid-cols-2 md:grid-cols-4">
        <TabsTrigger value="general">通用</TabsTrigger>
        <TabsTrigger value="model">模型</TabsTrigger>
        <TabsTrigger value="api">API</TabsTrigger>
        <TabsTrigger value="about">关于</TabsTrigger>
      </TabsList>

      <!-- 移除原来的Card相关组件，直接使用div -->
      <div class="py-2 md:py-4">
        <!-- 通用设置 -->
        <TabsContent value="general">
          <div class="space-y-4">
            <div class="space-y-2">
              <Label>主题设置</Label>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="outline" class="w-full justify-between">
                    <div class="flex items-center gap-2">
                      <Icon 
                        icon="radix-icons:moon" 
                        class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" 
                      />
                      <Icon 
                        icon="radix-icons:sun" 
                        class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" 
                      />
                      <span>
                        {{ 
                          colorMode.preference === 'light' ? '浅色' :
                          colorMode.preference === 'dark' ? '深色' : '跟随系统'
                        }}
                      </span>
                    </div>
                    <Icon icon="radix-icons:chevron-down" class="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" class="w-[160px]">
                  <DropdownMenuItem @click="colorMode.preference = 'light'">
                    <Icon icon="radix-icons:sun" class="mr-2 h-4 w-4" />
                    <span>浅色</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="colorMode.preference = 'dark'">
                    <Icon icon="radix-icons:moon" class="mr-2 h-4 w-4" />
                    <span>深色</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="colorMode.preference = 'system'">
                    <Icon icon="radix-icons:desktop" class="mr-2 h-4 w-4" />
                    <span>跟随系统</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button @click="resetUserInfo">重置用户信息</Button>
          </div>
        </TabsContent>

        <!-- 模型设置 -->
        <TabsContent value="model">
          <div class="space-y-4">
            <div class="space-y-2">
              <Label>全局模型</Label>
              <Select v-model="settings.defaultModel">
                <SelectTrigger>
                  <SelectValue placeholder="选择模型" />
                </SelectTrigger>
                <SelectContent>
                  <!-- 预设模型 -->
                  <SelectGroup>
                    <SelectLabel>预设模型</SelectLabel>
                    <SelectItem 
                      v-for="model in availableModels" 
                      :key="model.id"
                      :value="model.id"
                    >
                      {{ model.name }}
                    </SelectItem>
                  </SelectGroup>
                  
                  <!-- 自定义模型 -->
                  <SelectGroup v-if="settings.customModels.length">
                    <SelectLabel>自定义模型</SelectLabel>
                    <SelectItem
                      v-for="model in settings.customModels"
                      :key="model.id"
                      :value="model.id"
                    >
                      {{ model.name }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <!-- 自定义模型 -->
            <div class="space-y-2">
              <Label>自定义模型</Label>
              <div class="space-y-2">
                <div v-for="(model, index) in settings.customModels" :key="index" class="flex gap-2">
                  <Input 
                    v-model="model.name" 
                    placeholder="模型名称"
                    @blur="validateAndUpdateModel(index)" 
                  />
                  <Button variant="outline" size="icon" @click="removeCustomModel(index)">
                    <X class="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" @click="addCustomModel">添加模型</Button>
              </div>
            </div>

            <div class="space-y-2">
              <Label>历史上下文数量</Label>
              <Input 
                type="number" 
                v-model="settings.contextCount" 
                min="0"
                max="20"
                placeholder="默认为5"
              />
              <p class="text-sm text-muted-foreground">
                每次对话携带的历史消息组数(每组包含一问一答)
              </p>
            </div>

            <div class="space-y-2">
              <Label>全局回复数</Label>
              <Input type="number" v-model="settings.responseCount" />
            </div>

            <div class="space-y-2">
              <Label>角色设定</Label>
              <Textarea v-model="settings.systemContent" placeholder="输入系统角色设定..." />
            </div>
          </div>
        </TabsContent>

        <!-- API设置 -->
        <TabsContent value="api">
          <div class="space-y-4">
            <div class="space-y-2">
              <Label>OpenAI API地址</Label>
              <Input v-model="settings.apiEndpoint" placeholder="https://api.openai.com" />
            </div>
            <div class="space-y-2">
              <Label>OpenAI API Key</Label>
              <Input 
                type="password" 
                v-model="settings.apiKey" 
                placeholder="sk-..." 
              />
            </div>
          </div>
        </TabsContent>

        <!-- 关于 -->
        <TabsContent value="about">
          <div class="space-y-4">
            <h3 class="text-lg font-medium">关于本站</h3>
            <p class="text-muted-foreground">
              这是一个基于 Vue 3 + Nuxt 3 开发的 AI 聊天应用...
            </p>
            <p class="text-muted-foreground">
              项目开源地址: <a href="https://github.com/Nice-CareFree/nuxt3-chatgpt-web" class="text-primary">GitHub</a>
            </p>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { X } from 'lucide-vue-next'
import { Icon } from '@iconify/vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useModelStore } from '@/stores/model'

const colorMode = useColorMode()
const modelStore = useModelStore()

interface CustomModel {
  name: string
  id: string
}

interface Settings {
  defaultModel: string
  customModels: CustomModel[]
  contextCount: number
  responseCount: number
  systemContent: string
  apiEndpoint: string
  apiKey: string
}

// 预设可用模型
const availableModels = [
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  { id: 'gpt-4', name: 'GPT-4' },
]

// 设置数据的初始化
const settings = ref<Settings>({
  defaultModel: 'gpt-3.5-turbo', // 确保有默认值
  customModels: [],
  contextCount: 5,
  responseCount: 1,
  systemContent: '',
  apiEndpoint: 'https://api.openai.com',
  apiKey: ''
})

// 从localStorage加载设置
onMounted(() => {
  const savedSettings = localStorage.getItem('settings')
  if (savedSettings) {
    const parsed = JSON.parse(savedSettings)
    // 确保defaultModel有值
    if (!parsed.defaultModel) {
      parsed.defaultModel = 'gpt-3.5-turbo'
    }
    settings.value = parsed
  }
})

// 保存设置到localStorage前的验证
function saveSettings() {
  // 确保defaultModel不为空
  if (!settings.value.defaultModel) {
    settings.value.defaultModel = 'gpt-3.5-turbo'
  }
  localStorage.setItem('settings', JSON.stringify(settings.value))
}

// 添加自定义模型
function addCustomModel() {
  const defaultName = `自定义模型${settings.value.customModels.length + 1}`
  const newModel = {
    name: defaultName,
    id: defaultName,
    iconName: 'bot',
    description: ''
  }
  settings.value.customModels.push(newModel)
}

// 验证并更新模型
function validateAndUpdateModel(index: number) {
  const model = settings.value.customModels[index]
  if (!model.name.trim()) {
    // 如果名称为空，移除该模型
    settings.value.customModels.splice(index, 1)
  } else {
    // 确保ID与name一致
    model.id = model.name.trim()
    
    // 如果这是当前选中的模型,需要更新defaultModel
    if (settings.value.defaultModel === model.id) {
      settings.value.defaultModel = model.name
    }
  }
  saveSettings()
}

// 删除自定义模型
function removeCustomModel(index: number) {
  const removedModel = settings.value.customModels[index]
  settings.value.customModels.splice(index, 1)
  
  // 如果删除的是当前选中的模型，重置为默认模型
  if (settings.value.defaultModel === removedModel.id) {
    settings.value.defaultModel = 'gpt-3.5-turbo'
  }
  
  saveSettings()
}

// 重置用户信息
function resetUserInfo() {
  // 实现重置用户信息的逻辑
  localStorage.removeItem('user-info')
}

// 监听设置变化并保存
watch(settings, () => {
  saveSettings()
  modelStore.loadCustomModels()
}, { deep: true })
</script> 