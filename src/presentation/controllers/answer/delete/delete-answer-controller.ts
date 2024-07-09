import type DeleteAnswerUseCaseInterface from '../../../../application/answer/usecases/delete-answer/delete-answer-usecase.interface'
import makeHttpErrorResponse from '../../../helpers/http-error-response'
import { type HttpRequest, type HttpResponse } from '../../../protocols/http'

export default class DeleteAnswerController {
  private readonly deleteAnswerUseCase: DeleteAnswerUseCaseInterface

  constructor (deleteAnswerUseCase: DeleteAnswerUseCaseInterface) {
    this.deleteAnswerUseCase = deleteAnswerUseCase
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const input = {
        id: request.params.id
      }
      await this.deleteAnswerUseCase.execute(input)
      return {
        statusCode: 200,
        body: {}
      }
    } catch (error) {
      return makeHttpErrorResponse(error as Error)
    }
  }
}
