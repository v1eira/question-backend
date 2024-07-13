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
  findAnsweredQuestions: (params: SearchParams) => Promise<AnsweredQuestion[]>
  findUserUnansweredQuestions: (userId: string) => Promise<QuestionWithAsker[]>
}
