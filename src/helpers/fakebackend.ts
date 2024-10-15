export { fakeBackend }
//Lib Imports
import type { User } from '@/models/UserModel'
import type { JwtPayload } from '@/models/JwtModel'
import type { AuthRequestBody } from '@/models/AuthReqModel'

// Users Array in localstorage
const usersKey = 'vue-3-jwt-refresh-token-users'
const users: User[] = JSON.parse(localStorage.getItem(usersKey) || '[]')

// Agregar un usuario test en localstorage si no hay ninguno
const user1: User = {
  id: 1,
  firstName: 'Diego',
  lastName: 'Maradona',
  userName: 'dmaradona',
  password: '123456',
  isAdmin: true,
  refreshToken: []
}

const user2: User = {
  id: 2,
  firstName: 'Leo',
  lastName: 'Messi',
  userName: 'lmessi',
  password: '654321',
  isAdmin: false,
  refreshToken: []
}
// si no hay usuarios creamos uno y lo guardamos en almacenamiento local
if (!users.length) {
  users.push(user1)
  users.push(user2)
  localStorage.setItem(usersKey, JSON.stringify(users))
}

function fakeBackend() {
  const realFetch = window.fetch

  window.fetch = function (url, opts: any): Promise<Response> {
    return new Promise((resolve, reject) => {
      // add a 1.5seg delay to simulate the api server response
      setTimeout(handleRoute, 1500)

      // manage fake routes
      function handleRoute() {
        if (opts) {
          const { method } = opts
          switch (true) {
            case url.toString().endsWith('/users/authenticate') && method === 'POST':
              return authenticate()
            case url.toString().endsWith('/users/refresh-token') && method === 'POST':
              return refreshToken()
            case url.toString().endsWith('/users/revoke-token') && method === 'POST':
              return revokeToken()
            case url.toString().endsWith('/users') && method === 'GET':
              return getUsers()
            default:
              // Pass through any requests not handled above
              return realFetch(url, opts)
                .then((response) => resolve(response))
                .catch((error) => reject(error))
          }
        }
      }

      // Funciones de rutas

      function authenticate() {
        const { username, password } = body<AuthRequestBody>()
        const user = users.find((x) => x.userName === username && x.password === password)

        if (!user) return error('Usuario o contraseña incorrectos')

        // Agregar refresh token al usuario
        user.refreshToken.push(generateRefreshToken())
        localStorage.setItem(usersKey, JSON.stringify(users))

        return ok({
          id: user.id,
          userName: user.userName,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin,
          jwtToken: generateJwtToken()
        })
      }

      function refreshToken() {
        const refreshToken = getRefreshToken()
        if (!refreshToken) return unauthorized()

        const user = users.find((x) => x.refreshToken.includes(refreshToken))
        if (!user) return unauthorized()

        // Reemplazar refresh token viejo por uno nuevo y guardar
        user.refreshToken = user.refreshToken.filter((x) => x !== refreshToken)
        user.refreshToken.push(generateRefreshToken())
        localStorage.setItem(usersKey, JSON.stringify(users))

        return ok({
          id: user.id,
          userName: user.userName,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin,
          jwtToken: generateJwtToken()
        })
      }

      function revokeToken() {
        if (!isLoggedIn()) return unauthorized()

        const refreshToken = getRefreshToken()
        const _user = users.find((x) => x.refreshToken.includes(refreshToken))

        // Revocar token y guardar en almacenamiento local
        if (_user !== undefined) {
          _user.refreshToken = _user.refreshToken.filter((x) => x !== refreshToken)
          localStorage.setItem(usersKey, JSON.stringify(users))
        }

        return ok({ msg: 'Token revocado' })
      }

      // funciona para obtener usuarios, controla  si el usuario está logueado
      function getUsers() {
        if (!isLoggedIn()) return unauthorized()
        return ok(users)
      }

      // Funciones Auxiliares

      function ok(body: any) {
        resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(body)) } as Response)
      }

      function unauthorized() {
        resolve({
          status: 401,
          text: () => Promise.resolve(JSON.stringify({ message: 'Unauthorized' }))
        } as Response)
      }

      function error(message: string) {
        resolve({
          status: 400,
          text: () => Promise.resolve(JSON.stringify({ message }))
        } as Response)
      }

      function isLoggedIn(): boolean {
        // check if the JWT is in the auth header
        const authHeader = opts.headers?.['Authorization'] || ''

        if (!authHeader.startsWith('Bearer fake-jwt-token')) return false

        // Check if the token is expired
        try {
          const jwtToken = JSON.parse(atob(authHeader.split('.')[1])) as JwtPayload
          const tokenExpired = Date.now() > jwtToken.exp * 1000
          if (tokenExpired) return false
        } catch {
          return false
        }

        return true
      }

      function body<T>(): T {
        return opts.body ? JSON.parse(opts.body) : ({} as T)
      }

      function generateJwtToken(): string {
        // Crea token que expira en 2 minutos
        const tokenPayload: JwtPayload = { exp: Math.round(Date.now() / 1000 + 2 * 60) }
        const fakeJwtToken: string = `fake-jwt-token.${btoa(JSON.stringify(tokenPayload))}`
        return fakeJwtToken
      }

      function generateRefreshToken(): string {
        const token = new Date().getTime().toString()
        // Agregar un refresh token que expira en 7 dias
        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()
        document.cookie = `fakeRefreshToken=${token}; expires=${expires}; path=/`

        return token
      }

      function getRefreshToken(): string {
        // Obtener el refresh token de la cookie
        return (
          document.cookie.split(';').find((x) => x.includes('fakeRefreshToken')) || '='
        ).split('=')[1]
      }
    })
  }
}
