import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import { type GetUserByUsernameInputDTO, type GetUserByUsernameOutputDTO } from './get-user-by-username-dto'

export default class GetUserByUsernameUsecase {
  private readonly userRepository: UserRepositoryInterface

  constructor (userRepository: UserRepositoryInterface) {
    this.userRepository = userRepository
  }

  async execute (input: GetUserByUsernameInputDTO): Promise<GetUserByUsernameOutputDTO> {
    const user = await this.userRepository.getByUsername(input.username)
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
