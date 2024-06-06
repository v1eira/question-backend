import type AnswerRepositoryInterface from '../../../../domain/answer/repository/answer-repository.interface'
import { type DeleteAnswerInputDTO } from './delete-answer-dto'

export default class DeleteAnswerUseCase {
  constructor (
    private readonly answerRepository: AnswerRepositoryInterface
  ) {}

  async execute (input: DeleteAnswerInputDTO): Promise<void> {
    const answer = await this.answerRepository.findByID(input.id)
    if (answer == null) {
      throw new Error('Answer not found')
    }
    await this.answerRepository.delete(input.id)
  }
}
