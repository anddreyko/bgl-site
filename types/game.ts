export type GameType = 'base' | 'expansion' | 'standalone_expansion'

export interface Game {
  id: string
  bggId: number
  name: string
  alternativeNames?: string[]
  yearPublished?: number
  type?: GameType
  minPlayers?: number
  maxPlayers?: number
  image?: string
  family?: string
}

export interface GamesSearchParams {
  q: string
  page?: number
  size?: number
}
