import type FindQuestionUseCaseInterface from '../../../../application/question/usecases/find-question/find-question-usecase.interface'
import makeHttpErrorResponse from '../../../helpers/http-error-response'
import { type HttpRequest, type HttpResponse } from '../../../protocols/http'

export default class FindQuestionController {
  private readonly findQuestionUseCase: FindQuestionUseCaseInterface

  constructor (findQuestionUseCase: FindQuestionUseCaseInterface) {
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
