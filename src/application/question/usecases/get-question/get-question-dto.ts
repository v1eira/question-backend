export interface GetQuestionInputDTO {
  id: string
}

export interface GetQuestionOutputDTO {
  id: string
  content: string
  asker: {
    id: string
    fullName: string
    username: string
    email: string
  }
  recipient: {
    id: string
    fullName: string
    username: string
    email: string
  }
  createdAt: Date
}
