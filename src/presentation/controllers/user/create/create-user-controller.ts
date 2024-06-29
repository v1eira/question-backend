import type CreateUserUsecaseInterface from '../../../../application/user/usecases/create-user/create-user-usecase.interface'

export interface CreateUserControllerInputDTO {
  fullName: string
  username: string
  email: string
  password: string
  summary?: string
  location?: string
}

export default class CreateUserController {
  private readonly createUserUseCase: CreateUserUsecaseInterface

  constructor (createUserUseCase: CreateUserUsecaseInterface) {
    this.createUserUseCase = createUserUseCase
  }

  async handle (input: CreateUserControllerInputDTO): Promise<void> {
    await this.createUserUseCase.execute(input)
  }
}
