import { afterEach, describe, expect, it, vitest } from 'vitest'
import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import UserBuilder from '../../../../domain/user/entity/user-data-builder'
import GetUserByEmailUsecase from './get-user-by-email-usecase'

const anUser = new UserBuilder()

const UserMockRepository = (): UserRepositoryInterface => {
  return {
    create: vitest.fn(),
    update: vitest.fn(),
    getByEmail: vitest.fn().mockImplementation(
      (email: string) => email === 'user@email.com'
        ? anUser.withEmail(email).build()
        : null
    ),
    getByUsername: vitest.fn(),
    getAll: vitest.fn(),
    getByID: vitest.fn(),
    delete: vitest.fn()
  }
}

describe('Get User By Email Usecase tests', () => {
  const userRepository = UserMockRepository()
  const getUserByEmailUsecase = new GetUserByEmailUsecase(userRepository)

  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('Should return an user', async () => {
    const user = await getUserByEmailUsecase.execute({ email: 'user@email.com' })
    expect(user).not.toBeNull()
    expect(user).not.toBeUndefined()
    expect(user).toStrictEqual({
      id: expect.any(String),
      fullName: expect.any(String),
      username: expect.any(String),
      email: 'user@email.com',
      summary: expect.any(String),
      location: expect.any(String),
      profileLocked: expect.any(Boolean),
      followersCount: expect.any(Number),
      followingCount: expect.any(Number),
      createdAt: expect.any(Date)
    })
  })

  it('Should throw an error if user not found', async () => {
    await expect(getUserByEmailUsecase.execute({ email: 'non-existent-user@email.com' })).rejects.toThrow('User not found')

    expect(userRepository.getByEmail).toHaveBeenCalledTimes(1)
    expect(userRepository.getByEmail).toHaveBeenCalledWith('non-existent-user@email.com')
  })
})
