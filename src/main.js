import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './css/main.css'

const pinia = createPinia()

createApp(App).use(router).use(pinia).mount('#app')

const defaultDocumentTitle = 'Basic Vue App'

router.afterEach((to) => {
  document.title = to.meta?.title
    ? `${to.meta.title} — ${defaultDocumentTitle}`
    : defaultDocumentTitle
})
