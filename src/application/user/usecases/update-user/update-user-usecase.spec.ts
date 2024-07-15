import { afterEach, describe, expect, it, vitest } from 'vitest'
import UserBuilder from '../../../../domain/user/entity/user-data-builder'
import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import UpdateUserUsecase from './update-user-usecase'
import { type UpdateUserInputDTO } from './update-user-dto'

vitest.mock('bcrypt', () => ({
  async compare (pass: string, hash: string): Promise<boolean> {
    return pass === 'correctPassword'
  },
  async hash (pass: string, rounds: number): Promise<string> {
    return pass
  }
}))

const anUser = new UserBuilder()

const MockRepository = (): UserRepositoryInterface => {
  return {
    create: vitest.fn(),
    update: vitest.fn(),
    getByID: vitest.fn().mockImplementation(id =>
      id === '1'
        ? anUser.withId('1').build()
        : null
    ),
    getByEmail: vitest.fn(),
    getByUsername: vitest.fn().mockImplementation(username =>
      username === 'usernameAlreadyExists'
        ? anUser.withId('randomID').withUsername('usernameAlreadyExists').build()
        : null
    ),
    getAll: vitest.fn(),
    delete: vitest.fn()
  }
}

describe('Update User Usecase tests', () => {
  const userRepository = MockRepository()
  const updateUserUsecase = new UpdateUserUsecase(userRepository)

  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('Should update an user', async () => {
    const updateUserInput: UpdateUserInputDTO = {
      id: '1',
      currentPassword: 'correctPassword',
      newPassword: 'newPassword',
      fullName: 'Updated User 01',
      location: 'Updated location',
      profileLocked: true,
      summary: 'Updated summary',
      username: 'updatedUser01'
    }

    await updateUserUsecase.execute(updateUserInput)

    expect(userRepository.getByID).toHaveBeenCalledTimes(1)
    expect(userRepository.getByID).toHaveBeenCalledWith('1')
    expect(userRepository.getByUsername).toHaveBeenCalledTimes(1)
    expect(userRepository.getByUsername).toHaveBeenCalledWith('updatedUser01')
    expect(userRepository.update).toHaveBeenCalledTimes(1)
    expect(userRepository.update).toHaveBeenCalledWith(expect.objectContaining({
      _id: '1',
      _passwordHash: 'newPassword',
      _fullName: 'Updated User 01',
      _location: 'Updated location',
      _profileLocked: true,
      _summary: 'Updated summary',
      _username: 'updatedUser01'
    }))
  })

  it('Should update user profileLocked', async () => {
    const updateUserInput: UpdateUserInputDTO = {
      id: '1',
      profileLocked: false
    }

    await updateUserUsecase.execute(updateUserInput)

    expect(userRepository.getByID).toHaveBeenCalledTimes(1)
    expect(userRepository.getByID).toHaveBeenCalledWith('1')
    expect(userRepository.getByUsername).not.toHaveBeenCalled()
    expect(userRepository.update).toHaveBeenCalledTimes(1)
    expect(userRepository.update).toHaveBeenCalledWith(expect.objectContaining({
      _id: '1',
      _profileLocked: false
    }))
  })

  it('Should not update if user not found', async () => {
    const updateUserInput: UpdateUserInputDTO = {
      id: '2', // Wrong ID
      currentPassword: 'correctPassword',
      newPassword: 'newPassword',
      fullName: 'Updated User 01',
      location: 'Updated location',
      profileLocked: true,
      summary: 'Updated summary',
      username: 'updatedUser01'
    }

    await expect(updateUserUsecase.execute(updateUserInput)).rejects.toThrow('User not found')

    expect(userRepository.getByID).toHaveBeenCalledTimes(1)
    expect(userRepository.getByID).toHaveBeenCalledWith('2')
    expect(userRepository.getByUsername).not.toHaveBeenCalled()
    expect(userRepository.update).not.toHaveBeenCalled()
  })

  it('Should not update an user if username is already in use', async () => {
    const updateUserInput: UpdateUserInputDTO = {
      id: '1',
      currentPassword: 'correctPassword',
      newPassword: 'newPassword',
      fullName: 'Updated User 01',
      location: 'Updated location',
      profileLocked: true,
      summary: 'Updated summary',
      username: 'usernameAlreadyExists' // Username already in use
    }

    await expect(updateUserUsecase.execute(updateUserInput)).rejects.toThrow('Username already in use')

    expect(userRepository.getByID).toHaveBeenCalledTimes(1)
    expect(userRepository.getByUsername).toHaveBeenCalledTimes(1)
    expect(userRepository.getByUsername).toHaveBeenCalledWith('usernameAlreadyExists')
    expect(userRepository.update).not.toHaveBeenCalled()
  })

  it('Should not update user password if currentPassword is wrong', async () => {
    const updateUserInput: UpdateUserInputDTO = {
      id: '1',
      currentPassword: 'wrongPassword', // Wrong password
      newPassword: 'newPassword',
      fullName: 'Updated User 01',
      location: 'Updated location',
      profileLocked: true,
      summary: 'Updated summary',
      username: 'updatedUser01'
    }

    await expect(updateUserUsecase.execute(updateUserInput)).rejects.toThrow('Wrong current password')

    expect(userRepository.getByID).toHaveBeenCalledTimes(1)
    expect(userRepository.getByUsername).toHaveBeenCalledTimes(1)
    expect(userRepository.update).not.toHaveBeenCalled()
  })
})
