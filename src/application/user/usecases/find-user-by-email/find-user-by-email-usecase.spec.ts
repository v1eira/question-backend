import { afterEach, describe, expect, it, vitest } from 'vitest'
import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import UserBuilder from '../../../../domain/user/entity/user-data-builder'
import FindUserByEmailUsecase from './find-user-by-email-usecase'

const anUser = new UserBuilder()

const UserMockRepository = (): UserRepositoryInterface => {
  return {
    create: vitest.fn(),
    update: vitest.fn(),
    findByEmail: vitest.fn().mockImplementation(
      (email: string) => email === 'user@email.com'
        ? anUser.withEmail(email).build()
        : null
    ),
    findByUsername: vitest.fn(),
    findAll: vitest.fn(),
    findByID: vitest.fn(),
    delete: vitest.fn()
  }
}

describe('Find User By Email Usecase tests', () => {
  const userRepository = UserMockRepository()
  const findUserByEmailUsecase = new FindUserByEmailUsecase(userRepository)

  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('Should return an user', async () => {
    const user = await findUserByEmailUsecase.execute({ email: 'user@email.com' })
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
    await expect(findUserByEmailUsecase.execute({ email: 'non-existent-user@email.com' })).rejects.toThrow('User not found')

    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1)
    expect(userRepository.findByEmail).toHaveBeenCalledWith('non-existent-user@email.com')
  })
})
