import { defineStore } from 'pinia'
import type { UserState } from '@/models/UserModel.ts'
import { fetchWrapper } from '@/helpers/fetchWrapper'

const baseUrl = `${import.meta.env.VITE_API_URL}/users`

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    loading: false,
    users: null
  }),
  actions: {
    async getAll() {
      this.loading = true
      try {
        const response = await fetchWrapper.get(baseUrl)
        this.loading = false
        this.users = response
      } catch (error) {
        this.loading = false
        console.error(error)
      }
    }
  }
})
