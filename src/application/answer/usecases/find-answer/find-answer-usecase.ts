import type AnswerRepositoryInterface from '../../../../domain/answer/repository/answer-repository.interface'
import { type FindAnswerInputDTO, type FindAnswerOutputDTO } from './find-answer-dto'

export default class FindAnswerUseCase {
  constructor (
    private readonly answerRepository: AnswerRepositoryInterface
  ) {}

  async execute (input: FindAnswerInputDTO): Promise<FindAnswerOutputDTO> {
    const answer = await this.answerRepository.findByID(input.id)
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
