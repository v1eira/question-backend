import { type Question } from '../../../../domain/question/entity/question'
import type QuestionRepositoryInterface from '../../../../domain/question/repository/question-repository.interface'
import { type QuestionFilters } from '../../../../domain/question/repository/question-repository.interface'

export default class FindAllQuestionsUsecase {
  private readonly questionRepository: QuestionRepositoryInterface

  constructor (questionRepository: QuestionRepositoryInterface) {
    this.questionRepository = questionRepository
  }

  async execute (filters: QuestionFilters): Promise<Question[]> {
    if (Object.keys(filters).length === 0) {
      throw new Error('Filters are required')
    }
    const questions = await this.questionRepository.findAll(filters)

    return questions
  }
}
