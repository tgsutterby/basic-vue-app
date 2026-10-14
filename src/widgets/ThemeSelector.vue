
<script setup>
import { useSettingsStore } from '@/stores/settings'
import BaseButton from '@/components/BaseButton.vue'
import CardBox from '@/components/CardBox.vue'
import SectionTitle from '@/components/SectionTitle.vue'

const settingsStore = useSettingsStore()
</script>

<template>
  <CardBox class="mb-6">
    <div class="mb-4">
      <SectionTitle>Theme</SectionTitle>
    </div>

    <!-- Small and medium screens -->
    <div class="flex flex-col gap-2 lg:hidden">
      <div
        v-for="theme in settingsStore.themes"
        :key="theme.id"
        class="flex items-center justify-between gap-3 rounded-lg p-3"
        :class="theme.bg"
      >
        <h3 class="text-base font-bold">
          {{ theme.name }}
        </h3>

        <BaseButton
          :color="settingsStore.theme === theme.id ? 'success' : 'info'"
          :label="settingsStore.theme === theme.id ? 'Selected' : 'Select'"
          class="w-30 shrink-0"
          small
          @click="settingsStore.setTheme(theme.id)"
        />
      </div>
    </div>

    <!-- Large screens and above -->
    <div class="hidden flex-col gap-4 lg:flex">
      <div
        v-for="row in Math.ceil(settingsStore.themes.length / 3)"
        :key="row"
        class="grid grid-cols-3 gap-4"
      >
        <CardBox
          v-for="theme in settingsStore.themes.slice((row - 1) * 3, row * 3)"
          :key="theme.id"
          class="flex flex-col"
        >
          <div class="mb-4 flex flex-row justify-between">
            <h3 class="text-lg font-bold">
              {{ theme.name }}
            </h3>

            <BaseButton
              :color="settingsStore.theme === theme.id ? 'success' : 'info'"
              :label="settingsStore.theme === theme.id ? 'Selected' : `Select ${theme.name}`"
              class="w-30"
              small
              @click="settingsStore.setTheme(theme.id)"
            />
          </div>

          <div class="flex min-h-28 overflow-hidden rounded border border-gray-200">
            <div
              class="flex w-1/3 flex-col gap-2 p-3"
              :class="theme.bg"
            >
              <div class="h-2 w-3/4 rounded bg-slate-500"></div>
              <div class="h-2 w-full rounded bg-slate-500"></div>
              <div class="h-2 w-4/5 rounded bg-slate-500"></div>
              <div class="h-2 w-2/3 rounded bg-slate-500"></div>
            </div>

            <div class="flex flex-1 flex-col gap-3 bg-slate-100 p-3 dark:bg-slate-700">
              <div class="flex gap-2">
                <div class="h-8 flex-1 rounded bg-slate-500"></div>
                <div class="h-8 flex-1 rounded bg-slate-500"></div>
              </div>

              <div class="h-2 w-3/4 rounded bg-slate-500"></div>
            </div>
          </div>
        </CardBox>
      </div>
    </div>
  </CardBox>
</template>
