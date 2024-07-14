export interface GetUserByUsernameInputDTO {
  username: string
}

export interface GetUserByUsernameOutputDTO {
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
