import { fetchWrapper } from '@/helpers/fetchWrapper'
import { defineStore } from 'pinia'
import router from '@/router'

//localImport
import type { User, UserState } from '@/models/UserModel'
import { useSessionStore } from '@/stores/sessionStore'

const baseUrl = `${import.meta.env.VITE_API_URL}/users`

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    auth: {} as {
      loading: boolean
      user: User | undefined | null
      //data?: UserState | undefined | null
      refreshTokenTimeout: number | null
    }
  }),
  actions: {
    async login(username: string, password: string) {
      this.auth.user = await fetchWrapper.post(
        `${baseUrl}/authenticate`,
        { username, password },
        { credentials: 'include' }
      )
      this.startRefreshTokenTimer()
    },
    logout() {
      fetchWrapper.post(`${baseUrl}/revoke-token`, {}, { credentials: 'include' })
      this.stopRefreshTokenTimer()
      this.auth.user = null
      router.push('/login')
    },
    async refreshToken() {
      this.auth.user = await fetchWrapper.post(
        `${baseUrl}/refresh-token`,
        {},
        { credentials: 'include' }
      )
      this.startRefreshTokenTimer()
    },
    startRefreshTokenTimer() {
      const sessionStore = useSessionStore()
      if (!this.auth.user || !this.auth.user?.jwtToken) return

      //to parse base64 json object
      const jwtBase64 = this.auth.user?.jwtToken.split('.')[1]
      const decodedJwtToken = JSON.parse(atob(jwtBase64))

      //Create a timeout to refresh the token before expires
      const expires = new Date(decodedJwtToken.exp * 1000)
      const timeout = expires.getTime() - Date.now() - 60 * 1000

      this.auth.refreshTokenTimeout = setTimeout(this.refreshToken, timeout)
      //Save de session vars in the session store
      sessionStore.update(jwtBase64, new Date(Date.now()), new Date(Date.now() + timeout), expires)
    },
    stopRefreshTokenTimer() {
      if (this.auth.refreshTokenTimeout) {
        clearTimeout(this.auth.refreshTokenTimeout)
        this.auth.refreshTokenTimeout = null
      }
    }
  }
})
