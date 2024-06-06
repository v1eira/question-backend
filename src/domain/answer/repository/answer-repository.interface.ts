import { type Answer } from '../entity/answer'

export interface AnswerFilters {
  from?: string[]
  to?: string[]
  content?: string
}

export default interface AnswerRepositoryInterface {
  create: (Answer: Answer) => Promise<void>
  findByID: (id: string) => Promise<Answer | null>
  findByQuestionID: (id: string) => Promise<Answer | null>
  findAll: (filters: AnswerFilters) => Promise<Answer[]>
  delete: (id: string) => Promise<void>
  // like: (id: string) => Promise<void>
  // dislike: (id: string) => Promise<void>
}
