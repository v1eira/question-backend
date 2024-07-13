export interface GetUserInputDTO {
  id: string
}

export interface GetUserOutputDTO {
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
