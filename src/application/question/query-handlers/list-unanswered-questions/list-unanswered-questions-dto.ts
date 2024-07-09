export interface ListUnansweredQuestionsInputDto {
  recipientId: string
}

export interface ListUnansweredQuestionsOutputDto {
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
