export interface FindUserByEmailInputDTO {
  email: string
}

export interface FindUserByEmailOutputDTO {
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
