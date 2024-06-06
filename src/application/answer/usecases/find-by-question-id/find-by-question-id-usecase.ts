import type AnswerRepositoryInterface from '../../../../domain/answer/repository/answer-repository.interface'
import { type FindByQuestionIdInputDTO, type FindByQuestionIdOutputDTO } from './find-by-question-id-dto'

export default class FindByQuestionIdUsecase {
  constructor (private readonly answerRepository: AnswerRepositoryInterface) {}

  async execute (input: FindByQuestionIdInputDTO): Promise<FindByQuestionIdOutputDTO> {
    const answer = await this.answerRepository.findByQuestionID(input.questionId)
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
