import type FindUnansweredQuestionsQueryHandlerInterface from '../../../../application/question/query-handlers/find-unanswered-questions/find-unanswered-questions.interface'
import makeHttpErrorResponse from '../../../helpers/http-error-response'
import { type Controller } from '../../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../../protocols/http'

export default class FindUnansweredQuestionsController implements Controller {
  private readonly findUnansweredQuestionsQueryHandler: FindUnansweredQuestionsQueryHandlerInterface

  constructor (findUnansweredQuestionsQueryHandler: FindUnansweredQuestionsQueryHandlerInterface) {
    this.findUnansweredQuestionsQueryHandler = findUnansweredQuestionsQueryHandler
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const recipientId = request.params.recipientId
      const questions = await this.findUnansweredQuestionsQueryHandler.execute({ recipientId })
      return {
        statusCode: 200,
        body: questions
      }
    } catch (error) {
      return makeHttpErrorResponse(error as Error)
    }
  }
}
