import { afterEach, describe, expect, it, vitest } from 'vitest'
import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import UserBuilder from '../../../../domain/user/entity/user-data-builder'
import FindUserByUsernameUsecase from './find-user-by-username-usecase'

const anUser = new UserBuilder()

const UserMockRepository = (): UserRepositoryInterface => {
  return {
    create: vitest.fn(),
    update: vitest.fn(),
    findByEmail: vitest.fn(),
    findByUsername: vitest.fn().mockImplementation(
      (username: string) => username === 'username-01'
        ? anUser.withUsername(username).build()
        : null
    ),
    findAll: vitest.fn(),
    findByID: vitest.fn(),
    delete: vitest.fn()
  }
}

describe('Find User By Username Usecase tests', () => {
  const userRepository = UserMockRepository()
  const findUserByUsernameUsecase = new FindUserByUsernameUsecase(userRepository)

  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('Should return an user', async () => {
    const user = await findUserByUsernameUsecase.execute({ username: 'username-01' })
    expect(user).not.toBeNull()
    expect(user).not.toBeUndefined()
    expect(user).toStrictEqual({
      id: expect.any(String),
      fullName: expect.any(String),
      username: 'username-01',
      email: expect.any(String),
      summary: expect.any(String),
      location: expect.any(String),
      profileLocked: expect.any(Boolean),
      followersCount: expect.any(Number),
      followingCount: expect.any(Number),
      createdAt: expect.any(Date)
    })
  })

  it('Should throw an error if user not found', async () => {
    await expect(findUserByUsernameUsecase.execute({ username: 'non-existent-username' })).rejects.toThrow('User not found')

    expect(userRepository.findByUsername).toHaveBeenCalledTimes(1)
    expect(userRepository.findByUsername).toHaveBeenCalledWith('non-existent-username')
  })
})
