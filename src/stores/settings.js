
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    theme: localStorage.getItem('theme') || 'basic',

    themes: [
      { name: 'Basic', color: 'gray', id: 'basic', bg: 'bg-gray-700' },
      { name: 'White', color: 'white', id: 'white', bg: 'bg-white dark:bg-slate-800/90' },
      { name: 'Red', color: 'red', id: 'red', bg: 'bg-red-500' },
      { name: 'Yellow', color: 'yellow', id: 'yellow', bg: 'bg-yellow-500' },
      { name: 'Green', color: 'green', id: 'green', bg: 'bg-green-500' },
      { name: 'Blue', color: 'blue', id: 'blue', bg: 'bg-blue-500' },
      { name: 'Purple', color: 'purple', id: 'purple', bg: 'bg-purple-500' },
      { name: 'Teal', color: 'teal', id: 'teal', bg: 'bg-teal-500' },
      { name: 'Pink', color: 'pink', id: 'pink', bg: 'bg-pink-500' },
    ],
  }),

  actions: {
    setTheme(themeId) {
      if (!this.themes.some(theme => theme.id === themeId)) return

      this.theme = themeId

      const html = document.documentElement

      html.classList.remove(
        ...this.themes.map(theme => `style-${theme.id}`),
      )

      html.classList.add(`style-${themeId}`)

      localStorage.setItem('theme', themeId)
      localStorage.removeItem('selectedTheme')
    },

    initializeSettings() {
      const savedTheme =
        localStorage.getItem('theme') ||
        localStorage.getItem('selectedTheme')

      const legacyTheme = this.themes.find(
        theme => theme.name === savedTheme,
      )

      const themeId = legacyTheme?.id || savedTheme || 'basic'

      this.setTheme(themeId)
    },
  },
})