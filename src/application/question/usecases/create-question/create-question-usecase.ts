import { v4 as uuid } from 'uuid'
import { Question } from '../../../../domain/question/entity/question'
import type QuestionRepositoryInterface from '../../../../domain/question/repository/question-repository.interface'
import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import { type CreateQuestionInputDTO } from './create-question-dto'
import type CreateQuestionUseCaseInterface from './create-question-usecase.interface'
import { InvalidRequestError, NotFoundError } from '../../../../domain/error/errors'

export default class CreateQuestionUsecase implements CreateQuestionUseCaseInterface {
  private readonly questionRepository: QuestionRepositoryInterface
  private readonly userRepository: UserRepositoryInterface

  constructor (questionRepository: QuestionRepositoryInterface, userRepository: UserRepositoryInterface) {
    this.questionRepository = questionRepository
    this.userRepository = userRepository
  }

  async execute (input: CreateQuestionInputDTO): Promise<void> {
    if (input.fromId === input.toId) {
      throw new InvalidRequestError('Source and target users should be different')
    }

    const fromUser = await this.userRepository.getByID(input.fromId)
    if (fromUser === null) {
      throw new NotFoundError('Source user not found')
    }

    const toUser = await this.userRepository.getByID(input.toId)
    if (toUser === null) {
      throw new NotFoundError('Target user not found')
    }

    const question = new Question({
      id: uuid(),
      content: input.content,
      askerId: fromUser.id,
      recipientId: toUser.id
    })
    await this.questionRepository.create(question)
  }
}
