import { afterEach, describe, expect, it, vitest } from 'vitest'
import CreateUserController from './create-user-controller'
import type CreateUserUsecaseInterface from '../../../../application/user/usecases/create-user/create-user-usecase.interface'

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

  it('Should return body with error if usecase throws', async () => {
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
        throw new Error()
      })

    const response = await createUserController.handle(httpRequest)
    expect(usecase.execute).toHaveBeenCalledWith(httpRequest.body)
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).not.toBe(201)
    expect(response.body).toHaveProperty('error')
  })
})
