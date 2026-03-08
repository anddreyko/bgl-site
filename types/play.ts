export type Visibility = 'private' | 'participants' | 'link' | 'authenticated' | 'public'

export type PlayStatus = 'draft' | 'published' | 'deleted'

export interface Player {
  id: string
  mateId: string
  mateName?: string
  score?: number
  color?: string
  isWinner?: boolean
  teamTag?: string
  number?: number
}

export interface PlayerPayload {
  mateId: string
  score?: number
  isWinner?: boolean
  color?: string
}

export interface Play {
  id: string
  author?: { id: string, name: string }
  name?: string
  notes?: string
  status: PlayStatus
  visibility: Visibility
  startedAt: string
  finishedAt?: string
  game?: { id: string, name: string }
  gameName?: string
  locationId?: string
  players: Player[]
}

export interface PlayCreatePayload {
  gameId?: string
  name?: string
  startedAt?: string
  finishedAt?: string
  visibility?: Visibility
  players?: PlayerPayload[]
}

export interface PlayUpdatePayload {
  name?: string
  gameId?: string
  visibility?: Visibility
  status?: PlayStatus | null
  players?: PlayerPayload[]
}

export interface PlaysListParams {
  page?: number
  size?: number
  authorId?: string
  gameId?: string
  from?: string
  to?: string
}
