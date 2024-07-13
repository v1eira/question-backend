import { Answer } from '../../../../domain/answer/entity/answer'
import type AnswerRepositoryInterface from '../../../../domain/answer/repository/answer-repository.interface'
import { ConflictError, NotFoundError } from '../../../../domain/error/errors'
import type QuestionRepositoryInterface from '../../../../domain/question/repository/question-repository.interface'
import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import { type CreateAnswerInputDTO } from './create-answer-dto'
import { v4 as uuid } from 'uuid'
import type CreateAnswerUsecaseInterface from './create-answer-usecase.interface'

export default class CreateAnswerUseCase implements CreateAnswerUsecaseInterface {
  constructor (
    private readonly answerRepository: AnswerRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface,
    private readonly questionRepository: QuestionRepositoryInterface
  ) {}

  async execute (input: CreateAnswerInputDTO): Promise<void> {
    const answerExists = await this.answerRepository.getByQuestionID(input.questionId)
    if (answerExists != null) {
      throw new ConflictError('Answer already exists')
    }
    const question = await this.questionRepository.getByID(input.questionId)
    if (question == null) {
      throw new NotFoundError('Question not found')
    }

    const responder = await this.userRepository.getByID(input.responderId)
    if (responder == null) {
      throw new NotFoundError('Responder not found')
    }

    if (question.recipientId !== responder.id) {
      throw new ConflictError('Responder is not the recipient of the question')
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
