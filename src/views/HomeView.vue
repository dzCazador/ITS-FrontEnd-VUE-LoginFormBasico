<script setup lang="ts">
import { onMounted } from 'vue'
import type { User } from '@/models/UserModel'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'
import { useSessionStore } from '@/stores/sessionStore'

const authStore = useAuthStore()
const userStore = useUserStore()
const logUser: User | undefined | null = authStore.auth.user
const sessionStore = useSessionStore()

onMounted(() => {
  userStore.getAll()
})

const logout = () => {
  authStore.logout()
}
</script>

<template>
  <div>
    <h1>Bienvenido, {{ logUser?.firstName }} {{ logUser?.lastName }}!</h1>
    <h1>Rol, {{ logUser?.firstName }} {{ logUser?.lastName }}!</h1>
  </div>
  <div>
    <h1>Informaci&oacute;n de Sesi&oacute;n:</h1>
    <h2>JWT Payload: {{ sessionStore.data?.payload }}</h2>
    <h2>JWT Creado a las: {{ sessionStore.data?.created.toLocaleTimeString() }}</h2>
    <h2>JWT Expira a las: {{ sessionStore.data?.expires.toLocaleTimeString() }}</h2>
    <h2>JWT se refrescar&aacute; a las: {{ sessionStore.data?.refresh.toLocaleTimeString() }}</h2>
  </div>
  <div>
    <h1>Lista de Usuarios</h1>
  </div>
  <div>
    <ul>
      <li v-for="user in userStore.users" :key="user.id">
        {{ user.userName }}: {{ user.firstName }} {{ user.lastName }}
        {{ user.isAdmin === true ? '[Administrador]' : '[Usuario]' }}
      </li>
    </ul>
    <button v-if="logUser?.isAdmin">Crear nuevo usuario</button>
  </div>
  <br />
  <button @click="logout()">Cerrar Sesión</button>
</template>

<style scoped>
h1 {
  color: #fff;
  margin: 20px;
  font-weight: bold;
}
h2 {
  color: #fff;
  margin: 20px;
  font-weight: 400;
}

li {
  color: #fff;
  margin: 20px;
  font-weight: 200;
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
