<script setup>
import { containerMaxW } from '@/config.js'
</script>

<template>
  <section class="py-2 px-3" :class="containerMaxW">
    <slot />
  </section>
</template>
