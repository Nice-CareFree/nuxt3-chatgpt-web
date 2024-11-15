<template>
      <div class="h-full">
        <!-- PC端布局 -->
        <div class="hidden md:grid md:grid-cols-[300px_1fr_400px] h-full">
          <!-- PC端对话列表 -->
          <div class="border-r bg-background">
            <ChatList @select-chat="closeChatList" />
          </div>
    
          <!-- PC端中间对话区域 -->
          <div class="flex flex-col h-full">
            <!-- 头部和其他内容保持不变 -->
            <header class="flex-shrink-0 flex h-[53px] items-center gap-1 border-b bg-background px-4">
              <h1 class="text-xl font-semibold">
                {{ chatStore.currentChat?.title || 'Playground' }}
              </h1>
              <Button variant="outline" size="sm" class="ml-auto gap-1.5 text-sm">
                <Share2 class="size-3.5" />
                Share
              </Button>
            </header>
    
            <!-- 对话区域内容保持不变 -->
            <main class="flex-1 p-4">
              <div class="flex flex-col h-full rounded-xl bg-muted/50 md:p-4 p-2">
                <!-- 消息列表区域 - 固定高度，可滚动 -->
                <div ref="pcMessageListRef" 
                     class="message-list overflow-y-scroll pr-2 scroll-smooth"
                     :class="[
                       'md:h-[calc(100vh-53px-32px-32px-120px)]'
                     ]">
                  <div class="md:space-y-4 space-y-2">
                    <ChatMessage
                      v-for="message in chatStore.currentChat?.messages"
                      :key="message.timestamp.getTime()"
                      :message="message"
                    />
                  </div>
                </div>
                
                <!-- 输入框区域 -->
                <div class="md:h-[120px] h-[100px] flex-shrink-0 md:mt-4 mt-2">
                  <ChatInput
                    :context-messages="configPanelRef?.chatSettings?.contextMessages"
                    :model="configPanelRef?.chatSettings?.model"
                    :temperature="configPanelRef?.chatSettings?.temperature?.[0]"
                    :top-p="configPanelRef?.chatSettings?.topP?.[0]"
                    @send="handleSend"
                    @receive="handleReceive"
                    @complete="handleComplete"
                  />
                </div>
              </div>
            </main>
          </div>
    
          <!-- PC端配置面板 -->
          <div class="border-l bg-background">
            <ConfigPanel ref="configPanelRef" />
          </div>
        </div>
    
        <!-- 移动端布局 -->
        <div class="md:hidden h-full relative">
          <!-- 移动端对话列表 -->
          <div class="fixed inset-0 z-50 w-80 bg-background transition-transform duration-200 ease-in-out" 
               :class="[showChatList ? 'translate-x-0' : '-translate-x-full']">
            <ChatList @select-chat="closeChatList" />
          </div>
    
          <!-- 移动端主内容区域 -->
          <div class="flex flex-col h-full">
            <!-- 移动端头部 -->
            <header class="flex-shrink-0 flex h-[53px] items-center gap-1 border-b bg-background px-4">
              <Button variant="ghost" size="icon" class="mr-2" @click="toggleChatList">
                <Menu class="size-5" />
              </Button>
              <h1 class="text-xl font-semibold">
                {{ chatStore.currentChat?.title || 'Playground' }}
              </h1>
              <Button variant="ghost" size="icon" class="ml-auto" @click="toggleConfig">
                <Settings2 class="size-5" />
              </Button>
            </header>
    
            <!-- 移动端对话区域 -->
            <main class="flex-1 p-2">
              <div class="flex flex-col h-full rounded-xl bg-muted/50 md:p-4 p-2">
                <!-- 消息列表区域 - 固定高度，可滚动 -->
                <div ref="mobileMessageListRef" 
                     class="message-list overflow-y-scroll pr-2 scroll-smooth"
                     :class="[
                       'h-[calc(100vh-53px-16px-16px-100px-64px)]'
                     ]">
                  <div class="md:space-y-4 space-y-2">
                    <ChatMessage
                      v-for="message in chatStore.currentChat?.messages"
                      :key="message.timestamp.getTime()"
                      :message="message"
                    />
                  </div>
                </div>
                
                <!-- 输入框区域 -->
                <div class="md:h-[120px] h-[100px] flex-shrink-0 md:mt-4 mt-2">
                  <ChatInput
                    :context-messages="configPanelRef?.chatSettings?.contextMessages"
                    :model="configPanelRef?.chatSettings?.model"
                    :temperature="configPanelRef?.chatSettings?.temperature?.[0]"
                    :top-p="configPanelRef?.chatSettings?.topP?.[0]"
                    @send="handleSend"
                    @receive="handleReceive"
                    @complete="handleComplete"
                  />
                </div>
              </div>
            </main>
          </div>
    
          <!-- 移动端配置面板 -->
          <div class="fixed inset-y-0 right-0 z-50 w-80 bg-background transition-transform duration-200 ease-in-out"
               :class="[showConfig ? 'translate-x-0' : 'translate-x-full']">
            <ConfigPanel />
          </div>
    
          <!-- 移动端遮罩层 -->
          <div v-if="showChatList || showConfig" 
               class="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
               @click="closeAll">
          </div>
        </div>
      </div>
    </template>
    
    <script setup lang="ts">
    import { ref, onMounted, nextTick, onUnmounted, watch } from 'vue'
    import { Share2, Plus, Menu, Settings2 } from 'lucide-vue-next'
    import { useChatStore } from '@/stores/chat'
    import { useModelStore } from '@/stores/model'
    import { Button } from '@/components/ui/button'
    import type { ComponentPublicInstance } from 'vue'
    import type ConfigPanel from '@/components/ConfigPanel.vue'  // 请根据实际路径调整
    
    const chatStore = useChatStore()
    const modelStore = useModelStore()
    const configPanelRef = ref<InstanceType<typeof ConfigPanel> | null>(null)
    const pcMessageListRef = ref<HTMLDivElement | null>(null)
    const mobileMessageListRef = ref<HTMLDivElement | null>(null)
    let scrollInterval: number | null = null
    
    // 添加状态控制
    const showChatList = ref(false)
    const showConfig = ref(false)
    
    onMounted(() => {
      modelStore.init()
      chatStore.init()
    })
    
    function handleSend(message: string) {
      chatStore.addMessage({
        role: 'user',
        content: message,
        error: false,
        timestamp: new Date()
      })
      
      // 等待DOM更新后滚动
      nextTick(() => {
        requestAnimationFrame(() => {
          scrollToBottom()
        })
      })
    }
    
    function handleReceive(content: string, isError = false) {
      const currentChat = chatStore.currentChat
      
      if (currentChat?.messages[currentChat.messages.length - 1].role === 'user') {
        chatStore.addMessage({
          role: 'assistant',
          content: content,
          error: isError,
          timestamp: new Date()
        })
      } else {
        chatStore.updateLastMessage(content, isError)
      }
      
      if (isError) {
        stopScrollInterval()
        requestAnimationFrame(() => {
          scrollToBottom()
        })
        return
      }
      
      if (!scrollInterval) {
        requestAnimationFrame(() => {
          startScrollInterval()
        })
      }
    }
    
    // 新增处理函数
    function handleCreateChat(e: Event) {
      e.preventDefault()
      chatStore.createChat()
    }
    
    // 添加滚动到底部的函数
    const scrollToBottom = async () => {
      console.log('scrollToBottom')
      await nextTick()
      
      // 根据视口宽度选择正确的ref
      const isMobile = window.innerWidth < 768
      const element = isMobile ? mobileMessageListRef.value : pcMessageListRef.value
      
      if (!element) {
        console.warn('messageListRef is null')
        return
      }
      
      // 确保内容已经渲染
      await new Promise(resolve => setTimeout(resolve, 10))
      
      try {
        element.scrollTo({
          top: element.scrollHeight,
          behavior: 'smooth'
        })
      } catch (e) {
        console.error('Scroll failed, fallback to scrollTop', e)
        element.scrollTop = element.scrollHeight
      }
    }
    
    // 开始定时滚动
    const startScrollInterval = () => {
      stopScrollInterval()
      scrollToBottom()
      
      // 使用 requestAnimationFrame 实现平滑滚动
      let lastScrollTime = 0
      const scrollLoop = (timestamp: number) => {
        if (!scrollInterval) return
        
        if (timestamp - lastScrollTime >= 500) { // 改为500ms
          scrollToBottom()
          lastScrollTime = timestamp
        }
        
        scrollInterval = window.requestAnimationFrame(scrollLoop)
      }
      
      scrollInterval = window.requestAnimationFrame(scrollLoop)
    }
    
    // 停止定时滚动
    const stopScrollInterval = () => {
      if (scrollInterval) {
        window.cancelAnimationFrame(scrollInterval)
        scrollInterval = null
      }
    }
    
    // 组件卸载时清理定时器
    onUnmounted(() => {
      stopScrollInterval()
    })
    
    function handleComplete() {
      stopScrollInterval()
      
      // 确保最后滚动到底部
      requestAnimationFrame(() => {
        scrollToBottom()
        
        // 100ms后再次确认滚动到底部
        setTimeout(() => {
          requestAnimationFrame(() => {
            scrollToBottom()
          })
        }, 100)
      })
    }
    
    // 监听当前对话ID的变化
    watch(
      () => chatStore.currentChatId,
      () => {
        nextTick(() => {
          requestAnimationFrame(() => {
            scrollToBottom()
          })
        })
      }
    )
    
    function toggleChatList() {
      showChatList.value = !showChatList.value
      showConfig.value = false
    }
    
    function toggleConfig() {
      showConfig.value = !showConfig.value
      showChatList.value = false
    }
    
    function closeAll() {
      showChatList.value = false
      showConfig.value = false
    }
    
    function closeChatList() {
      showChatList.value = false
    }
    </script> 
    