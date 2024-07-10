import { NotFoundError } from '../../../../domain/error/errors'
import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import { type FindUserInputDTO, type FindUserOutputDTO } from './find-user-dto'
import type FindUserUsecaseInterface from './find-user-usecase.interface'

export default class FindUserUsecase implements FindUserUsecaseInterface {
  private readonly userRepository: UserRepositoryInterface

  constructor (userRepository: UserRepositoryInterface) {
    this.userRepository = userRepository
  }

  async execute (input: FindUserInputDTO): Promise<FindUserOutputDTO> {
    const user = await this.userRepository.findByID(input.id)
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
