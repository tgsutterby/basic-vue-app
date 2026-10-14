<script setup>
import { computed, onMounted, onUnmounted, watch } from 'vue'
import {
  mdiClose,
  mdiCheckCircleOutline,
  mdiAlertOutline,
  mdiAlertCircleOutline,
  mdiInformationOutline,
} from '@mdi/js'
import { colorsBgLight, colorsOutline } from '@/colors.js'
import BaseLevel from '@/components/BaseLevel.vue'
import BaseIcon from '@/components/BaseIcon.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useDarkModeStore } from '@/stores/darkMode'
import { useNotificationsStore } from '@/stores/notifications'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
  duration: {
    type: Number,
    default: 5000,
  },
  message: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    default: '',
  },

  type: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'success', 'warning', 'error'].includes(value),
  },

  icon: {
    type: String,
    default: '',
  },

  color: {
    type: String,
    default: '',
  },

  outline: {
    type: Boolean,
    default: false,
  },

  timestamp: {
    type: [Number, String, Date],
    default: null,
  },

  read: {
    type: Boolean,
    default: false,
  },

  dismissible: {
    type: Boolean,
    default: true,
  },

  persistent: {
    type: Boolean,
    default: false,
  },
})

const notificationsStore = useNotificationsStore()
const darkModeStore = useDarkModeStore()

const typeDefaults = {
  info: {
    icon: mdiInformationOutline,
    color: 'info',
  },

  success: {
    icon: mdiCheckCircleOutline,
    color: 'success',
  },

  warning: {
    icon: mdiAlertOutline,
    color: 'warning',
  },

  error: {
    icon: mdiAlertCircleOutline,
    color: 'danger',
  },
}

const notification = computed(() => notificationsStore.getNotification(props.id))

const isDismissed = computed(() => !notification.value)

const isRead = computed(() => notification.value?.read ?? props.read)

const notificationIcon = computed(
  () => props.icon || notification.value?.icon || typeDefaults[props.type].icon,
)

const notificationColor = computed(
  () => props.color || notification.value?.color || typeDefaults[props.type].color,
)

const componentClass = computed(() => {
  const color = notificationColor.value

  if (props.outline || notification.value?.outline) {
    return colorsOutline[color] || ''
  }

  return colorsBgLight[color] || ''
})

const formattedTimestamp = computed(() => {
  const value = notification.value?.timestamp ?? props.timestamp

  if (!value) return ''

  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
})

function dismiss() {
  notificationsStore.dismissNotification(props.id)
}

function markAsRead() {
  notificationsStore.markAsRead(props.id)
}

let dismissTimer = null

function startDismissTimer() {
  clearTimeout(dismissTimer)

  if (props.persistent || !props.dismissible || props.duration <= 0) {
    return
  }

  dismissTimer = setTimeout(() => {
    dismiss()
  }, props.duration)
}

onMounted(startDismissTimer)

onUnmounted(() => {
  clearTimeout(dismissTimer)
})

watch(
  () => [props.duration, props.persistent, props.dismissible],
  startDismissTimer,
)
</script>

<template>
  <div
    v-if="!isDismissed"
    :class="[
      componentClass,
      { 'transition-colors': !darkModeStore.isInProgress },
      { 'opacity-70': isRead },
    ]"
    class="mb-6 rounded border px-3 py-4 last:mb-0 md:px-4 opacity-90"
    role="status"
    :aria-live="type === 'error' || type === 'warning' ? 'assertive' : 'polite'"
  >
    <BaseLevel>
      <div class="flex min-w-0 flex-1 items-start gap-3">
        <BaseIcon :path="notificationIcon" w="w-6" h="h-6" size="24" class="mt-0.5 shrink-0" />

        <div class="min-w-0 flex-1">
          <div v-if="title" class="mb-1 font-semibold">
            {{ title }}
          </div>

          <p class="break-words">
            {{ message }}
          </p>

          <time
            v-if="formattedTimestamp"
            class="mt-2 block text-xs opacity-70"
            :datetime="new Date(timestamp ?? Date.now()).toISOString()"
          >
            {{ formattedTimestamp }}
          </time>

          <button
            v-if="!isRead"
            type="button"
            class="mt-2 text-sm underline underline-offset-2"
            @click="markAsRead"
          >
            Mark as read
          </button>
        </div>
      </div>

      <BaseButton
        v-if="dismissible && !persistent"
        :icon="mdiClose"
        small
        rounded-full
        color="white"
        aria-label="Dismiss notification"
        @click="dismiss"
      />
    </BaseLevel>
  </div>
</template>
