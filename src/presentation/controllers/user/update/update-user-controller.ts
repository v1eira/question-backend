import type UpdateUserUsecaseInterface from '../../../../application/user/usecases/update-user/update-user-usecase.interface'
import makeHttpErrorResponse from '../../../helpers/http-error-response'
import { type Controller } from '../../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../../protocols/http'

export default class UpdateUserController implements Controller {
  private readonly updateUserUseCase: UpdateUserUsecaseInterface

  constructor (updateUserUseCase: UpdateUserUsecaseInterface) {
    this.updateUserUseCase = updateUserUseCase
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const input = {
        id: request.params.id,
        fullName: request.body.fullName,
        username: request.body.username,
        currentPassword: request.body.currentPassword,
        newPassword: request.body.newPassword,
        summary: request.body.summary,
        location: request.body.location,
        profileLocked: request.body.profileLocked
      }
      await this.updateUserUseCase.execute(input)
      return {
        statusCode: 200,
        body: {}
      }
    } catch (error) {
      return makeHttpErrorResponse(error as Error)
    }
  }
}
