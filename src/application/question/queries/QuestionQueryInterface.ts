export interface QuestionWithAsker {
  id: string
  content: string
  recipientId: string
  createdAt: Date
  asker: {
    id: string
    fullName: string
    username: string
    email: string
  }
}

export interface QuestionQueryInterface {
  listRecipientQuestionsWithAsker: (recipientId: string) => Promise<QuestionWithAsker[]>
}
