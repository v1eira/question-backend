import { NotFoundError } from '../../../../domain/error/errors'
import type QuestionRepositoryInterface from '../../../../domain/question/repository/question-repository.interface'
import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import { type FindQuestionInputDTO, type FindQuestionOutputDTO } from './find-question-dto'
import type FindQuestionUseCaseInterface from './find-question-usecase.interface'

export default class FindQuestionUsecase implements FindQuestionUseCaseInterface {
  private readonly questionRepository: QuestionRepositoryInterface
  private readonly userRepository: UserRepositoryInterface

  constructor (questionRepository: QuestionRepositoryInterface, userRepository: UserRepositoryInterface) {
    this.questionRepository = questionRepository
    this.userRepository = userRepository
  }

  async execute (input: FindQuestionInputDTO): Promise<FindQuestionOutputDTO> {
    const question = await this.questionRepository.findByID(input.id)

    if (question === null) {
      throw new NotFoundError('Question not found')
    }

    const asker = await this.userRepository.findByID(question.askerId)
    if (asker === null) {
      throw new NotFoundError('Asker not found')
    }

    const recipient = await this.userRepository.findByID(question.recipientId)
    if (recipient === null) {
      throw new NotFoundError('Recipient not found')
    }

    return {
      id: question.id,
      content: question.content,
      asker: {
        id: asker.id,
        fullName: asker.fullName,
        username: asker.username,
        email: asker.email
      },
      recipient: {
        id: recipient.id,
        fullName: recipient.fullName,
        username: recipient.username,
        email: recipient.email
      },
      createdAt: question.createdAt
    }
  }
}
