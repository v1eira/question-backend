import { afterEach, describe, expect, it, vitest } from 'vitest'
import CreateUserController from './create-user-controller'
import type CreateUserUsecaseInterface from '../../../../application/user/usecases/create-user/create-user-usecase.interface'
import { ConflictError } from '../../../../domain/error/errors'

const MockUseCase = (): CreateUserUsecaseInterface => {
  return {
    execute: vitest.fn()
  }
}

describe('CreateUserController', () => {
  const usecase = MockUseCase()
  const createUserController = new CreateUserController(usecase)

  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('Should create an user', async () => {
    const httpRequest = {
      body: {
        fullName: 'any_name',
        username: 'any_username',
        email: 'any_email',
        password: 'any_password',
        summary: 'any_summary',
        location: 'any_location'
      }
    }
    const response = await createUserController.handle(httpRequest)
    expect(usecase.execute).toHaveBeenCalledWith(httpRequest.body)
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({})
  })

  it('Should return body with statusCode 409 if username is already in use', async () => {
    const httpRequest = {
      body: {
        fullName: 'any_name',
        username: 'any_username',
        email: 'any_email',
        password: 'any_password',
        summary: 'any_summary',
        location: 'any_location'
      }
    }

    vitest
      .spyOn(usecase, 'execute')
      .mockImplementationOnce(() => {
        throw new ConflictError('Username already in use')
      })

    const response = await createUserController.handle(httpRequest)
    expect(usecase.execute).toHaveBeenCalledWith(httpRequest.body)
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(409)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('Username already in use')
  })

  it('Should return body with statusCode 409 if email is already in use', async () => {
    const httpRequest = {
      body: {
        fullName: 'any_name',
        username: 'any_username',
        email: 'any_email',
        password: 'any_password',
        summary: 'any_summary',
        location: 'any_location'
      }
    }

    vitest
      .spyOn(usecase, 'execute')
      .mockImplementationOnce(() => {
        throw new ConflictError('Email already in use')
      })

    const response = await createUserController.handle(httpRequest)
    expect(usecase.execute).toHaveBeenCalledWith(httpRequest.body)
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(409)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('Email already in use')
  })

  it('Should return body with statusCode 500 if unexpected error occurs', async () => {
    const httpRequest = {
      body: {
        fullName: 'any_name',
        username: 'any_username',
        email: 'any_email',
        password: 'any_password',
        summary: 'any_summary',
        location: 'any_location'
      }
    }

    vitest
      .spyOn(usecase, 'execute')
      .mockImplementationOnce(() => {
        throw new Error('Unexpected error')
      })

    const response = await createUserController.handle(httpRequest)
    expect(usecase.execute).toHaveBeenCalledWith(httpRequest.body)
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(500)
    expect(response.body).toHaveProperty('error')
  })
})
