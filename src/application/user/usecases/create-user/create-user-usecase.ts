import { hash } from 'bcrypt'
import { v4 as uuid } from 'uuid'
import { User } from '../../../../domain/user/entity/user'
import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import { bcryptConfig } from '../../../../infrastructure/config/bcrypt'
import { type CreateUserInputDTO } from './create-user-dto'
import type CreateUserUsecaseInterface from './create-user-usecase.interface'
import { ConflictError } from '../../../../domain/error/errors'

export default class CreateUserUsecase implements CreateUserUsecaseInterface {
  private readonly userRepository: UserRepositoryInterface

  constructor (userRepository: UserRepositoryInterface) {
    this.userRepository = userRepository
  }

  async execute (input: CreateUserInputDTO): Promise<void> {
    await this.checkIfUserAlreadyExists(input)

    const newUser = new User({
      id: uuid(),
      fullName: input.fullName,
      username: input.username,
      email: input.email,
      passwordHash: await hash(input.password, bcryptConfig.saltRounds),
      summary: input.summary ?? '',
      location: input.location ?? '',
      profileLocked: false
    })

    await this.userRepository.create(newUser)
  }

  private async checkIfUserAlreadyExists (input: CreateUserInputDTO): Promise<void> {
    let getUser = await this.userRepository.getByUsername(input.username)
    if (getUser !== null) {
      throw new ConflictError('Username already in use')
    }

    getUser = await this.userRepository.getByEmail(input.email)
    if (getUser !== null) {
      throw new ConflictError('Email already in use')
    }
  }
}
