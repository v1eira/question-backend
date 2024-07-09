import type AnswerRepositoryInterface from '../../../../domain/answer/repository/answer-repository.interface'
import { NotFoundError } from '../../../../domain/error/errors'
import { type DeleteAnswerInputDTO } from './delete-answer-dto'
import type DeleteAnswerUseCaseInterface from './delete-answer-usecase.interface'

export default class DeleteAnswerUseCase implements DeleteAnswerUseCaseInterface {
  constructor (
    private readonly answerRepository: AnswerRepositoryInterface
  ) {}

  async execute (input: DeleteAnswerInputDTO): Promise<void> {
    const answer = await this.answerRepository.findByID(input.id)
    if (answer == null) {
      throw new NotFoundError('Answer not found')
    }
    await this.answerRepository.delete(input.id)
  }
}
