import * as bcrypt from 'bcrypt'
import { type User } from '../../../../domain/user/entity/user'
import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import { bcryptConfig } from '../../../../infrastructure/config/bcrypt'
import { type UpdateUserInputDTO } from './update-user-dto'

export default class UpdateUserUsecase {
  private readonly userRepository: UserRepositoryInterface

  constructor (userRepository: UserRepositoryInterface) {
    this.userRepository = userRepository
  }

  async execute (input: UpdateUserInputDTO): Promise<void> {
    const user = await this.userRepository.findByID(input.id)
    if (user == null) {
      throw new Error('User not found')
    }

    if (input.username != null) {
      const findUser = await this.userRepository.findByUsername(input.username)
      if (findUser != null && findUser.id !== user.id) {
        throw new Error('Username already in use')
      }
    }

    if (input.newPassword != null && input.currentPassword != null) {
      const correctPassword = await bcrypt.compare(input.currentPassword, user.passwordHash)
      if (!correctPassword) {
        throw new Error('Wrong current password')
      }
    }

    await this.updateFields(user, input)

    await this.userRepository.update(user)
  }

  private async updateFields (user: User, input: UpdateUserInputDTO): Promise<void> {
    input.fullName != null && user.changeFullName(input.fullName)
    input.username != null && user.changeUsername(input.username)
    input.newPassword != null && user.changePasswordHash(await bcrypt.hash(input.newPassword, bcryptConfig.saltRounds))
    input.summary != null && user.changeSummary(input.summary)
    input.location != null && user.changeLocation(input.location)
    input.profileLocked === true ? user.lockProfile() : user.unlockProfile()
    user.setUpdatedAt(new Date())
  }
}
