export interface FindQuestionInputDTO {
  id: string
}

export interface FindQuestionOutputDTO {
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
