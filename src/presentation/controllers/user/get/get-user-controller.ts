import type GetUserUsecaseInterface from '../../../../application/user/usecases/get-user/get-user-usecase.interface'
import makeHttpErrorResponse from '../../../helpers/http-error-response'
import { type Controller } from '../../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../../protocols/http'

export default class GetUserController implements Controller {
  private readonly getUserUseCase: GetUserUsecaseInterface
  constructor (getUserUseCase: GetUserUsecaseInterface) {
    this.getUserUseCase = getUserUseCase
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = request.params
      const user = await this.getUserUseCase.execute({ id })
      return {
        statusCode: 200,
        body: user
      }
    } catch (error) {
      return makeHttpErrorResponse(error as Error)
    }
  }
}
