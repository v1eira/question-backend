import { type Answer } from '../entity/answer'

export interface AnswerFilters {
  responderId?: string
  content?: string
}

export default interface AnswerRepositoryInterface {
  create: (Answer: Answer) => Promise<void>
  getByID: (id: string) => Promise<Answer | null>
  getByQuestionID: (id: string) => Promise<Answer | null>
  getAll: (filters: AnswerFilters) => Promise<Answer[]>
  delete: (id: string) => Promise<void>
  // like: (id: string) => Promise<void>
  // dislike: (id: string) => Promise<void>
}
