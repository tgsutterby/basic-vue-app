<script setup>
import { useRoute } from 'vue-router'
import DataStorage from '@/widgets/DataStorage.vue'
import ThemeSelector from '@/widgets/ThemeSelector.vue'
import SectionMain from '@/components/SectionMain.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionBanner from '@/components/SectionBanner.vue'

const route = useRoute()

</script>

<template>
  <LayoutAuthenticated>
    <SectionMain class="grid gap-4">
      <SectionBanner class="view-banner text-4xl text-white">
        {{ route.meta.title }}
      </SectionBanner>

      <!-- Data & Storage -->
      <DataStorage />

      <!-- Theme -->
      <ThemeSelector />

    </SectionMain>
  </LayoutAuthenticated>
</template>
