import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import { type QuestionQueryInterface } from '../../../../domain/question/query/question-query.interface'
import { type ListUnansweredQuestionsInputDto, type ListUnansweredQuestionsOutputDto } from './list-unanswered-questions-dto'
import type ListUnansweredQuestionsQueryHandlerInterface from './list-unanswered-questions.interface'
import { NotFoundError } from '../../../../domain/error/errors'

export default class ListUnansweredQuestionsQueryHandler implements ListUnansweredQuestionsQueryHandlerInterface {
  constructor (
    private readonly userRepository: UserRepositoryInterface,
    private readonly questionQuery: QuestionQueryInterface
  ) {}

  async execute (input: ListUnansweredQuestionsInputDto): Promise<ListUnansweredQuestionsOutputDto> {
    const recipient = await this.userRepository.findByID(input.recipientId)
    if (recipient === null) {
      throw new NotFoundError('Recipient not found')
    }

    const unansweredQuestions = await this.questionQuery.listUserUnansweredQuestions(recipient.id)

    return {
      questions: unansweredQuestions.map((q) => ({
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
