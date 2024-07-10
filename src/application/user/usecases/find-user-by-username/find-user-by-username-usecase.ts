import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import { type FindUserByUsernameInputDTO, type FindUserByUsernameOutputDTO } from './find-user-by-username-dto'

export default class FindUserByUsernameUsecase {
  private readonly userRepository: UserRepositoryInterface

  constructor (userRepository: UserRepositoryInterface) {
    this.userRepository = userRepository
  }

  async execute (input: FindUserByUsernameInputDTO): Promise<FindUserByUsernameOutputDTO> {
    const user = await this.userRepository.findByUsername(input.username)
    if (user === null) {
      throw new Error('User not found')
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
