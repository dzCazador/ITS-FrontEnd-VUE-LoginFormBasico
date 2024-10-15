export interface Session {
  payload: string
  created: Date
  refresh: Date
  expires: Date
}

export interface SessionState {
  loading: boolean
  data: Session | null
}
