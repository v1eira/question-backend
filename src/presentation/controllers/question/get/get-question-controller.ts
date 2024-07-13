import type GetAnsweredQuestionUseCaseInterface from '../../../../application/question/usecases/get-answered-question/get-answered-question.interface'
import makeHttpErrorResponse from '../../../helpers/http-error-response'
import { type Controller } from '../../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../../protocols/http'

export default class GetQuestionController implements Controller {
  private readonly getQuestionUseCase: GetAnsweredQuestionUseCaseInterface

  constructor (getQuestionUseCase: GetAnsweredQuestionUseCaseInterface) {
    this.getQuestionUseCase = getQuestionUseCase
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const input = {
        id: request.params.id
      }
      const question = await this.getQuestionUseCase.execute(input)
      return {
        statusCode: 200,
        body: question
      }
    } catch (error) {
      return makeHttpErrorResponse(error as Error)
    }
  }
}
