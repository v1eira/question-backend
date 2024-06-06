import type QuestionRepositoryInterface from '../../../../domain/question/repository/question-repository.interface'
import { type DeleteQuestionInputDTO } from './delete-question-dto'

export default class DeleteQuestionUseCase {
  private readonly questionRepository: QuestionRepositoryInterface

  constructor (questionRepository: QuestionRepositoryInterface) {
    this.questionRepository = questionRepository
  }

  async execute (input: DeleteQuestionInputDTO): Promise<void> {
    const question = await this.questionRepository.findByID(input.id)
    if (question === null) {
      throw new Error('Question not found')
    }

    await this.questionRepository.delete(question.id)
  }
}
