import { type Answer } from '../../answer/entity/answer'
import { type User } from '../../user/entity/user'
import { type Question } from '../entity/question'

export interface QuestionWithAsker {
  question: Question
  asker: User
}

export interface AnsweredQuestion {
  question: Question
  asker: User
  answer: Answer
  responder: User
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
