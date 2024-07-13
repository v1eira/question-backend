import { afterEach, describe, expect, it, vitest } from 'vitest'
import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import GetUserUsecase from './get-user-usecase'
import UserBuilder from '../../../../domain/user/entity/user-data-builder'

const anUser = new UserBuilder()

const UserMockRepository = (): UserRepositoryInterface => {
  return {
    create: vitest.fn(),
    update: vitest.fn(),
    getByEmail: vitest.fn(),
    getByUsername: vitest.fn(),
    getAll: vitest.fn(),
    getByID: vitest.fn().mockImplementation(
      (id: string) => id === 'userID'
        ? anUser.withId(id).build()
        : null
    ),
    delete: vitest.fn()
  }
}

describe('Get User Usecase tests', () => {
  const userRepository = UserMockRepository()
  const getUserUsecase = new GetUserUsecase(userRepository)

  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('Should return an user', async () => {
    const user = await getUserUsecase.execute({ id: 'userID' })
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
    await expect(getUserUsecase.execute({ id: '123' })).rejects.toThrow('User not found')

    expect(userRepository.getByID).toHaveBeenCalledTimes(1)
    expect(userRepository.getByID).toHaveBeenCalledWith('123')
  })
})
