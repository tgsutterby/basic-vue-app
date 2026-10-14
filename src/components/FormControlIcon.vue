<script setup>
import BaseIcon from '@/components/BaseIcon.vue'

defineProps({
  icon: String,
  h: String,
})
</script>

<template>
  <BaseIcon
    :path="icon"
    w="w-10"
    :h="h"
    class="pointer-events-none absolute top-0 left-0 z-10 text-black dark:text-white"
  />
</template>
