export interface Place {
  id: string
  name: string
  address?: string
  notes?: string
  url?: string
  createdAt: string
}

export interface PlacePayload {
  name: string
  address?: string
  notes?: string
  url?: string
}

export interface PlacesListParams {
  page?: number
  size?: number
  sort?: 'name' | 'createdAt'
  order?: 'asc' | 'desc'
}
