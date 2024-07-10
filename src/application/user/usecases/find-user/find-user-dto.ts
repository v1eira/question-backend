export interface FindUserInputDTO {
  id: string
}

export interface FindUserOutputDTO {
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
