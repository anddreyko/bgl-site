export type Visibility = 'private' | 'participants' | 'link' | 'authenticated' | 'public'
export type PlayStatus = 'current' | 'finished'

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
  teamTag?: string
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
  locationId?: string
  name?: string
  startedAt?: string
  finishedAt?: string
  visibility?: Visibility
  players?: PlayerPayload[]
}

export interface PlayUpdatePayload {
  name?: string
  gameId?: string
  locationId?: string
  visibility?: Visibility
  players?: PlayerPayload[]
}

export interface PlaysListParams {
  page?: number
  size?: number
  authorId?: string
  gameId?: string
  status?: PlayStatus
  from?: string
  to?: string
}
