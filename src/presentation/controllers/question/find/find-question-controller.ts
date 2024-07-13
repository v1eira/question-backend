import type FindAnsweredQuestionUseCaseInterface from '../../../../application/question/usecases/find-answered-question/find-answered-question.interface'
import makeHttpErrorResponse from '../../../helpers/http-error-response'
import { type Controller } from '../../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../../protocols/http'

export default class FindQuestionController implements Controller {
  private readonly findQuestionUseCase: FindAnsweredQuestionUseCaseInterface

  constructor (findQuestionUseCase: FindAnsweredQuestionUseCaseInterface) {
    this.findQuestionUseCase = findQuestionUseCase
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const input = {
        id: request.params.id
      }
      const question = await this.findQuestionUseCase.execute(input)
      return {
        statusCode: 200,
        body: question
      }
    } catch (error) {
      return makeHttpErrorResponse(error as Error)
    }
  }
}
