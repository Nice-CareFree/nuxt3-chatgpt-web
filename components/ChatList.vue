<template>
  <div class="flex h-full w-[300px] flex-col border-r">
    <!-- 新建对话按钮 -->
    <div class="p-2 border-b">
      <Button 
        class="w-full" 
        type="button" 
        @click.prevent="chatStore.createChat"
      >
        <Plus class="mr-2 h-4 w-4" />
        新建对话
      </Button>
    </div>
    
    <!-- 对话列表 -->
    <div class="flex-1 overflow-auto">
      <div class="space-y-2 p-4">
        <div
          v-for="chat in chatStore.chats"
          :key="chat.id"
          class="relative group"
        >
          <Button
            variant="ghost"
            class="w-full justify-start !py-6"
            :class="{ 'bg-muted': chat.id === chatStore.currentChatId }"
            @click="chatStore.selectChat(chat.id)"
          >
            <MessageSquare class="mr-2 h-4 w-4" />
            <div class="flex-1 text-left">
              <template v-if="editingChatId === chat.id">
                <input
                  type="text"
                  v-model="editingTitle"
                  class="w-full bg-transparent text-sm font-medium focus:outline-none"
                  @blur="handleEdit(chat.id)"
                  @keydown="handleEditKeydown"
                  v-focus
                />
              </template>
              <template v-else>
                <div class="text-sm font-medium">{{ chat.title }}</div>
                <div class="text-xs text-muted-foreground">{{ formatDate(chat.createdAt) }}</div>
              </template>
            </div>
          </Button>
          
          <!-- 编辑按钮 -->
          <Button
            variant="ghost"
            size="icon"
            class="absolute right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            @click.stop="startEdit(chat, $event)"
          >
            <Pencil class="h-4 w-4 text-muted-foreground hover:text-primary" />
          </Button>

          <!-- 删除按钮 -->
          <Button
            variant="ghost"
            size="icon"
            class="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            @click.stop="confirmDelete(chat.id)"
          >
            <Trash2 class="h-4 w-4 text-muted-foreground hover:text-destructive" />
          </Button>
        </div>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <AlertDialog v-model:open="showDeleteDialog">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除对话</AlertDialogTitle>
          <AlertDialogDescription>
            此操作将永久删除该对话及其所有内容，无法恢复。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="showDeleteDialog = false">取消</AlertDialogCancel>
          <AlertDialogAction @click="handleDelete">删除</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, MessageSquare, Trash2, Pencil } from 'lucide-vue-next'
import { useChatStore } from '@/stores/chat'

const chatStore = useChatStore()
const showDeleteDialog = ref(false)
const chatToDelete = ref<string | null>(null)
const editingChatId = ref<string | null>(null)
const editingTitle = ref('')

// 自动聚焦指令
const vFocus = {
  mounted: (el: HTMLElement) => el.focus()
}

onMounted(() => {
  chatStore.loadChats()
})

function startEdit(chat: { id: string, title: string }, event: Event) {
  event.stopPropagation()
  editingChatId.value = chat.id
  editingTitle.value = chat.title
}

function handleEdit(chatId: string) {
  if (!editingTitle.value.trim()) return
  chatStore.updateChatTitle(chatId, editingTitle.value.trim())
  editingChatId.value = null
}

function handleEditKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    handleEdit(editingChatId.value!)
  } else if (e.key === 'Escape') {
    editingChatId.value = null
  }
}

function confirmDelete(id: string) {
  chatToDelete.value = id
  showDeleteDialog.value = true
}

function handleDelete() {
  if (!chatToDelete.value) return
  chatStore.deleteChat(chatToDelete.value)
  showDeleteDialog.value = false
  chatToDelete.value = null
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script> 