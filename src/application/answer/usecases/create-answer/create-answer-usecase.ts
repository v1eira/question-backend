import { Answer } from '../../../../domain/answer/entity/answer'
import type AnswerRepositoryInterface from '../../../../domain/answer/repository/answer-repository.interface'
import type QuestionRepositoryInterface from '../../../../domain/question/repository/question-repository.interface'
import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import { type CreateAnswerInputDTO } from './create-answer-dto'
import { v4 as uuid } from 'uuid'

export default class CreateAnswerUseCase {
  constructor (
    private readonly answerRepository: AnswerRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface,
    private readonly questionRepository: QuestionRepositoryInterface
  ) {}

  async execute (input: CreateAnswerInputDTO): Promise<void> {
    const question = await this.questionRepository.findByID(input.questionId)
    if (question == null) {
      throw new Error('Question not found')
    }

    const responder = await this.userRepository.findByID(input.responderId)
    if (responder == null) {
      throw new Error('Responder not found')
    }

    if (question.recipientId !== responder.id) {
      throw new Error('Responder is not the recipient of the question')
    }

    const answer = new Answer({
      id: uuid(),
      content: input.content,
      responderId: input.responderId,
      questionId: input.questionId
    })
    await this.answerRepository.create(answer)
  }
}
