<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import SectionMain from '@/components/SectionMain.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionBanner from '@/components/SectionBanner.vue'
import CardBox from '@/components/CardBox.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const searchQuery = ref('')
const messageText = ref('')
const activeConversationId = ref(1)
const mobileChatOpen = ref(false)
const messagesContainer = ref(null)

const currentUserId = 'me'

const conversations = ref([
  {
    id: 1,
    name: 'Alex Morgan',
    initials: 'AM',
    avatarColor: 'bg-blue-500',
    online: true,
    unread: 2,
    lastSeen: 'Online',
    messages: [
      {
        id: 1,
        senderId: 'alex',
        text: 'Hey! How is the new project coming along?',
        time: '10:24 AM',
      },
      {
        id: 2,
        senderId: 'me',
        text: 'Pretty good! I have been working on the dashboard.',
        time: '10:26 AM',
      },
      {
        id: 3,
        senderId: 'alex',
        text: 'Nice! I would love to see it when you have a chance.',
        time: '10:27 AM',
      },
      {
        id: 4,
        senderId: 'me',
        text: 'Absolutely. I am finishing up the messaging interface now.',
        time: '10:28 AM',
      },
      {
        id: 5,
        senderId: 'alex',
        text: 'That sounds great! Let me know when it is ready.',
        time: '10:29 AM',
      },
    ],
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    initials: 'SJ',
    avatarColor: 'bg-purple-500',
    online: true,
    unread: 0,
    lastSeen: 'Online',
    messages: [
      {
        id: 1,
        senderId: 'me',
        text: 'Thanks for your help earlier!',
        time: '9:42 AM',
      },
      {
        id: 2,
        senderId: 'sarah',
        text: 'Anytime! Happy to help.',
        time: '9:45 AM',
      },
    ],
  },
  {
    id: 3,
    name: 'Michael Chen',
    initials: 'MC',
    avatarColor: 'bg-emerald-500',
    online: false,
    unread: 1,
    lastSeen: 'Last active 2h ago',
    messages: [
      {
        id: 1,
        senderId: 'michael',
        text: 'Did you get a chance to review those files?',
        time: 'Yesterday',
      },
    ],
  },
  {
    id: 4,
    name: 'Emily Davis',
    initials: 'ED',
    avatarColor: 'bg-pink-500',
    online: false,
    unread: 0,
    lastSeen: 'Last active yesterday',
    messages: [
      {
        id: 1,
        senderId: 'me',
        text: 'Sounds good. Talk to you soon!',
        time: 'Yesterday',
      },
    ],
  },
  {
    id: 5,
    name: 'David Wilson',
    initials: 'DW',
    avatarColor: 'bg-amber-500',
    online: true,
    unread: 0,
    lastSeen: 'Online',
    messages: [
      {
        id: 1,
        senderId: 'david',
        text: 'Are we still meeting tomorrow?',
        time: 'Monday',
      },
    ],
  },
])

const activeConversation = computed(() =>
  conversations.value.find(
    (conversation) => conversation.id === activeConversationId.value,
  ),
)

const filteredConversations = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) return conversations.value

  return conversations.value.filter((conversation) => {
    const matchesName = conversation.name.toLowerCase().includes(query)

    const matchesMessage = conversation.messages.some((message) =>
      message.text.toLowerCase().includes(query),
    )

    return matchesName || matchesMessage
  })
})

const totalUnread = computed(() =>
  conversations.value.reduce(
    (total, conversation) => total + conversation.unread,
    0,
  ),
)

const lastMessage = (conversation) =>
  conversation.messages[conversation.messages.length - 1]

const selectConversation = (conversation) => {
  activeConversationId.value = conversation.id
  conversation.unread = 0
  mobileChatOpen.value = true
}

const sendMessage = async () => {
  const text = messageText.value.trim()

  if (!text || !activeConversation.value) return

  activeConversation.value.messages.push({
    id: Date.now(),
    senderId: currentUserId,
    text,
    time: new Date().toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    }),
  })

  messageText.value = ''

  await nextTick()

  if (messagesContainer.value) {
    messagesContainer.value.scrollTop =
      messagesContainer.value.scrollHeight
  }
}

watch(activeConversationId, async () => {
  await nextTick()

  if (messagesContainer.value) {
    messagesContainer.value.scrollTop =
      messagesContainer.value.scrollHeight
  }
})

</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionBanner class="view-banner mb-4 text-4xl text-white">{{ route.meta.title }}</SectionBanner>
      <CardBox class="!p-0 overflow-hidden">
        <div
          class="grid h-[calc(100dvh-13rem)] min-h-[480px] grid-cols-1 gap-4 overflow-hidden md:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]"
        >
          <!-- Conversation sidebar -->
          <aside
            class="flex min-h-0 flex-col rounded-lg border border-slate-200 dark:border-slate-700"
            :class="mobileChatOpen ? 'hidden md:flex' : 'flex'"
          >
            <div class="border-b border-slate-200 p-4 dark:border-slate-700">
              <div class="mb-4 flex items-center justify-between gap-2">
                <SectionTitle>Chats</SectionTitle>

                <span
                  v-if="totalUnread"
                  class="rounded-full bg-blue-500 px-2 py-1 text-xs font-bold text-white"
                >
                  {{ totalUnread }} unread
                </span>
              </div>

              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="search"
                  placeholder="Search conversations..."
                  aria-label="Search conversations"
                  class="w-full rounded-lg border border-slate-200 bg-slate-100 py-2 pl-9 pr-3 text-sm text-slate-800 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />

                <svg
                  class="absolute left-3 top-2.5 h-4 w-4 text-slate-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m16 16 4 4" />
                </svg>
              </div>
            </div>

            <div class="min-h-0 flex-1 overflow-y-auto">
              <button
                v-for="conversation in filteredConversations"
                :key="conversation.id"
                type="button"
                class="flex w-full items-center gap-3 border-b border-slate-100 p-3 text-left transition-colors hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800 sm:p-4"
                :class="
                  activeConversationId === conversation.id
                    ? 'bg-blue-50 dark:bg-slate-800'
                    : ''
                "
                @click="selectConversation(conversation)"
              >
                <div class="relative shrink-0">
                  <div
                    class="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white"
                    :class="conversation.avatarColor"
                  >
                    {{ conversation.initials }}
                  </div>

                  <span
                    v-if="conversation.online"
                    class="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900"
                  ></span>
                </div>

                <div class="min-w-0 flex-1">
                  <div class="mb-1 flex items-center justify-between gap-2">
                    <span
                      class="truncate text-sm"
                      :class="
                        conversation.unread
                          ? 'font-bold text-slate-900 dark:text-white'
                          : 'font-semibold text-slate-700 dark:text-slate-200'
                      "
                    >
                      {{ conversation.name }}
                    </span>

                    <span
                      v-if="lastMessage(conversation)"
                      class="shrink-0 text-xs text-slate-400"
                    >
                      {{ lastMessage(conversation).time }}
                    </span>
                  </div>

                  <div class="flex items-center justify-between gap-2">
                    <p
                      class="truncate text-sm"
                      :class="
                        conversation.unread
                          ? 'font-medium text-slate-800 dark:text-slate-200'
                          : 'text-slate-500 dark:text-slate-400'
                      "
                    >
                      {{ lastMessage(conversation)?.text }}
                    </p>

                    <span
                      v-if="conversation.unread"
                      class="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-blue-500 px-1.5 text-xs font-bold text-white"
                    >
                      {{ conversation.unread }}
                    </span>
                  </div>
                </div>
              </button>

              <div
                v-if="!filteredConversations.length"
                class="p-6 text-center text-sm text-slate-500"
              >
                No conversations found.
              </div>
            </div>

            <div class="border-t border-slate-200 p-3 dark:border-slate-700">
              <p class="text-center text-xs text-slate-500">
                {{ conversations.length }} conversations
              </p>
            </div>
          </aside>

          <!-- Active conversation -->
          <section
            class="min-h-0 flex-col overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700"
            :class="mobileChatOpen ? 'flex' : 'hidden md:flex'"
          >
            <template v-if="activeConversation">
              <!-- Chat header -->
              <header
                class="flex items-center gap-3 border-b border-slate-200 p-3 dark:border-slate-700 sm:p-4"
              >
                <button
                  type="button"
                  class="mr-1 rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
                  aria-label="Back to conversations"
                  @click="mobileChatOpen = false"
                >
                  <svg
                    class="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>

                <div class="relative shrink-0">
                  <div
                    class="flex h-11 w-11 items-center justify-center rounded-full font-bold text-white"
                    :class="activeConversation.avatarColor"
                  >
                    {{ activeConversation.initials }}
                  </div>

                  <span
                    v-if="activeConversation.online"
                    class="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900"
                  ></span>
                </div>

                <div class="min-w-0 flex-1">
                  <h2 class="truncate font-bold text-slate-900 dark:text-white">
                    {{ activeConversation.name }}
                  </h2>

                  <p
                    class="text-xs"
                    :class="
                      activeConversation.online
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-500'
                    "
                  >
                    {{ activeConversation.lastSeen }}
                  </p>
                </div>

                <button
                  type="button"
                  class="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Conversation information"
                  aria-label="Conversation information"
                >
                  <svg
                    class="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 11v5m0-8h.01" />
                  </svg>
                </button>
              </header>

              <!-- Message history -->
              <div
                ref="messagesContainer"
                class="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto bg-slate-50 p-4 dark:bg-slate-900/40 sm:p-6"
              >
                <div class="py-2 text-center">
                  <span
                    class="rounded-full bg-slate-200 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  >
                    This is the beginning of your conversation
                  </span>
                </div>

                <div
                  v-for="message in activeConversation.messages"
                  :key="message.id"
                  class="flex"
                  :class="
                    message.senderId === currentUserId
                      ? 'justify-end'
                      : 'justify-start'
                  "
                >
                  <div
                    class="max-w-[85%] sm:max-w-[75%]"
                    :class="
                      message.senderId === currentUserId
                        ? 'items-end'
                        : 'items-start'
                    "
                  >
                    <div
                      class="rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm"
                      :class="
                        message.senderId === currentUserId
                          ? 'rounded-br-sm bg-blue-600 text-white'
                          : 'rounded-bl-sm bg-white text-slate-800 dark:bg-slate-800 dark:text-slate-100'
                      "
                    >
                      {{ message.text }}
                    </div>

                    <p
                      class="mt-1 px-1 text-xs text-slate-400"
                      :class="
                        message.senderId === currentUserId
                          ? 'text-right'
                          : 'text-left'
                      "
                    >
                      {{ message.time }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Message composer -->
              <form
                class="border-t border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900 sm:p-4"
                @submit.prevent="sendMessage"
              >
                <div class="flex items-end gap-2">
                  <textarea
                    v-model="messageText"
                    rows="1"
                    maxlength="5000"
                    placeholder="Type a message..."
                    aria-label="Type a message"
                    class="max-h-32 min-h-11 min-w-0 flex-1 resize-y rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    @keydown.enter.exact.prevent="sendMessage"
                  ></textarea>

                  <BaseButton
                    type="submit"
                    color="info"
                    label="Send"
                    :disabled="!messageText.trim()"
                  />
                </div>

                <p class="mt-2 hidden text-xs text-slate-400 sm:block">
                  Press Enter to send · Shift + Enter for a new line
                </p>
              </form>
            </template>

            <div
              v-else
              class="flex flex-1 items-center justify-center p-8 text-center text-slate-500"
            >
              Select a conversation to start messaging.
            </div>
          </section>
        </div>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
