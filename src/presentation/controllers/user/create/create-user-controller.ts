import type CreateUserUsecaseInterface from '../../../../application/user/usecases/create-user/create-user-usecase.interface'
import makeHttpErrorResponse from '../../../helpers/http-error-response'
import { type HttpRequest, type HttpResponse } from '../../../protocols/http'

export default class CreateUserController {
  private readonly createUserUseCase: CreateUserUsecaseInterface

  constructor (createUserUseCase: CreateUserUsecaseInterface) {
    this.createUserUseCase = createUserUseCase
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const input = {
        fullName: request.body.fullName,
        username: request.body.username,
        email: request.body.email,
        password: request.body.password,
        summary: request.body.summary,
        location: request.body.location
      }
      await this.createUserUseCase.execute(input)
      return {
        statusCode: 201,
        body: {}
      }
    } catch (error) {
      return makeHttpErrorResponse(error as Error)
    }
  }
}
