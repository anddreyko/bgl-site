export interface Mate {
  id: string
  name: string
  notes?: string
  createdAt: string
}

export interface MatePayload {
  name: string
  notes?: string
}

export interface MatesListParams {
  page?: number
  size?: number
  sort?: 'name' | 'createdAt'
  order?: 'asc' | 'desc'
}
