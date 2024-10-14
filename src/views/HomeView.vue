<script setup lang="ts">
import { reactive } from 'vue' // Asegúrate de importar reactive
import { useUserStore } from '@/stores/userStore'
import type { User } from '@/models/UserModel'
import { useAuthStore } from '@/stores/authStore'

const user: User = reactive<User>(useUserStore().user)
const authStore = useAuthStore()

const logout = () => {
  authStore.logout()
}
</script>

<template>
  <div>
    <h1>Bienvenido, {{ user.login }}!</h1>
    <h1>Su Password es: {{ user.password }}</h1>
  </div>
  <button @click="logout()">Cerrar Sesión</button>
</template>

<style scoped>
h1 {
  color: #fff;
  margin: 20px;
}

button {
  width: 100%;
  height: 50px;
  border-radius: 15px;
  border: none;
  outline: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  font-size: 1.2em;
  font-weight: 600;
  color: #333;
}
</style>
