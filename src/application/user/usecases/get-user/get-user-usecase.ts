import { NotFoundError } from '../../../../domain/error/errors'
import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import { type GetUserInputDTO, type GetUserOutputDTO } from './get-user-dto'
import type GetUserUsecaseInterface from './get-user-usecase.interface'

export default class GetUserUsecase implements GetUserUsecaseInterface {
  private readonly userRepository: UserRepositoryInterface

  constructor (userRepository: UserRepositoryInterface) {
    this.userRepository = userRepository
  }

  async execute (input: GetUserInputDTO): Promise<GetUserOutputDTO> {
    const user = await this.userRepository.getByID(input.id)
    if (user === null) {
      throw new NotFoundError('User not found')
    }
    return {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      summary: user.summary,
      location: user.location,
      profileLocked: user.profileLocked,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      createdAt: user.createdAt
    }
  }
}
