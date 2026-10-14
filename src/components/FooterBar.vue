<script setup>
import { containerMaxW } from '@/config.js'
import BaseLevel from '@/components/BaseLevel.vue'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="px-6 py-2" :class="containerMaxW">
    <BaseLevel>
      <div class="flex flex-col items-center justify-center gap-6 lg:flex-row lg:justify-start">
        <b>&copy;{{ year }}, <a target="_blank">App Name</a></b>
        <slot />
      </div>
      <div class="md:py-2">
      </div>
    </BaseLevel>
  </footer>
</template>
