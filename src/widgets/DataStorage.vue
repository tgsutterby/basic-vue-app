<script setup>
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useNotificationsStore } from '@/stores/notifications'
import BaseButton from '@/components/BaseButton.vue'
import CardBox from '@/components/CardBox.vue'
import SectionTitle from '@/components/SectionTitle.vue'

const settingsStore = useSettingsStore()
const notificationsStore = useNotificationsStore()

const storageLoading = ref(false)
const clearingTemporaryData = ref(false)
const storageMessage = ref('')
const storageError = ref(false)

const storage = ref({
  localStorage: null,
  sessionStorage: null,
  cacheApi: null,
  cacheCount: 0,
  cacheEntries: 0,
  indexedDBAvailable: false,
  indexedDBDatabases: [],
  originUsage: null,
  originQuota: null,
  persistent: null,
})

const TEMP_CACHE_PREFIX = 'app-temp-'
const TEMP_SESSION_PREFIX = 'app-temp:'
const TEMP_DATABASE_PREFIX = 'app-temp-'

const formatBytes = (bytes) => {
  if (bytes == null || !Number.isFinite(bytes)) {
    return 'Unavailable'
  }

  if (bytes < 1024) return `${bytes} B`

  const units = ['KB', 'MB', 'GB', 'TB']
  let size = bytes / 1024
  let unit = 0

  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024
    unit++
  }

  return `${size.toFixed(2)} ${units[unit]}`
}

const estimateWebStorage = (store) => {
  try {
    let bytes = 0

    for (let i = 0; i < store.length; i++) {
      const key = store.key(i)
      if (key === null) continue

      const value = store.getItem(key) ?? ''
      bytes += (key.length + value.length) * 2
    }

    return bytes
  } catch {
    return null
  }
}

const getIndexedDBDatabases = async () => {
  try {
    if (!('indexedDB' in window) || !indexedDB.databases) {
      return null
    }

    return await indexedDB.databases()
  } catch {
    return null
  }
}

const measureCacheStorage = async () => {
  if (!('caches' in window)) {
    return {
      bytes: null,
      count: 0,
      entries: 0,
    }
  }

  let bytes = 0
  let entries = 0
  let sizeAvailable = true

  const cacheNames = await caches.keys()

  for (const name of cacheNames) {
    try {
      const cache = await caches.open(name)
      const requests = await cache.keys()

      for (const request of requests) {
        entries++

        try {
          const response = await cache.match(request)

          if (!response) continue

          const contentLength = response.headers.get('content-length')

          if (contentLength && /^\d+$/.test(contentLength)) {
            bytes += Number(contentLength)
          } else {
            const blob = await response.clone().blob()
            bytes += blob.size
          }
        } catch {
          sizeAvailable = false
        }
      }
    } catch {
      sizeAvailable = false
    }
  }

  return {
    bytes: sizeAvailable ? bytes : null,
    count: cacheNames.length,
    entries,
  }
}

const measureStorage = async () => {
  storageLoading.value = true
  storageError.value = false
  storageMessage.value = ''

  try {
    storage.value.localStorage = estimateWebStorage(localStorage)
    storage.value.sessionStorage = estimateWebStorage(sessionStorage)

    const [cache, estimate, databases, persistent] = await Promise.all([
      measureCacheStorage(),

      navigator.storage?.estimate
        ? navigator.storage.estimate().catch(() => null)
        : Promise.resolve(null),

      getIndexedDBDatabases(),

      navigator.storage?.persisted
        ? navigator.storage.persisted().catch(() => null)
        : Promise.resolve(null),
    ])

    storage.value.cacheApi = cache.bytes
    storage.value.cacheCount = cache.count
    storage.value.cacheEntries = cache.entries

    storage.value.originUsage = estimate?.usage ?? null
    storage.value.originQuota = estimate?.quota ?? null
    storage.value.persistent = persistent

    storage.value.indexedDBAvailable = 'indexedDB' in window
    storage.value.indexedDBDatabases = databases
  } catch (error) {
    console.error('Unable to measure storage:', error)

    storageError.value = true
    storageMessage.value =
      'Some storage information could not be retrieved.'
  } finally {
    storageLoading.value = false
  }
}

const clearTemporaryData = async () => {
  const confirmed = window.confirm(
    'Delete temporary app caches, temporary session entries, and temporary databases? Permanent app data and login information will be preserved.',
  )

  if (!confirmed) return

  clearingTemporaryData.value = true
  storageError.value = false
  storageMessage.value = ''

  const removed = {
    caches: 0,
    sessionEntries: 0,
    databases: 0,
  }

  const failures = []

  try {
    // Remove only caches with the designated temporary prefix.
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys()

        for (const name of cacheNames) {
          if (!name.startsWith(TEMP_CACHE_PREFIX)) continue

          try {
            if (await caches.delete(name)) {
              removed.caches++
            }
          } catch {
            failures.push(`Cache: ${name}`)
          }
        }
      } catch {
        failures.push('Cache Storage')
      }
    }

    // Remove only sessionStorage entries with the temporary prefix.
    try {
      const keys = []

      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)

        if (key?.startsWith(TEMP_SESSION_PREFIX)) {
          keys.push(key)
        }
      }

      for (const key of keys) {
        try {
          sessionStorage.removeItem(key)
          removed.sessionEntries++
        } catch {
          failures.push(`Session entry: ${key}`)
        }
      }
    } catch {
      failures.push('Session Storage')
    }

    // Remove only IndexedDB databases with the temporary prefix.
    const databases = await getIndexedDBDatabases()

    if (databases !== null) {
      for (const database of databases) {
        const name = database.name

        if (!name?.startsWith(TEMP_DATABASE_PREFIX)) continue

        try {
          await new Promise((resolve, reject) => {
            const request = indexedDB.deleteDatabase(name)

            request.onsuccess = () => resolve()
            request.onerror = () => reject(request.error)
            request.onblocked = () => {
              reject(new Error('Database deletion was blocked'))
            }
          })

          removed.databases++
        } catch {
          failures.push(`Database: ${name}`)
        }
      }
    }

    await measureStorage()

    storageError.value = failures.length > 0

    if (failures.length > 0) {
      storageMessage.value =
        `Cleanup partially completed. Removed ${removed.caches} caches, ${removed.sessionEntries} session entries, and ${removed.databases} databases. Some items could not be removed: ${failures.join(', ')}.`

      notificationsStore.addNotification({
        id: Date.now(),
        title: 'Cleanup Incomplete',
        message: 'Some temporary data could not be removed.',
        type: 'danger',
        duration: 1500,
      })
    } else {
      storageMessage.value =
        `Cleanup complete. Removed ${removed.caches} caches, ${removed.sessionEntries} session entries, and ${removed.databases} databases.`

      notificationsStore.addNotification({
        id: Date.now(),
        title: 'Cleanup Complete',
        message: 'Temporary data was successfully cleared.',
        type: 'success',
        duration: 1500,
      })
    }
  } catch (error) {
    console.error('Temporary data cleanup failed:', error)

    storageError.value = true
    storageMessage.value =
      'Cleanup could not be completed. Check the console for details.'

    notificationsStore.addNotification({
      id: Date.now(),
      title: 'Cleanup Failed',
      message: 'Unable to clear temporary data.',
      type: 'danger',
      duration: 1500,
    })
  } finally {
    clearingTemporaryData.value = false
  }
}

const exportSettings = () => {
  try {
    const data = {
      theme: settingsStore.theme,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'app-settings.json'

    document.body.appendChild(link)
    link.click()
    link.remove()

    setTimeout(() => URL.revokeObjectURL(url), 1000)

    storageMessage.value = 'Settings exported successfully.'
    storageError.value = false

    notificationsStore.addNotification({
      id: Date.now(),
      title: 'Export Complete',
      message: 'Settings exported successfully.',
      type: 'success',
      duration: 1500,
    })
  } catch (error) {
    console.error('Settings export failed:', error)

    storageMessage.value = 'Settings export failed.'
    storageError.value = true

    notificationsStore.addNotification({
      id: Date.now(),
      title: 'Export Failed',
      message: 'Unable to export settings.',
      type: 'danger',
      duration: 1500,
    })
  }
}

const resetPreferences = () => {
  const confirmed = window.confirm(
    'Reset your preferences to their defaults? Your theme will return to Basic.',
  )

  if (!confirmed) return

  try {
    settingsStore.setTheme('basic')

    storageMessage.value = 'Preferences have been reset.'
    storageError.value = false

    notificationsStore.addNotification({
      id: Date.now(),
      title: 'Reset Complete',
      message: 'Preferences restored to defaults.',
      type: 'success',
      duration: 1500,
    })
  } catch (error) {
    console.error('Preference reset failed:', error)

    storageMessage.value = 'Unable to reset preferences.'
    storageError.value = true

    notificationsStore.addNotification({
      id: Date.now(),
      title: 'Reset Failed',
      message: 'Unable to reset preferences.',
      type: 'danger',
      duration: 1500,
    })
  }
}

onMounted(measureStorage)
</script>

<template>
  <CardBox>
    <div class="mb-4">
      <SectionTitle>Data &amp; Storage</SectionTitle>
      <p class="mt-1 text-sm text-gray-500">
        Manage your local settings and application data.
      </p>
    </div>

    <div class="flex flex-col gap-4 divide-y divide-gray-200 dark:divide-gray-700">
      <!-- Storage usage -->
      <CardBox>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 class="font-bold">Storage Usage</h3>
              <p class="text-sm text-gray-500">
                Storage used by this app in the current browser or WebView.
              </p>
            </div>

            <BaseButton
              class="w-30 shrink-0"
              :label="storageLoading ? 'Checking...' : 'Refresh'"
              color="info"
              small
              :disabled="storageLoading"
              @click="measureStorage"
            />
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div class="rounded-lg bg-gray-100 p-3 dark:bg-slate-700">
              <p class="text-sm text-gray-500">Browser-managed storage</p>
              <p class="text-xl font-bold">
                {{ formatBytes(storage.originUsage) }}
              </p>
              <p class="text-xs text-gray-500">
                Estimated quota: {{ formatBytes(storage.originQuota) }}
              </p>
            </div>

            <div class="rounded-lg bg-gray-100 p-3 dark:bg-slate-700">
              <p class="text-sm text-gray-500">localStorage</p>
              <p class="text-xl font-bold">
                {{ formatBytes(storage.localStorage) }}
              </p>
              <p class="text-xs text-gray-500">Approximate string size</p>
            </div>

            <div class="rounded-lg bg-gray-100 p-3 dark:bg-slate-700">
              <p class="text-sm text-gray-500">sessionStorage</p>
              <p class="text-xl font-bold">
                {{ formatBytes(storage.sessionStorage) }}
              </p>
              <p class="text-xs text-gray-500">Approximate string size</p>
            </div>

            <div class="rounded-lg bg-gray-100 p-3 dark:bg-slate-700">
              <p class="text-sm text-gray-500">Cache API</p>
              <p class="text-xl font-bold">
                {{ formatBytes(storage.cacheApi) }}
              </p>
              <p class="text-xs text-gray-500">
                {{ storage.cacheCount }} caches ·
                {{ storage.cacheEntries }} entries
              </p>
            </div>
          </div>

          <div class="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
            <h4 class="font-semibold">IndexedDB</h4>

            <template v-if="storage.indexedDBDatabases === null">
              <p class="text-sm text-gray-500">
                Individual databases cannot be listed in this environment.
                Their usage may be included in browser-managed storage.
              </p>
            </template>

            <template v-else-if="storage.indexedDBDatabases.length">
              <p class="text-sm text-gray-500">
                {{ storage.indexedDBDatabases.length }} database(s) detected.
                Individual database sizes are not reliably available.
              </p>

              <ul class="mt-2 list-inside list-disc text-sm">
                <li
                  v-for="database in storage.indexedDBDatabases"
                  :key="database.name"
                >
                  {{ database.name || 'Unnamed database' }}
                </li>
              </ul>
            </template>

            <p v-else class="text-sm text-gray-500">
              No databases were detected, or database listing is unsupported.
            </p>
          </div>

          <p class="text-xs text-gray-500">
            Measurements are estimates. Browser-managed usage can overlap with
            the individual storage categories above. This does not measure
            Chrome's entire browser cache or other websites' data.
          </p>

          <p
            v-if="storage.persistent !== null"
            class="text-sm text-gray-500"
          >
            Persistent storage protection:
            {{ storage.persistent ? 'Granted' : 'Not granted' }}
          </p>
        </div>
      </CardBox>

      <!-- Export settings -->
      <CardBox>
        <div class="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 class="font-bold">Export Settings</h3>
            <p class="text-sm text-gray-500">
              Download your selected theme as a JSON backup.
            </p>
          </div>

          <BaseButton
            class="w-30 shrink-0"
            label="Export"
            color="info"
            small
            @click="exportSettings"
          />
        </div>
      </CardBox>

      <!-- Clear temporary data -->
      <CardBox>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 class="font-bold">Clear Temporary Data</h3>
            <p class="text-sm text-gray-500">
              Remove app-managed temporary caches, session entries, and
              temporary databases. Permanent data and login information are
              preserved.
            </p>
            <p class="mt-1 text-xs text-gray-500">
              Only items using the app's designated temporary-data prefixes
              are removed.
            </p>
          </div>

          <BaseButton
            class="w-30 shrink-0"
            :label="clearingTemporaryData ? 'Clearing...' : 'Clear'"
            color="danger"
            small
            :disabled="clearingTemporaryData"
            @click="clearTemporaryData"
          />
        </div>

        <p
          v-if="storageMessage"
          class="mt-3 rounded-lg p-3 text-sm"
          :class="
            storageError
              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
              : 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-200'
          "
          role="status"
        >
          {{ storageMessage }}
        </p>
      </CardBox>

      <!-- Reset preferences -->
      <CardBox>
        <div class="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 class="font-bold">Reset Preferences</h3>
            <p class="text-sm text-gray-500">
              Restore the default theme and preferences.
            </p>
          </div>

          <BaseButton
            class="w-30 shrink-0"
            label="Reset"
            color="danger"
            small
            @click="resetPreferences"
          />
        </div>
      </CardBox>
    </div>
  </CardBox>
</template>

<!-- How to properly label storage items for removal with storage cleanup. --
// Cache API
// await caches.open('app-temp-api-responses')

// Session storage
// sessionStorage.setItem('app-temp-search', '...')

// IndexedDB
// indexedDB.open('app-temp-offline-data')
-->
