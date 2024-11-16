<template>
  <div :class="[
    'flex gap-3 md:p-4 p-3 rounded-lg relative group',
    message.role === 'assistant' ? 'bg-muted/100' : 'bg-background',
    message.error ? 'border-red-200 bg-red-50 dark:bg-red-950/50' : ''
  ]">
    <div class="md:w-8 w-7 md:h-8 h-7 rounded-full mt-4 flex items-center justify-center text-primary-foreground text-sm md:text-base">
      <svg t="1731660462367" v-if="message.role === 'assistant'" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9065" width="32" height="32"><path d="M0 0m327.68 0l368.64 0q327.68 0 327.68 327.68l0 368.64q0 327.68-327.68 327.68l-368.64 0q-327.68 0-327.68-327.68l0-368.64q0-327.68 327.68-327.68Z" fill="#000000" p-id="9066"></path><path d="M500.67456 437.16608l-29.4912 125.44a29.9008 29.9008 0 0 0-1.59744 9.74848c0 7.45471999 2.00704 12.51328 6.00064 15.23712 3.97312 2.70336 9.15456 3.6864 15.52384 2.90816 4.25984-0.512 8.64256-1.6384 13.14816-3.35872 1.2288 5.0176 4.3008 11.18208 9.25696 18.47296 4.95616 7.29087999 11.42784 13.57824 19.456 18.86208-1.39264 0.73728-5.36576 3.54304-6.81984 4.3008-7.168 3.66592-14.95040001 7.24992-21.2992 9.07264a195.25632 195.25632 0 0 1-33.64864 6.84032c-20.19328 2.41664-36.39296-1.024-48.61952-10.30144-12.20608-9.29792-18.30912-23.10144-18.30912-41.43104 0-3.9936 0.38912-8.0896 1.18784-12.288 0.79872-4.21888 1.72032-8.51968 2.78528-12.9024l18.3296-72.2944-40.5504 4.85376 11.42784-50.76992 103.2192-12.3904z m129.47456-20.31616c18.06336-2.17088 33.66912-0.2048 46.81728 5.9392 9.23648 4.3008 16.67071999 8.82688 22.9376 14.15168a142.92992 142.92992 0 0 0-16.50688 22.24128c-3.80928 6.43072-8.02816 15.23712-12.6976 26.4192-6.3488-6.12352-14.78656-12.0832-22.2208-14.37696001a53.3504 53.3504 0 0 0-22.3232-2.10943999c-6.90176 0.8192-13.47584001 3.21536-19.70176 7.168a69.65248 69.65248 0 0 0-17.14176 15.58528 77.96736 77.96736 0 0 0-16.52736 48.18944c0 13.824 4.23935999 23.552 12.73856 29.16351999 8.4992 5.61152 18.06336 7.7824 28.69248 6.51264001 9.29792-1.1264 17.408-4.096 24.30976-8.88832 6.90176-4.8128 21.05344-17.24416 28.24192-23.94112 0.55296 9.74848 1.88416 17.94048 3.95264 24.59648 2.4576 7.90528 6.06208 15.38048 10.81344 22.46656a135.7824 135.7824 0 0 1-33.85344 25.55904 120.46336 120.46336 0 0 1-43.008 13.14816c-17.28512 2.048-33.21856 0.79872-47.8208-3.82976a69.0176 69.0176 0 0 1-35.26656-24.65792c-8.88832-11.81695999-13.33248-27.40224-13.33248-46.7968 0-18.32960001 3.23584-35.38944 9.74848-51.17952a135.29088 135.29088 0 0 1 26.70592-41.63584 144.7936 144.7936 0 0 1 38.83008-29.36832 135.08608 135.08608 0 0 1 46.61248-14.336z m161.54624-19.37408c26.29632-3.1744 46.6944 1.69984 61.15328 14.56128 14.47936 12.86144 21.7088 30.98624 21.7088 54.3744 0 8.74496-0.9216 17.42847999-2.78528 26.0096-1.8432 8.6016-3.31775999 14.82752-4.38271999 18.65728-52.67456 5.632-93.14304 9.95328-121.38496001 13.0048-0.2048-6.57408 0-12.86144 0.67584-18.8416 0.65536-6.00064001 2.10944-11.6736 4.36224-17.08032l64.55296-8.4992c0.53248-2.60095999 0.8192-5.07904 0.8192-7.4752 0-9.8304-2.41664-16.83456-7.18848-21.05344-4.77184-4.1984-11.1616-5.8368-19.12831999-4.87424-5.3248 0.63488-10.87488 2.64192-16.73216001 6.00064a63.6928 63.6928 0 0 0-16.52736 14.13120001 73.70752 73.70752 0 0 0-12.88192 22.60991999c-3.31776 9.03168-4.85376 19.68128-4.85376 31.90784 0 11.40736 1.92512 20.00896 5.77536 25.8048 3.85024 5.77536 8.97024 9.46176 15.36 11.10016 6.3488 1.6384 13.12768 2.00703999 20.29568 1.14688a85.9136 85.9136 0 0 0 29.4912-8.92928001c9.0112-4.66944 18.06336-10.32192 27.09503999-16.99839999l20.70528001 39.75168a154.95168 154.95168 0 0 1-41.82016 24.14592c-15.6672 6.144-32.54272 10.28096-50.5856 12.45184-16.9984 2.048-32.27648 0.73728-45.83424-3.87072a61.21472 61.21472 0 0 1-32.256-25.1904c-7.9872-12.20608-11.96032-28.672-11.96032-49.37728a131.8912 131.8912 0 0 1 35.06176-90.84928 138.752 138.752 0 0 1 37.25312-28.77440001 125.21472 125.21472 0 0 1 44.03199999-13.84447999z m-512.32768 6.49216l22.71232 120.77056 8.35584 56.38144001 1.59744-0.20480001c0.53248-6.9632 1.26976-15.09376 2.19136-24.3712 0.94208001-9.25696 1.86368-18.59584 2.78528-28.01664a771.8912 771.8912 0 0 1 5.79584-45.30176l16.73216-86.46656 60.14976-7.22944-51.79392 265.17504-62.1568 7.45472-25.088-120.48384-8.37632-56.36096-1.57696 0.18431999a2822.00064 2822.00064 0 0 1-6.77888 70.53312001c-1.3312 12.10368-2.78528001 22.50752-4.38272 31.19104l-15.54432 82.3296L163.84 676.80256 215.63392 411.648l63.73376-7.65952z m199.00416-68.5056c11.40736001-1.35168 20.84864 0.4096 28.2624 5.38624 7.45472 4.93568 11.1616 13.12768 11.1616 24.55552 0 11.93984-4.36224 22.4256-13.12768 31.45728a51.8144 51.8144 0 0 1-31.88736 15.7696c-10.07616 1.2288-19.10784-0.55296-27.07456-5.3248-7.9872-4.75136-11.96032-12.96384-11.96032-24.65792 0-7.43424 1.98656-14.58176 5.98016-21.42208001 3.97312-6.8608 9.29792-12.5952 15.93344-17.24415999a49.152 49.152 0 0 1 22.71232-8.51968z" fill="#FFE028" p-id="9067"></path><path d="M740.67968 247.808c-5.77536 18.6368-11.59168 31.58016-17.48992 38.74816-5.89824001 7.18848-16.09728 13.80352-30.6176 19.8656 12.82048 6.92224 22.26176 14.45888 28.32384 22.56896 6.08256 8.11008 12.65664001 22.016 19.78368 41.69728 6.43072-20.62336 12.32896-34.52928 17.69472-41.69728 5.36576-7.168 15.48288-14.68416 30.39232-22.56896-14.58176-6.30784-24.69888001-12.92288-30.39232-19.8656-5.69344-6.92224-11.59168-19.84512-17.69472-38.74816z" fill="#FFE028" p-id="9068"></path></svg>
      <svg t="1731660537709" v-else class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15500" width="32" height="32"><path d="M0.000205 113.868959v796.262082A113.663955 113.663955 0 0 0 113.868959 1023.999795h796.262082A114.073554 114.073554 0 0 0 1023.999795 910.131041V113.868959A114.073554 114.073554 0 0 0 910.131041 0.000205H113.868959A113.663955 113.663955 0 0 0 0.000205 113.868959z m682.598127 227.532709A170.598332 170.598332 0 1 1 512 170.598537a170.393532 170.393532 0 0 1 170.598332 170.803131z m-511.999795 455.065418c0-113.868754 227.532709-176.332729 341.401463-176.332729s341.401463 61.439975 341.401463 176.332729v56.934377H170.598537v-56.934377z" fill="#4C84FF" p-id="15501"></path></svg>
    </div>
    <div class="flex-1 space-y-2 w-2 overflow-auto">
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
    
    <Button
      variant="ghost"
      size="icon"
      class="absolute right-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
      @click.stop="copyContent"
    >
      <Copy v-if="!copied" class="h-4 w-4 text-muted-foreground hover:text-primary" />
      <Check v-else class="h-4 w-4 text-green-500" />
    </Button>

    <Button
      variant="ghost"
      size="icon"
      class="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
      @click.stop="confirmDelete"
    >
      <Trash2 class="h-4 w-4 text-muted-foreground hover:text-destructive" />
    </Button>

    <AlertDialog v-model:open="showDeleteDialog">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除消息</AlertDialogTitle>
          <AlertDialogDescription>
            此操作将永久删除该消息，无法恢复。
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
import { computed, ref } from 'vue'
import { MdPreview } from "md-editor-v3"
import "md-editor-v3/lib/style.css"
import { Trash2, Copy, Check } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useChatStore } from '@/stores/chat'

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

const chatStore = useChatStore()
const showDeleteDialog = ref(false)

const emit = defineEmits<{
  delete: [timestamp: Date]
}>()

const confirmDelete = () => {
  showDeleteDialog.value = true
}

const handleDelete = () => {
  // 获取当前对话
  const currentChat = chatStore.currentChat
  if (!currentChat) return

  // 从当前对话中删除消息
  currentChat.messages = currentChat.messages.filter(
    msg => msg.timestamp.getTime() !== props.message.timestamp.getTime()
  )

  // 保存到 localStorage
  const chats = JSON.parse(localStorage.getItem('chats') || '[]')
  const chatIndex = chats.findIndex((chat: any) => chat.id === currentChat.id)
  
  if (chatIndex !== -1) {
    chats[chatIndex] = {
      ...currentChat,
      messages: currentChat.messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toISOString() // 转换日期为字符串
      }))
    }
    localStorage.setItem('chats', JSON.stringify(chats))
  }

  showDeleteDialog.value = false
}

const copied = ref(false)

const copyContent = async () => {
  const input = document.createElement('input')
  input.value = props.message.content
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)
  copied.value = true
}
</script> 