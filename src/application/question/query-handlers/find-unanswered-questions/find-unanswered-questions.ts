import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import { type QuestionQueryInterface } from '../../../../domain/question/query/question-query.interface'
import { type FindUnansweredQuestionsInputDto, type FindUnansweredQuestionsOutputDto } from './find-unanswered-questions-dto'
import type FindUnansweredQuestionsQueryHandlerInterface from './find-unanswered-questions.interface'
import { NotFoundError } from '../../../../domain/error/errors'

export default class FindUnansweredQuestionsQueryHandler implements FindUnansweredQuestionsQueryHandlerInterface {
  constructor (
    private readonly userRepository: UserRepositoryInterface,
    private readonly questionQuery: QuestionQueryInterface
  ) {}

  async execute (input: FindUnansweredQuestionsInputDto): Promise<FindUnansweredQuestionsOutputDto> {
    const recipient = await this.userRepository.getByID(input.recipientId)
    if (recipient === null) {
      throw new NotFoundError('Recipient not found')
    }

    const unansweredQuestions = await this.questionQuery.findUserUnansweredQuestions(recipient.id)

    return {
      questions: unansweredQuestions.map((q) => ({
        id: q.question.id,
        content: q.question.content,
        createdAt: q.question.createdAt,
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
