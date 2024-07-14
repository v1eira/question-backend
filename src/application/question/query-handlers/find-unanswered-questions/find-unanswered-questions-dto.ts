export interface FindUnansweredQuestionsInputDto {
  recipientId: string
}

export interface FindUnansweredQuestionsOutputDto {
  questions: Array<{
    id: string
    content: string
    createdAt: Date
    asker: {
      id: string
      fullName: string
      username: string
      email: string
    }
  }>
}
