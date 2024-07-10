import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import { type FindUserByEmailInputDTO, type FindUserByEmailOutputDTO } from './find-user-by-email-dto'

export default class FindUserByEmailUsecase {
  private readonly userRepository: UserRepositoryInterface

  constructor (userRepository: UserRepositoryInterface) {
    this.userRepository = userRepository
  }

  async execute (input: FindUserByEmailInputDTO): Promise<FindUserByEmailOutputDTO> {
    const user = await this.userRepository.findByEmail(input.email)
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
