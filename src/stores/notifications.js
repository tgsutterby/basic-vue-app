import { defineStore } from 'pinia'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [],
  }),

  getters: {
    unreadCount: (state) =>
      state.notifications.filter((notification) => !notification.read).length,

    unreadNotifications: (state) =>
      state.notifications.filter((notification) => !notification.read),

    readNotifications: (state) =>
      state.notifications.filter((notification) => notification.read),

    notificationCount: (state) => state.notifications.length,
  },

  actions: {
    /**
     * Add a notification.
     */
    addNotification({
      id = crypto.randomUUID(),
      message,
      title = '',
      type = 'info',
      icon = '',
      outline = false,
      color = '',
      timestamp = Date.now(),
      read = false,
      dismissible = true,
      persistent = false,
      action = null,
      metadata = {},
    }) {
      const notification = {
        id,
        message,
        title,
        type,
        icon,
        outline,
        color,
        timestamp,
        read,
        dismissible,
        persistent,
        action,
        metadata,
      }

      this.notifications.unshift(notification)

      return notification
    },

    /**
     * Find a notification by ID.
     */
    getNotification(id) {
      return this.notifications.find((notification) => notification.id === id)
    },

    /**
     * Update notification properties.
     */
    updateNotification(id, updates) {
      const notification = this.getNotification(id)

      if (!notification) return false

      Object.assign(notification, updates)

      return true
    },

    /**
     * Mark a notification as read.
     */
    markAsRead(id) {
      return this.updateNotification(id, { read: true })
    },

    /**
     * Mark a notification as unread.
     */
    markAsUnread(id) {
      return this.updateNotification(id, { read: false })
    },

    /**
     * Mark every notification as read.
     */
    markAllAsRead() {
      this.notifications.forEach((notification) => {
        notification.read = true
      })
    },

    /**
     * Dismiss a notification.
     */
    dismissNotification(id) {
      const notification = this.getNotification(id)

      if (!notification || !notification.dismissible || notification.persistent) {
        return false
      }

      this.notifications = this.notifications.filter(
        (notification) => notification.id !== id,
      )

      return true
    },

    /**
     * Remove a notification regardless of dismissible settings.
     */
    removeNotification(id) {
      const initialCount = this.notifications.length

      this.notifications = this.notifications.filter(
        (notification) => notification.id !== id,
      )

      return this.notifications.length < initialCount
    },

    /**
     * Remove every notification.
     */
    clearNotifications() {
      this.notifications = []
    },

    /**
     * Remove only read notifications.
     */
    clearReadNotifications() {
      this.notifications = this.notifications.filter(
        (notification) => !notification.read,
      )
    },

    /**
     * Remove notifications matching a type.
     */
    clearNotificationsByType(type) {
      this.notifications = this.notifications.filter(
        (notification) => notification.type !== type,
      )
    },
  },
})

// TO THROW A NOTIFICATION
// notificationsStore.addNotification({
// id: Date.now(),
// title: 'Log Out Clicked',
// message: 'The Log Out button was clicked!',
// type: 'info',
// })
