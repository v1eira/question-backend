import type QuestionRepositoryInterface from '../../../../domain/question/repository/question-repository.interface'
import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import { type FindRecipientQuestionsInputDTO, type FindRecipientQuestionsOutputDTO } from './find-recipient-questions-dto'

export default class FindRecipientQuestionsUsecase {
  private readonly questionRepository: QuestionRepositoryInterface
  private readonly userRepository: UserRepositoryInterface

  constructor (questionRepository: QuestionRepositoryInterface, userRepository: UserRepositoryInterface) {
    this.questionRepository = questionRepository
    this.userRepository = userRepository
  }

  async execute (input: FindRecipientQuestionsInputDTO): Promise<FindRecipientQuestionsOutputDTO> {
    const recipient = await this.userRepository.findByID(input.id)
    if (recipient === null) {
      throw new Error('Recipient not found')
    }

    const questions = await this.questionRepository.findRecipientQuestions(input.id)

    return {
      recipient: {
        id: recipient.id,
        fullName: recipient.fullName,
        username: recipient.username,
        email: recipient.email
      },
      questions: questions.map((q) => ({
        id: q.id,
        content: q.content,
        askerId: q.askerId,
        recipientId: q.recipientId,
        createdAt: q.createdAt
      }))
    }
  }
}
