import { NotFoundError } from '../../../../domain/error/errors'
import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import { type DeleteUserInputDTO } from './delete-user-dto'
import type DeleteUserUsecaseInterface from './delete-user-usecase.interface'

export default class DeleteUserUsecase implements DeleteUserUsecaseInterface {
  private readonly userRepository: UserRepositoryInterface

  constructor (userRepository: UserRepositoryInterface) {
    this.userRepository = userRepository
  }

  async execute (input: DeleteUserInputDTO): Promise<void> {
    const user = await this.userRepository.getByID(input.id)
    if (user === null) {
      throw new NotFoundError('User not found')
    }

    await this.userRepository.delete(user.id)
  }
}
