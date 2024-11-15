<template>
  <div class="h-screen">
    <!-- PC端使用grid布局,移动端使用flex布局 -->
    <div class="h-full md:grid md:grid-cols-[64px_1fr] flex flex-col">
      <!-- 左侧/底部导航栏 -->
      <aside class="md:relative fixed bottom-0 left-0 right-0 z-50 bg-background md:border-r border-t md:border-t-0">
        <div class="md:flex-col flex">
          <!-- Logo - 仅PC端显示 -->
          <div class="hidden md:flex h-[52px] items-center justify-center border-b">
            <Triangle class="h-7 w-7" />
          </div>

          <!-- 主导航 -->
          <nav class="flex md:flex-col items-center md:justify-start justify-around md:p-2 p-1 w-full">
            <div class="md:space-y-2 md:space-x-0 space-x-2 flex md:flex-col w-full justify-around">
              <TooltipProvider v-for="item in navItems" :key="item.label">
                <Tooltip>
                  <TooltipTrigger as-child>
                    <Button
                      variant="ghost"
                      class="rounded-lg md:p-2 p-3 flex-1 md:flex-none"
                      :class="{ 'bg-muted': item.active }"
                      :aria-label="item.label"
                      @click="item.onClick && item.onClick()"
                    >
                      <component :is="item.icon" class="md:size-5 size-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" :side-offset="5" class="md:hidden">
                    {{ item.label }}
                  </TooltipContent>
                  <TooltipContent side="right" :side-offset="5" class="hidden md:block">
                    {{ item.label }}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </nav>

          <!-- 底部导航 - 仅PC端显示 -->
          <div class="hidden md:block border-t p-2">
            <nav class="flex flex-col space-y-1 items-center">
              <TooltipProvider v-for="item in bottomNavItems" :key="item.label">
                <Tooltip>
                  <TooltipTrigger as-child>
                    <Button variant="ghost" size="icon" class="rounded-lg">
                      <component :is="item.icon" class="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" :side-offset="5">
                    {{ item.label }}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </nav>
          </div>
        </div>
      </aside>

      <!-- 主内容区域 -->
      <main class="flex-1 md:pb-0 pb-16">
        <slot />
      </main>
    </div>

    <!-- 设置弹窗 -->
    <Dialog v-model:open="showSettings">
      <DialogContent class="w-[95vw] md:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>设置</DialogTitle>
        </DialogHeader>
        <SettingsDialog />
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  Triangle, 
  SquareTerminal, 
  Bot, 
  Code2, 
  Book,
  Settings2, 
  LifeBuoy, 
  SquareUser
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const showSettings = ref(false)

// 导航项配置
const navItems = [
  { label: 'Playground', icon: SquareTerminal, active: true },
  { label: 'Models', icon: Bot },
  { label: 'API', icon: Code2 },
  { label: 'Documentation', icon: Book },
  { 
    label: 'Settings', 
    icon: Settings2,
    onClick: () => showSettings.value = true 
  }
]

const bottomNavItems = [
  { label: 'Help', icon: LifeBuoy },
  { label: 'Account', icon: SquareUser }
]
</script> 