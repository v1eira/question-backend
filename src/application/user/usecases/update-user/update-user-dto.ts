export interface UpdateUserInputDTO {
  id: string
  fullName?: string
  username?: string
  currentPassword?: string
  newPassword?: string
  summary?: string
  location?: string
  profileLocked?: boolean
}
