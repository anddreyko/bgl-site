export interface ApiResponse<T> {
  code: number
  message?: string
  data: T
}

export interface ApiError {
  code: number
  message: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
}
