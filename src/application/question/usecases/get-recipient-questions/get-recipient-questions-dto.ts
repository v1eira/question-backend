export interface GetRecipientQuestionsInputDTO {
  id: string
}

export interface GetRecipientQuestionsOutputDTO {
  recipient: {
    id: string
    fullName: string
    username: string
    email: string
  }
  questions: Array<{
    id: string
    content: string
    askerId: string
    recipientId: string
    createdAt: Date
  }>
}
