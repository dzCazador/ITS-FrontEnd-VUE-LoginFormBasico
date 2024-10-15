import './assets/global.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/authStore'
import { fakeBackend } from './helpers/fakebackend'

import App from './App.vue'
import router from './router'

async function startApp() {
  const app = createApp(App)
  const pinia = createPinia()
  app.use(pinia)
  app.use(router)

  try {
    const authStore = useAuthStore()
    await authStore.refreshToken()
  } catch (error) {
    console.warn('Usuario no logueado. Se envia al Login:', error)
    router.push('/login')
  }
  app.mount('#app')
}

fakeBackend()

startApp()
