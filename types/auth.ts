export interface TokenPair {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface SignUpPayload {
  email: string
  password: string
  name?: string
}

export interface SignInPayload {
  email: string
  password: string
}
