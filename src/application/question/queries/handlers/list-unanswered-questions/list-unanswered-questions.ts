import type UserRepositoryInterface from '../../../../../domain/user/repository/user-repository.interface'
import { type QuestionQueryInterface } from '../../QuestionQueryInterface'
import { type ListUnansweredQuestionsInputDto, type ListUnansweredQuestionsOutputDto } from './list-unanswered-questions-dto'

export default class ListUnansweredQuestionsQueryHandler {
  constructor (
    private readonly userRepository: UserRepositoryInterface,
    private readonly questionQuery: QuestionQueryInterface
  ) {}

  async execute (input: ListUnansweredQuestionsInputDto): Promise<ListUnansweredQuestionsOutputDto> {
    const recipient = await this.userRepository.findByID(input.recipientId)
    if (recipient === null) {
      throw new Error('Recipient not found')
    }

    const questionsToAnswer = await this.questionQuery.listRecipientQuestionsWithAsker(recipient.id)

    return {
      questions: questionsToAnswer.map((q) => ({
        id: q.id,
        content: q.content,
        createdAt: q.createdAt,
        asker: {
          id: q.asker.id,
          fullName: q.asker.fullName,
          username: q.asker.username,
          email: q.asker.email
        }
      }))
    }
  }
}
