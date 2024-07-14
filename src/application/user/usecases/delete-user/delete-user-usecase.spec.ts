import UserBuilder from '../../../../domain/user/entity/user-data-builder'
import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import { afterEach, describe, expect, it, vitest } from 'vitest'
import DeleteUserUsecase from './delete-user-usecase'

const MockRepository = (): UserRepositoryInterface => {
  return {
    create: vitest.fn(),
    update: vitest.fn(),
    getByEmail: vitest.fn(),
    getByUsername: vitest.fn(),
    getAll: vitest.fn(),
    getByID: vitest.fn().mockImplementation(
      (id: string) => id === 'deleteUserID'
        ? new UserBuilder().withId(id).build()
        : null
    ),
    delete: vitest.fn()
  }
}

describe('DeleteUserUsecase', () => {
  const userRepository = MockRepository()
  const deleteUserUsecase = new DeleteUserUsecase(userRepository)
  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('Should delete an user', async () => {
    const deleteUserInput = { id: 'deleteUserID' }

    await deleteUserUsecase.execute(deleteUserInput)

    expect(userRepository.getByID).toHaveBeenCalledTimes(1)
    expect(userRepository.getByID).toHaveBeenCalledWith('deleteUserID')
    expect(userRepository.delete).toHaveBeenCalledTimes(1)
    expect(userRepository.delete).toHaveBeenCalledWith('deleteUserID')
  })

  it('Should not delete an user when user not found', async () => {
    const deleteUserInput = { id: '123' }

    await expect(deleteUserUsecase.execute(deleteUserInput)).rejects.toThrow('User not found')

    expect(userRepository.getByID).toHaveBeenCalledTimes(1)
    expect(userRepository.getByID).toHaveBeenCalledWith('123')
    expect(userRepository.delete).not.toHaveBeenCalled()
  })
})
