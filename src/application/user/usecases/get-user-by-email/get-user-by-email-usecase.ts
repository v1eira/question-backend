import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import { type GetUserByEmailInputDTO, type GetUserByEmailOutputDTO } from './get-user-by-email-dto'

export default class GetUserByEmailUsecase {
  private readonly userRepository: UserRepositoryInterface

  constructor (userRepository: UserRepositoryInterface) {
    this.userRepository = userRepository
  }

  async execute (input: GetUserByEmailInputDTO): Promise<GetUserByEmailOutputDTO> {
    const user = await this.userRepository.getByEmail(input.email)
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
