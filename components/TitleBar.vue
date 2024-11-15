<template>
  <div class="titlebar-drag-region h-8 bg-background flex items-center justify-end px-2">
    <div class="titlebar-no-drag flex items-center space-x-2">
      <button @click="minimizeWindow" class="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
        <Minus class="h-4 w-4" />
      </button>
      <button @click="maximizeWindow" class="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
        <Square class="h-4 w-4" />
      </button>
      <button @click="closeWindow" class="p-1 hover:bg-red-500 hover:text-white rounded">
        <X class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Minus, Square, X } from 'lucide-vue-next'

declare global {
  interface Window {
    electronAPI?: {
      minimize: () => Promise<void>
      maximize: () => Promise<void>
      close: () => Promise<void>
    }
  }
}

const minimizeWindow = async () => {
  await window.electronAPI?.minimize()
}

const maximizeWindow = async () => {
  await window.electronAPI?.maximize()
}

const closeWindow = async () => {
  await window.electronAPI?.close()
}
</script> 