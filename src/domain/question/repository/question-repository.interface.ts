import { type Question } from '../entity/question'

export interface QuestionFilters {
  from?: string[]
  to?: string[]
  content?: string
}

export default interface QuestionRepositoryInterface {
  create: (question: Question) => Promise<void>
  getByID: (id: string) => Promise<Question | null>
  getRecipientQuestions: (recipientId: string) => Promise<Question[]>
  getAll: (filters: QuestionFilters) => Promise<Question[]>
  delete: (id: string) => Promise<void>
}
