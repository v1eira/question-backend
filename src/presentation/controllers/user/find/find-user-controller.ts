import type FindUserUsecaseInterface from '../../../../application/user/usecases/find-user/find-user-usecase.interface'
import makeHttpErrorResponse from '../../../helpers/http-error-response'
import { type Controller } from '../../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../../protocols/http'

export default class FindUserController implements Controller {
  private readonly findUserUseCase: FindUserUsecaseInterface
  constructor (findUserUseCase: FindUserUsecaseInterface) {
    this.findUserUseCase = findUserUseCase
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = request.params
      const user = await this.findUserUseCase.execute({ id })
      return {
        statusCode: 200,
        body: user
      }
    } catch (error) {
      return makeHttpErrorResponse(error as Error)
    }
  }
}
