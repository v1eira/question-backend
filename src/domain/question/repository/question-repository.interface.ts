import { type Question } from '../entity/question'

export interface QuestionFilters {
  from?: string[]
  to?: string[]
  content?: string
}

export default interface QuestionRepositoryInterface {
  create: (question: Question) => Promise<void>
  findByID: (id: string) => Promise<Question | null>
  findRecipientQuestions: (recipientId: string) => Promise<Question[]>
  findAll: (filters: QuestionFilters) => Promise<Question[]>
  delete: (id: string) => Promise<void>
}
