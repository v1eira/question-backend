import type AnswerRepositoryInterface from '../../../../domain/answer/repository/answer-repository.interface'
import { type GetAnswerInputDTO, type GetAnswerOutputDTO } from './get-answer-dto'

export default class GetAnswerUseCase {
  constructor (
    private readonly answerRepository: AnswerRepositoryInterface
  ) {}

  async execute (input: GetAnswerInputDTO): Promise<GetAnswerOutputDTO> {
    const answer = await this.answerRepository.getByID(input.id)
    if (answer == null) {
      throw new Error('Answer not found')
    }

    return {
      id: answer.id,
      content: answer.content,
      responderId: answer.responderId,
      questionId: answer.questionId,
      likes: answer.likes,
      createdAt: answer.createdAt
    }
  }
}
