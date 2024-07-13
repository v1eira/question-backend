import * as bcrypt from 'bcrypt'
import { type User } from '../../../../domain/user/entity/user'
import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import { bcryptConfig } from '../../../../infrastructure/config/bcrypt'
import { type UpdateUserInputDTO } from './update-user-dto'
import type UpdateUserUsecaseInterface from './update-user-usecase.interface'
import { ConflictError, InvalidRequestError, NotFoundError } from '../../../../domain/error/errors'

export default class UpdateUserUsecase implements UpdateUserUsecaseInterface {
  private readonly userRepository: UserRepositoryInterface

  constructor (userRepository: UserRepositoryInterface) {
    this.userRepository = userRepository
  }

  async execute (input: UpdateUserInputDTO): Promise<void> {
    const user = await this.userRepository.getByID(input.id)
    if (user == null) {
      throw new NotFoundError('User not found')
    }

    if (input.username != null) {
      const getUser = await this.userRepository.getByUsername(input.username)
      if (getUser != null && getUser.id !== user.id) {
        throw new ConflictError('Username already in use')
      }
    }

    if (input.newPassword != null && input.currentPassword != null) {
      const correctPassword = await bcrypt.compare(input.currentPassword, user.passwordHash)
      if (!correctPassword) {
        throw new InvalidRequestError('Wrong current password')
      }
    }

    await this.updateFields(user, input)

    await this.userRepository.update(user)
  }

  private async updateFields (user: User, input: UpdateUserInputDTO): Promise<void> {
    input.fullName !== undefined && user.changeFullName(input.fullName)
    input.username !== undefined && user.changeUsername(input.username)
    input.newPassword !== undefined && user.changePasswordHash(await bcrypt.hash(input.newPassword, bcryptConfig.saltRounds))
    input.summary !== undefined && user.changeSummary(input.summary)
    input.location !== undefined && user.changeLocation(input.location)
    if (input.profileLocked !== undefined) {
      input.profileLocked ? user.lockProfile() : user.unlockProfile()
    }
    user.setUpdatedAt(new Date())
  }
}
