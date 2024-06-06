export interface FindRecipientQuestionsInputDTO {
  id: string
}

export interface FindRecipientQuestionsOutputDTO {
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
