import { afterEach, describe, expect, it, vitest } from 'vitest'
import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import UserBuilder from '../../../../domain/user/entity/user-data-builder'
import GetUserByUsernameUsecase from './get-user-by-username-usecase'

const anUser = new UserBuilder()

const UserMockRepository = (): UserRepositoryInterface => {
  return {
    create: vitest.fn(),
    update: vitest.fn(),
    getByEmail: vitest.fn(),
    getByUsername: vitest.fn().mockImplementation(
      (username: string) => username === 'username-01'
        ? anUser.withUsername(username).build()
        : null
    ),
    getAll: vitest.fn(),
    getByID: vitest.fn(),
    delete: vitest.fn()
  }
}

describe('Get User By Username Usecase tests', () => {
  const userRepository = UserMockRepository()
  const getUserByUsernameUsecase = new GetUserByUsernameUsecase(userRepository)

  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('Should return an user', async () => {
    const user = await getUserByUsernameUsecase.execute({ username: 'username-01' })
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
    await expect(getUserByUsernameUsecase.execute({ username: 'non-existent-username' })).rejects.toThrow('User not found')

    expect(userRepository.getByUsername).toHaveBeenCalledTimes(1)
    expect(userRepository.getByUsername).toHaveBeenCalledWith('non-existent-username')
  })
})
