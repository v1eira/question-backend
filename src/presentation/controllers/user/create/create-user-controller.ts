import type CreateUserUsecaseInterface from '../../../../application/user/usecases/create-user/create-user-usecase.interface'
import makeHttpErrorResponse from '../../../helpers/http-error-response'
import { type Controller } from '../../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../../protocols/http'
import { type Validation } from '../../../protocols/validation'

export default class CreateUserController implements Controller {
  private readonly createUserUseCase: CreateUserUsecaseInterface
  private readonly validation: Validation

  constructor (createUserUseCase: CreateUserUsecaseInterface, validation: Validation) {
    this.createUserUseCase = createUserUseCase
    this.validation = validation
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

      await this.validation.validate(input)

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
