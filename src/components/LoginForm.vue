<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { Form, Field } from 'vee-validate'
import * as Yup from 'yup'

// Get the router instance and the auth store instance
const router = useRouter()
const authStore = useAuthStore()

// Define the form validation schema
const schema = Yup.object().shape({
  username: Yup.string().required('Usuario Requerido'),
  password: Yup.string().required('Password Requerida')
})

// Define the form submission handler
function handleSubmit(values: any, { setErrors }: any) {
  const { username, password } = values
  // Validate the form data using the schema
  return authStore
    .login(username, password)
    .then(() => {
      // Redirect to the dashboard page after successful login
      router.push('/')
    })
    .catch((error) => setErrors({ apiError: error }))
}
</script>

<template>
  <div class="wrapper">
    <Form @submit="handleSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting }">
      <h1>Login</h1>
      <div class="input-bx">
        <Field
          name="username"
          type="text"
          :class="{ 'is-invalid': errors.username || errors.apiError }"
          placeholder="Usuario"
          required
        />
        <ion-icon class="icon" name="person-circle"></ion-icon>
        <div class="invalid-feedback">{{ errors.username }}</div>
      </div>
      <div class="input-bx">
        <Field
          name="password"
          :class="{ 'is-invalid': errors.password || errors.apiError }"
          type="password"
          placeholder="Contraseña"
          required
        />
        <ion-icon class="icon" name="lock-closed"></ion-icon>
        <div class="invalid-feedback">{{ errors.password }}</div>
      </div>
      <div class="remember-forgot">
        <label><input type="checkbox" name="remember" /> Recordarme</label>
        <a href="#">Olvidaste tu contraseña</a>
      </div>
      <button type="submit" class="btn">
        <span v-show="isSubmitting" class="loader"></span>
        <p v-show="!isSubmitting">Ingresar</p>
      </button>
      <div v-if="errors.apiError" class="error-alert">{{ errors.apiError }}</div>
    </Form>
  </div>
</template>

<style scoped>
/* estilos del componente */

.wrapper {
  width: 400px;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  color: #fff;
  padding: 30px 40px;
  border-radius: 15px;
}

.wrapper h1 {
  font-size: 3em;
  text-align: center;
}

.wrapper .input-bx {
  position: relative;
  width: 100%;
  height: 50px;
  margin: 30px 0;
}

.wrapper .input-bx input {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  color: #fff;
  padding: 20px 45px 20px 20px;
}

.wrapper .input-bx input.is-invalid {
  background: #333;
  border: none;
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: red;
}

.wrapper .input-bx input::placeholder {
  color: #fff;
}

.wrapper .input-bx input.is-invalid::placeholder {
  color: #ff0000;
}

.wrapper .input-bx .icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.5em;
}

.wrapper .input-bx .invalid-feedback {
  font-weight: 300;
}

.wrapper .remember-forgot {
  display: flex;
  justify-content: space-between;
  font-size: 1.2em;
  margin: 15px 0 15px;
}

.wrapper .remember-forgot label input {
  accent-color: #fff;
  margin-right: 3px;
}

.wrapper .remember-forgot a {
  color: #fff;
  text-decoration: none;
}

.wrapper .remember-forgot a:hover {
  text-decoration: underline;
}

.wrapper button {
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
  transition: background-color 0.3s ease;
}

button p {
  font-size: 1.2em;
  font-weight: 600;
  color: #333;
}
.btn:hover {
  background-color: #4197b6;
}
.loader {
  margin: auto 0;
  width: 24px;
  height: 24px;
  border: 4px solid #800080;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}
@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.error-alert {
  margin: 16px 0 0 0;
  width: 100%;
  background: transparent;
  color: red;
  text-align: center;
  font-weight: 400;
}
</style>
