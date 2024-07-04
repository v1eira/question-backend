import type DeleteUserUsecaseInterface from '../../../../application/user/usecases/delete-user/delete-user-usecase.interface'
import makeHttpErrorResponse from '../../../helpers/http-error-response'
import { type HttpRequest, type HttpResponse } from '../../../protocols/http'

export default class DeleteUserController {
  private readonly deleteUserUseCase: DeleteUserUsecaseInterface
  constructor (deleteUserUseCase: DeleteUserUsecaseInterface) {
    this.deleteUserUseCase = deleteUserUseCase
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = request.params
      await this.deleteUserUseCase.execute({ id })
      return {
        statusCode: 200,
        body: {}
      }
    } catch (error) {
      return makeHttpErrorResponse(error as Error)
    }
  }
}
