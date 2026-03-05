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

export interface ConfirmPayload {
  token: string
}

export interface PasskeyRegisterOptions {
  options: Record<string, unknown>
}

export interface PasskeySignInOptions {
  options: Record<string, unknown>
}
