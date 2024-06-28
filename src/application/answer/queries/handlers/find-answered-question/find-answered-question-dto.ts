export interface FindAnsweredQuestionInputDTO {
  id: string
}

export interface FindAnsweredQuestionOutputDTO {
  answer: {
    id: string
    content: string
    likes: number
    createdAt: Date
  }
  question: {
    id: string
    content: string
    createdAt: Date
  }
  asker: {
    id: string
    fullName: string
    username: string
    email: string
  }
  responder: {
    id: string
    fullName: string
    username: string
    email: string
  }
}
