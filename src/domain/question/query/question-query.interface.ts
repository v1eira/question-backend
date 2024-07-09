export interface QuestionWithAsker {
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

export interface AnsweredQuestion {
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

export interface SearchParams {
  page: number
  pageSize: number
  askerId?: string
  responderId?: string
}

export interface QuestionQueryInterface {
  findAnsweredQuestionById: (id: string) => Promise<AnsweredQuestion | null>
  listAnsweredQuestions: (params: SearchParams) => Promise<AnsweredQuestion[]>
  listUserUnansweredQuestions: (userId: string) => Promise<QuestionWithAsker[]>
}
