<script setup>
import { useRoute } from 'vue-router'
import SectionMain from '@/components/SectionMain.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionBanner from '@/components/SectionBanner.vue'

const route = useRoute()
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionBanner class="view-banner mb-4 text-4xl text-white"
        >{{ route.meta.title }}</SectionBanner
      >
    </SectionMain>
  </LayoutAuthenticated>
</template>
