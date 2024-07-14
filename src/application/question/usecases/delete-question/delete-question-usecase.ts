import { NotFoundError } from '../../../../domain/error/errors'
import type QuestionRepositoryInterface from '../../../../domain/question/repository/question-repository.interface'
import { type DeleteQuestionInputDTO } from './delete-question-dto'
import type DeleteQuestionUseCaseInterface from './delete-question-usecase.interface'

export default class DeleteQuestionUseCase implements DeleteQuestionUseCaseInterface {
  private readonly questionRepository: QuestionRepositoryInterface

  constructor (questionRepository: QuestionRepositoryInterface) {
    this.questionRepository = questionRepository
  }

  async execute (input: DeleteQuestionInputDTO): Promise<void> {
    const question = await this.questionRepository.getByID(input.id)
    if (question === null) {
      throw new NotFoundError('Question not found')
    }

    await this.questionRepository.delete(question.id)
  }
}
