import { defineStore } from 'pinia'

import type { User } from '@/models/UserModel.ts'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {
      login: '',
      password: ''
    } as User
  }),
  actions: {
    setUser(user: User) {
      this.user = user
    }
  }
})
