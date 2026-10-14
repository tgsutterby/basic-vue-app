<script setup>
import { mdiForwardburger, mdiBackburger, mdiMenu } from '@mdi/js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { menuAsideMain, menuAsideBottom } from '@/menuAside.js'
import menuNavBar from '@/menuNavBar.js'
import { useDarkModeStore } from '@/stores/darkMode.js'
import { useNotificationsStore } from '@/stores/notifications'
import BaseIcon from '@/components/BaseIcon.vue'
import NavBar from '@/components/NavBar.vue'
import NavBarItemPlain from '@/components/NavBarItemPlain.vue'
import AsideMenu from '@/components/AsideMenu.vue'
import FormControl from '@/components/FormControl.vue'
import NotificationCard from '@/widgets/NotificationCard.vue'

const notificationsStore = useNotificationsStore()

const layoutAsidePadding = 'xl:pl-60'

const darkModeStore = useDarkModeStore()

const router = useRouter()

const isAsideMobileExpanded = ref(false)
const isAsideLgActive = ref(false)

router.beforeEach(() => {
  isAsideMobileExpanded.value = false
  isAsideLgActive.value = false
})

const menuClick = (event, item) => {
  if (item.isToggleLightDark) {
    darkModeStore.set(null, true)
  }

  if (item.isLogout) {
    notificationsStore.addNotification({
    id: Date.now(),
    title: 'Log Out Clicked',
    message: 'The Log Out button was clicked!',
    type: 'info',
  })
  }
}
</script>

<template>
  <div
    :class="{
      'relative overflow-hidden lg:overflow-visible': isAsideMobileExpanded,
    }"
  >
    <div
      :class="[layoutAsidePadding, { 'ml-60 lg:ml-0': isAsideMobileExpanded }]"
      class="min-h-screen w-screen bg-gradient-to-t from-neutral-50 to-neutral-200 pt-14 text-black transition-(--transition-position) lg:w-auto dark:from-neutral-700 dark:to-neutral-800 dark:text-white"
    >
      <NavBar
        :menu="menuNavBar"
        class="bg-slate-200/75 dark:bg-slate-800/75"
        :class="[layoutAsidePadding, { 'ml-60 lg:ml-0': isAsideMobileExpanded }]"
        @menu-click="menuClick"
      >
        <NavBarItemPlain
          display="flex lg:hidden"
          @click.prevent="isAsideMobileExpanded = !isAsideMobileExpanded"
        >
          <BaseIcon :path="isAsideMobileExpanded ? mdiBackburger : mdiForwardburger" size="24" />
        </NavBarItemPlain>
        <NavBarItemPlain display="hidden lg:flex xl:hidden" @click.prevent="isAsideLgActive = true">
          <BaseIcon :path="mdiMenu" size="24" />
        </NavBarItemPlain>
        <NavBarItemPlain class="w-full">
          <FormControl class="w-full" placeholder="Search (ctrl+k)" ctrl-k-focus />
        </NavBarItemPlain>
      </NavBar>
      <AsideMenu
        :is-aside-mobile-expanded="isAsideMobileExpanded"
        :is-aside-lg-active="isAsideLgActive"
        :menu="menuAsideMain"
        :menu-bottom="menuAsideBottom"
        @menu-click="menuClick"
        @aside-lg-close-click="isAsideLgActive = false"
      />
      <slot />
    </div>

    <div v-if="notificationsStore.notifications.length > 0" class="fixed top-20 right-2 max-w-full ml-2 md:right-20 flex flex-col">
      <NotificationCard
        v-for="notification in notificationsStore.notifications"
        :key="notification.id"
        v-bind="notification"
      />
    </div>
  </div>
</template>
