export interface GetAnsweredQuestionInputDTO {
  id: string
}

export interface GetAnsweredQuestionOutputDTO {
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
  answer: {
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
  }
}
