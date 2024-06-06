import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import { type DeleteUserInputDTO } from './delete-user-dto'

export default class DeleteUserUsecase {
  private readonly userRepository: UserRepositoryInterface

  constructor (userRepository: UserRepositoryInterface) {
    this.userRepository = userRepository
  }

  async execute (input: DeleteUserInputDTO): Promise<void> {
    const user = await this.userRepository.findByID(input.id)
    if (user === null) {
      throw new Error('User not found')
    }

    await this.userRepository.delete(user.id)
  }
}
