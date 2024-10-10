export interface User {
  id: number,
  firstName: string,
  lastName: string,
  login: string
  password: string,
  rememberMe?: boolean,
  isAdmin: boolean,
  jwtToken?: string,
  refreshToken: string[]
}
