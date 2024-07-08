import type DeleteQuestionUseCaseInterface from '../../../../application/question/usecases/delete-question/delete-question-usecase.interface'
import makeHttpErrorResponse from '../../../helpers/http-error-response'
import { type HttpRequest, type HttpResponse } from '../../../protocols/http'

export default class DeleteQuestionController {
  private readonly deleteQuestionUseCase: DeleteQuestionUseCaseInterface

  constructor (deleteQuestionUseCase: DeleteQuestionUseCaseInterface) {
    this.deleteQuestionUseCase = deleteQuestionUseCase
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const input = {
        id: request.params.id
      }
      await this.deleteQuestionUseCase.execute(input)
      return {
        statusCode: 200,
        body: {}
      }
    } catch (error) {
      return makeHttpErrorResponse(error as Error)
    }
  }
}
