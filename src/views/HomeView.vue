<script setup lang="ts">
import { onMounted } from 'vue'
import type { User } from '@/models/UserModel'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'
import { useSessionStore } from '@/stores/sessionStore'

// Getters and actions from Vuex stores
const authStore = useAuthStore()
const userStore = useUserStore()
const logUser: User | undefined | null = authStore.auth.user
const sessionStore = useSessionStore()

// Fetch users data on component mount
onMounted(() => {
  userStore.getAll()
})

// Function to log out user
const logout = () => {
  authStore.logout()
}
</script>

<template>
  <div class="container">
    <h1>Bienvenido, {{ logUser?.firstName }}</h1>
    <div class="info">
      <h2>Información de tu usuario:</h2>
      <p>Nombre: {{ logUser?.firstName }} {{ logUser?.lastName }}</p>
      <p>Rol: {{ logUser?.isAdmin === true ? 'Administrador' : 'Usuario' }}</p>
    </div>
    <div class="info">
      <h2>Informacion de Sesi&oacute;n:</h2>
      <p>JWT Payload: {{ sessionStore.data?.payload }}</p>
      <p>JWT Creado a las: {{ sessionStore.data?.created.toLocaleTimeString() }}</p>
      <p>JWT Expira a las: {{ sessionStore.data?.expires.toLocaleTimeString() }}</p>
      <p>JWT se refrescara a las: {{ sessionStore.data?.refresh.toLocaleTimeString() }}</p>
    </div>
    <div class="admin">
      <h2>Lista de Usuarios:</h2>
      <ul>
        <li v-for="user in userStore.users" :key="user.id">
          {{ user.firstName }} {{ user.lastName }}:
          {{ user.isAdmin === true ? '[Administrador]' : '[Usuario]' }}
        </li>
      </ul>
      <button class="btn" v-if="logUser?.isAdmin">+ Agregar Nuevo</button>
    </div>
    <button class="logout-btn" @click="logout()">Cerrar Sesión</button>
  </div>
</template>

<style scoped>
h1 {
  font-family: 'Ubuntu', sans-serif;
  font-size: 1.8rem;
  color: rgb(255, 255, 255);
  text-align: center;
  margin-bottom: 20px;
}

h2 {
  color: rgb(255, 255, 255);
  font-size: 20px;
}

p {
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  color: rgb(251, 251, 251);
  margin: 10px 0;
}

.container {
  padding: 30px;
  border-radius: 20px;
  border: 2px solid rgba(253, 253, 253, 0.397);
  width: 400px;
  margin: 100px auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.info,
.admin {
  margin-top: 15px;
  color: white;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}

ul {
  list-style-type: none;
  padding: 0;
}

label {
  display: block;
  color: white;
  margin-top: 10px;
}

.btn {
  background-color: rgba(255, 255, 255, 0);
  color: white;
  padding: 5px;
  border-radius: 50px;
  margin-top: 10px;
}

.btn:hover {
  background-color: rgba(255, 255, 255, 0.219);
}

.logout-btn {
  color: rgb(0, 0, 0);
  padding: 10px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  width: 100%;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

.logout-btn:hover {
  background-color: #800080;
}
</style>
