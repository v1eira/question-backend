export interface GetUserByEmailInputDTO {
  email: string
}

export interface GetUserByEmailOutputDTO {
  id: string
  fullName: string
  username: string
  email: string
  summary: string
  location: string
  profileLocked: boolean
  followersCount: number
  followingCount: number
  createdAt: Date
}
