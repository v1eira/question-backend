import type ListUnansweredQuestionsQueryHandlerInterface from '../../../../application/question/query-handlers/list-unanswered-questions/list-unanswered-questions.interface'
import makeHttpErrorResponse from '../../../helpers/http-error-response'
import { type Controller } from '../../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../../protocols/http'

export default class ListUnansweredQuestionsController implements Controller {
  private readonly listUnansweredQuestionsQueryHandler: ListUnansweredQuestionsQueryHandlerInterface

  constructor (listUnansweredQuestionsQueryHandler: ListUnansweredQuestionsQueryHandlerInterface) {
    this.listUnansweredQuestionsQueryHandler = listUnansweredQuestionsQueryHandler
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const recipientId = request.params.recipientId
      const questions = await this.listUnansweredQuestionsQueryHandler.execute({ recipientId })
      return {
        statusCode: 200,
        body: questions
      }
    } catch (error) {
      return makeHttpErrorResponse(error as Error)
    }
  }
}
