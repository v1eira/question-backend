import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import { type FindUserInputDTO, type FindUserOutputDTO } from './find-user-dto'

export default class FindUserUsecase {
  private readonly userRepository: UserRepositoryInterface

  constructor (userRepository: UserRepositoryInterface) {
    this.userRepository = userRepository
  }

  async execute (input: FindUserInputDTO): Promise<FindUserOutputDTO> {
    const user = await this.userRepository.findByID(input.id)
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
      likedAnswersCount: user.likedAnswersCount,
      createdAt: user.createdAt
    }
  }
}
