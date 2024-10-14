import './assets/global.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/authStore'
import { fakeBackend } from './helpers/fakebackend'

import App from './App.vue'
import router from './router'

async function startApp() {
  const app = createApp(App)

  app.use(createPinia())
  app.use(router)
  try {
    const authStore = useAuthStore()
    await authStore.refreshToken()
  } catch (error) {
    console.error('Error al iniciar la app:', error)
    router.push('/login')
  }

  app.mount('#app')
}

fakeBackend()

startApp()
