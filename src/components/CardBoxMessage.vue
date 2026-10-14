<script setup>
defineProps({
  isSmall: Boolean,
})
</script>

<template>
  <div class="text-black last:mb-0 dark:text-white" :class="isSmall ? 'mb-3 text-sm' : 'mb-6'">
    <slot />
  </div>
</template>
