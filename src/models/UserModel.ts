export interface User {
  id: number
  firstName: string
  lastName: string
  userName: string
  password: string
  rememberMe?: boolean
  isAdmin: boolean
  jwtToken?: string
  refreshToken: string[]
}

export interface UserState {
  loading: boolean
  users: User[] | null | undefined
}
