import { NotFoundError } from '../../../../domain/error/errors'
import type QuestionRepositoryInterface from '../../../../domain/question/repository/question-repository.interface'
import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import { type GetQuestionInputDTO, type GetQuestionOutputDTO } from './get-question-dto'
import type GetQuestionUseCaseInterface from './get-question-usecase.interface'

export default class GetQuestionUsecase implements GetQuestionUseCaseInterface {
  private readonly questionRepository: QuestionRepositoryInterface
  private readonly userRepository: UserRepositoryInterface

  constructor (questionRepository: QuestionRepositoryInterface, userRepository: UserRepositoryInterface) {
    this.questionRepository = questionRepository
    this.userRepository = userRepository
  }

  async execute (input: GetQuestionInputDTO): Promise<GetQuestionOutputDTO> {
    const question = await this.questionRepository.getByID(input.id)

    if (question === null) {
      throw new NotFoundError('Question not found')
    }

    const asker = await this.userRepository.getByID(question.askerId)
    if (asker === null) {
      throw new NotFoundError('Asker not found')
    }

    const recipient = await this.userRepository.getByID(question.recipientId)
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
