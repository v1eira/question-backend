export interface AnswerWithQuestionAndUsers {
  id: string
  content: string
  likes: number
  createdAt: Date
  responder: {
    id: string
    fullName: string
    username: string
    email: string
  }
  question: {
    id: string
    content: string
    createdAt: Date
    asker: {
      id: string
      fullName: string
      username: string
      email: string
    }
  }
}

export interface AnswerQueryInterface {
  findAnsweredQuestion: (answerId: string) => Promise<AnswerWithQuestionAndUsers | null>
  listUserAnsweredQuestions: (userId: string) => Promise<AnswerWithQuestionAndUsers[]>
}
