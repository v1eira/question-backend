import { describe, expect, it, vitest } from 'vitest'
import UserBuilder from '../../../../domain/user/entity/user-data-builder'
import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import { type CreateUserInputDTO } from './create-user-dto'
import CreateUserUsecase from './create-user-usecase'

const anUser = new UserBuilder()

const MockRepository = (): UserRepositoryInterface => {
  return {
    create: vitest.fn(),
    update: vitest.fn(),
    findByID: vitest.fn(),
    findByEmail: vitest.fn().mockImplementation(email =>
      email === 'emailAlreadyExists@email.com'
        ? anUser.withEmail('emailAlreadyExists@email.com').build()
        : null
    ),
    findByUsername: vitest.fn().mockImplementation(username =>
      username === 'usernameAlreadyExists'
        ? anUser.withUsername('usernameAlreadyExists').build()
        : null
    ),
    findAll: vitest.fn(),
    delete: vitest.fn()
  }
}

describe('Create User Usecase tests', () => {
  const userRepository = MockRepository()
  const createUserUsecase = new CreateUserUsecase(userRepository)

  it('Should create a new user', async () => {
    const createUserInput: CreateUserInputDTO = {
      fullName: 'New User',
      username: 'newuser',
      email: 'newuser@email.com',
      password: '123456',
      summary: 'Hello world!',
      location: 'NY, USA'
    }

    await createUserUsecase.execute(createUserInput)
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1)
    expect(userRepository.findByEmail).toHaveBeenCalledWith('newuser@email.com')
    expect(userRepository.findByUsername).toHaveBeenCalledTimes(1)
    expect(userRepository.findByUsername).toHaveBeenCalledWith('newuser')
    expect(userRepository.create).toHaveBeenCalledTimes(1)
    expect(userRepository.create).toHaveBeenCalledWith({
      _id: expect.any(String),
      _fullName: 'New User',
      _username: 'newuser',
      _email: 'newuser@email.com',
      _passwordHash: expect.any(String),
      _summary: 'Hello world!',
      _location: 'NY, USA',
      _profileLocked: false,
      _followersCount: 0,
      _followingCount: 0,
      _likedAnswersCount: 0,
      _createdAt: expect.any(Date)
    })
  })

  it('Should NOT create new user because USERNAME is already in use', async () => {
    const createUserInput: CreateUserInputDTO = {
      fullName: 'New User 2',
      username: 'usernameAlreadyExists',
      email: 'newuser2@email.com',
      password: '123456',
      summary: 'Hello world!',
      location: 'NY, USA'
    }

    await expect(createUserUsecase.execute(createUserInput)).rejects.toThrow('Username already in use')
  })

  it('Should NOT create new user because EMAIL is already in use', async () => {
    const createUserInput: CreateUserInputDTO = {
      fullName: 'New User 2',
      username: 'newuser2',
      email: 'emailAlreadyExists@email.com',
      password: '123456',
      summary: 'Hello world!',
      location: 'NY, USA'
    }

    await expect(createUserUsecase.execute(createUserInput)).rejects.toThrow('Email already in use')
  })
})
