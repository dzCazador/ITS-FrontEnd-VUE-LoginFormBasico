import { defineStore } from 'pinia'
import type { SessionState } from '@/models/sessionModel'

export const useSessionStore = defineStore({
  id: 'session',
  state: (): SessionState => ({
    loading: false,
    data: null
  }),
  actions: {
    update(payload: string, created: Date, refresh: Date, expires: Date) {
      this.loading = true
      this.data = { payload, created, refresh, expires }
      this.loading = false
    }
  }
})
