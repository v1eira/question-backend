import type CreateQuestionUseCaseInterface from '../../../../application/question/usecases/create-question/create-question-usecase.interface'
import makeHttpErrorResponse from '../../../helpers/http-error-response'
import { type HttpRequest, type HttpResponse } from '../../../protocols/http'

export default class CreateQuestionController {
  private readonly createQuestionUseCase: CreateQuestionUseCaseInterface

  constructor (createQuestionUseCase: CreateQuestionUseCaseInterface) {
    this.createQuestionUseCase = createQuestionUseCase
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const input = {
        content: request.body.content,
        fromId: request.body.from,
        toId: request.body.to
      }
      await this.createQuestionUseCase.execute(input)
      return {
        statusCode: 201,
        body: {}
      }
    } catch (error) {
      return makeHttpErrorResponse(error as Error)
    }
  }
}
