import { type AnswerQueryInterface } from '../../AnswerQueryInterface'
import { type FindAnsweredQuestionInputDTO, type FindAnsweredQuestionOutputDTO } from './find-answered-question-dto'

export default class FindAnsweredQuestionQueryHandler {
  private readonly answerQuery: AnswerQueryInterface
  constructor (answerQuery: AnswerQueryInterface) {
    this.answerQuery = answerQuery
  }

  async execute (input: FindAnsweredQuestionInputDTO): Promise<FindAnsweredQuestionOutputDTO> {
    const answeredQuestion = await this.answerQuery.findAnsweredQuestion(input.id)
    if (answeredQuestion == null) {
      throw new Error('Answer not found')
    }

    return {
      answer: {
        id: answeredQuestion.id,
        content: answeredQuestion.content,
        likes: answeredQuestion.likes,
        createdAt: answeredQuestion.createdAt
      },
      question: {
        id: answeredQuestion.question.id,
        content: answeredQuestion.question.content,
        createdAt: answeredQuestion.question.createdAt
      },
      asker: {
        id: answeredQuestion.question.asker.id,
        fullName: answeredQuestion.question.asker.fullName,
        username: answeredQuestion.question.asker.username,
        email: answeredQuestion.question.asker.email
      },
      responder: {
        id: answeredQuestion.responder.id,
        fullName: answeredQuestion.responder.fullName,
        username: answeredQuestion.responder.username,
        email: answeredQuestion.responder.email
      }
    }
  }
}
