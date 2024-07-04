import { afterEach, describe, expect, it, vitest } from 'vitest'
import UpdateUserController from './update-user-controller'
import type UpdateUserUsecaseInterface from '../../../../application/user/usecases/update-user/update-user-usecase.interface'
import { ConflictError, InvalidRequestError, NotFoundError } from '../../../../domain/error/errors'

const MockUseCase = (): UpdateUserUsecaseInterface => {
  return {
    execute: vitest.fn()
  }
}

describe('UpdateUserController', () => {
  const usecase = MockUseCase()
  const updateUserController = new UpdateUserController(usecase)

  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('Should update an user', async () => {
    const httpRequest = {
      body: {
        fullName: 'any_name',
        username: 'any_username',
        currentPassword: 'any_password',
        newPassword: 'any_password',
        summary: 'any_summary',
        location: 'any_location',
        profileLocked: true
      },
      params: {
        id: 'any_id'
      }
    }
    const response = await updateUserController.handle(httpRequest)
    expect(usecase.execute).toHaveBeenCalledWith({ ...httpRequest.body, ...httpRequest.params })
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({})
  })

  it('Should return body with statusCode 400 if current password is wrong', async () => {
    const httpRequest = {
      body: {
        fullName: 'any_name',
        username: 'any_username',
        currentPassword: 'wrong_password',
        newPassword: 'any_password',
        summary: 'any_summary',
        location: 'any_location',
        profileLocked: true
      },
      params: {
        id: 'any_id'
      }
    }

    vitest
      .spyOn(usecase, 'execute')
      .mockImplementationOnce(() => {
        throw new InvalidRequestError('Wrong current password')
      })

    const response = await updateUserController.handle(httpRequest)
    expect(usecase.execute).toHaveBeenCalledWith({ ...httpRequest.body, ...httpRequest.params })
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('error')
  })

  it('Should return body with statusCode 404 if user not found', async () => {
    const httpRequest = {
      body: {
        fullName: 'any_name',
        username: 'any_username',
        currentPassword: 'any_password',
        newPassword: 'any_password',
        summary: 'any_summary',
        location: 'any_location',
        profileLocked: true
      },
      params: {
        id: 'any_id'
      }
    }

    vitest
      .spyOn(usecase, 'execute')
      .mockImplementationOnce(() => {
        throw new NotFoundError('User not found')
      })

    const response = await updateUserController.handle(httpRequest)
    expect(usecase.execute).toHaveBeenCalledWith({ ...httpRequest.body, ...httpRequest.params })
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(404)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('User not found')
  })

  it('Should return body with statusCode 409 if username is already in use', async () => {
    const httpRequest = {
      body: {
        fullName: 'any_name',
        username: 'any_username',
        currentPassword: 'any_password',
        newPassword: 'any_password',
        summary: 'any_summary',
        location: 'any_location',
        profileLocked: true
      },
      params: {
        id: 'any_id'
      }
    }

    vitest
      .spyOn(usecase, 'execute')
      .mockImplementationOnce(() => {
        throw new ConflictError('Username already in use')
      })

    const response = await updateUserController.handle(httpRequest)
    expect(usecase.execute).toHaveBeenCalledWith({ ...httpRequest.body, ...httpRequest.params })
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(409)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('Username already in use')
  })

  it('Should return body with statusCode 500 if unexpected error occurs', async () => {
    const httpRequest = {
      body: {
        fullName: 'any_name',
        username: 'any_username',
        currentPassword: 'any_password',
        newPassword: 'any_password',
        summary: 'any_summary',
        location: 'any_location',
        profileLocked: true
      },
      params: {
        id: 'any_id'
      }
    }

    vitest
      .spyOn(usecase, 'execute')
      .mockImplementationOnce(() => {
        throw new Error('Unexpected error')
      })

    const response = await updateUserController.handle(httpRequest)
    expect(usecase.execute).toHaveBeenCalledWith({ ...httpRequest.body, ...httpRequest.params })
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(500)
    expect(response.body).toHaveProperty('error')
  })
})
