<script setup>
import { RouterView } from 'vue-router'

const savedTheme = localStorage.getItem('theme') || 'basic'

document.documentElement.classList.forEach((token) => {
  if (token.startsWith('style-')) {
    document.documentElement.classList.remove(token)
  }
})

document.documentElement.classList.add(`style-${savedTheme}`)
</script>

<template>
  <RouterView />
</template>
