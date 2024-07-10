import { afterEach, describe, expect, it, vitest } from 'vitest'
import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import FindUserUsecase from './find-user-usecase'
import UserBuilder from '../../../../domain/user/entity/user-data-builder'

const anUser = new UserBuilder()

const UserMockRepository = (): UserRepositoryInterface => {
  return {
    create: vitest.fn(),
    update: vitest.fn(),
    findByEmail: vitest.fn(),
    findByUsername: vitest.fn(),
    findAll: vitest.fn(),
    findByID: vitest.fn().mockImplementation(
      (id: string) => id === 'userID'
        ? anUser.withId(id).build()
        : null
    ),
    delete: vitest.fn()
  }
}

describe('Find User Usecase tests', () => {
  const userRepository = UserMockRepository()
  const findUserUsecase = new FindUserUsecase(userRepository)

  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('Should return an user', async () => {
    const user = await findUserUsecase.execute({ id: 'userID' })
    expect(user).not.toBeNull()
    expect(user).not.toBeUndefined()
    expect(user).toStrictEqual({
      id: 'userID',
      fullName: expect.any(String),
      username: expect.any(String),
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
    await expect(findUserUsecase.execute({ id: '123' })).rejects.toThrow('User not found')

    expect(userRepository.findByID).toHaveBeenCalledTimes(1)
    expect(userRepository.findByID).toHaveBeenCalledWith('123')
  })
})
