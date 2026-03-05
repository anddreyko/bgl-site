export type Visibility = 'private' | 'participants' | 'link' | 'authenticated' | 'public'

export type PlayStatus = 'draft' | 'published' | 'deleted'

export interface Player {
  id: string
  mateId: string
  teamTag?: string
  score?: number
  number?: number
  color?: string
  winner?: boolean
}

export interface Play {
  id: string
  name?: string
  status: PlayStatus
  visibility: Visibility
  startedAt: string
  finishedAt?: string
  game?: { id: string, name: string }
  gameName?: string
  players: Player[]
  includeInStats: boolean
}

export interface PlayCreatePayload {
  gameId?: string
  name?: string
  startedAt?: string
  finishedAt?: string
  visibility: Visibility
  players: Omit<Player, 'id'>[]
}

export interface PlayUpdatePayload {
  name?: string
  gameId?: string
  visibility: Visibility
}

export interface PlaysListParams {
  page?: number
  size?: number
  gameId?: string
  from?: string
  to?: string
}
