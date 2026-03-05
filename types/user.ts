import type { Visibility } from './play'

export type UserStatus = 'inactive' | 'active' | 'deleted'

export interface User {
  id: string
  email: string
  name: string
  isActive: boolean
  createdAt: string
  bggUsername?: string
  defaultVisibility?: Visibility
}
