import { afterEach, describe, expect, it, vitest } from 'vitest'
import UserBuilder from '../../../../domain/user/entity/user-data-builder'
import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import UpdateUserUsecase from './update-user-usecase'
import { type UpdateUserInputDTO } from './update-user-dto'

vitest.mock('bcrypt', () => ({
  async compare (pass, hash): Promise<boolean> {
    return pass === 'correctPassword'
  },
  async hash (pass, rounds): Promise<string> {
    return pass
  }
}))

const anUser = new UserBuilder()

const MockRepository = (): UserRepositoryInterface => {
  return {
    create: vitest.fn(),
    update: vitest.fn(),
    findByID: vitest.fn().mockImplementation(id =>
      id === '1'
        ? anUser.withId('1').build()
        : null
    ),
    findByEmail: vitest.fn(),
    findByUsername: vitest.fn().mockImplementation(username =>
      username === 'usernameAlreadyExists'
        ? anUser.withId('randomID').withUsername('usernameAlreadyExists').build()
        : null
    ),
    findAll: vitest.fn(),
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

    expect(userRepository.findByID).toHaveBeenCalledTimes(1)
    expect(userRepository.findByID).toHaveBeenCalledWith('1')
    expect(userRepository.findByUsername).toHaveBeenCalledTimes(1)
    expect(userRepository.findByUsername).toHaveBeenCalledWith('updatedUser01')
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

    expect(userRepository.findByID).toHaveBeenCalledTimes(1)
    expect(userRepository.findByID).toHaveBeenCalledWith('1')
    expect(userRepository.findByUsername).not.toHaveBeenCalled()
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

    expect(userRepository.findByID).toHaveBeenCalledTimes(1)
    expect(userRepository.findByID).toHaveBeenCalledWith('2')
    expect(userRepository.findByUsername).not.toHaveBeenCalled()
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

    expect(userRepository.findByID).toHaveBeenCalledTimes(1)
    expect(userRepository.findByUsername).toHaveBeenCalledTimes(1)
    expect(userRepository.findByUsername).toHaveBeenCalledWith('usernameAlreadyExists')
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

    expect(userRepository.findByID).toHaveBeenCalledTimes(1)
    expect(userRepository.findByUsername).toHaveBeenCalledTimes(1)
    expect(userRepository.update).not.toHaveBeenCalled()
  })
})
