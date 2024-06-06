export interface FindUserByUsernameInputDTO {
  username: string
}

export interface FindUserByUsernameOutputDTO {
  id: string
  fullName: string
  username: string
  email: string
  summary: string
  location: string
  profileLocked: boolean
  followersCount: number
  followingCount: number
  likedAnswersCount: number
  createdAt: Date
}
