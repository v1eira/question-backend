import type CreateAnswerUsecaseInterface from '../../../../application/answer/usecases/create-answer/create-answer-usecase.interface'
import makeHttpErrorResponse from '../../../helpers/http-error-response'
import { type Controller } from '../../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../../protocols/http'

export default class CreateAnswerController implements Controller {
  private readonly createAnswerUseCase: CreateAnswerUsecaseInterface

  constructor (createAnswerUseCase: CreateAnswerUsecaseInterface) {
    this.createAnswerUseCase = createAnswerUseCase
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const input = {
        questionId: request.body.questionId,
        responderId: request.body.responderId,
        content: request.body.content
      }
      await this.createAnswerUseCase.execute(input)
      return {
        statusCode: 201,
        body: {}
      }
    } catch (error) {
      return makeHttpErrorResponse(error as Error)
    }
  }
}
