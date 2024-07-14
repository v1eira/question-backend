import type AnswerRepositoryInterface from '../../../../domain/answer/repository/answer-repository.interface'
import { type GetByQuestionIdInputDTO, type GetByQuestionIdOutputDTO } from './get-by-question-id-dto'

export default class GetByQuestionIdUsecase {
  constructor (private readonly answerRepository: AnswerRepositoryInterface) {}

  async execute (input: GetByQuestionIdInputDTO): Promise<GetByQuestionIdOutputDTO> {
    const answer = await this.answerRepository.getByQuestionID(input.questionId)
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
