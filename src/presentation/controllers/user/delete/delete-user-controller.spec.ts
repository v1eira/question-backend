import { afterEach, describe, expect, it, vitest } from 'vitest'
import type DeleteUserUsecaseInterface from '../../../../application/user/usecases/delete-user/delete-user-usecase.interface'
import DeleteUserController from './delete-user-controller'
import { NotFoundError } from '../../../../domain/error/errors'

const MockUseCase = (): DeleteUserUsecaseInterface => {
  return {
    execute: vitest.fn()
  }
}

describe('DeleteUserController', () => {
  const usecase = MockUseCase()
  const deleteUserController = new DeleteUserController(usecase)

  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('Should delete an user', async () => {
    const httpRequest = {
      params: {
        id: 'any_id'
      }
    }

    const response = await deleteUserController.handle(httpRequest)

    expect(usecase.execute).toHaveBeenCalledWith(httpRequest.params)
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({})
  })

  it('Should return body with statusCode 404 if user not found', async () => {
    const httpRequest = {
      params: {
        id: 'any_id'
      }
    }

    vitest.spyOn(usecase, 'execute').mockImplementationOnce(() => { throw new NotFoundError('User not found') })

    const response = await deleteUserController.handle(httpRequest)

    expect(usecase.execute).toHaveBeenCalledWith(httpRequest.params)
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(404)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('User not found')
  })

  it('Should return body with statusCode 500 if unexpected error occurs', async () => {
    const httpRequest = {
      params: {
        id: 'any_id'
      }
    }

    vitest.spyOn(usecase, 'execute').mockImplementationOnce(() => { throw new Error('Unexpected error') })

    const response = await deleteUserController.handle(httpRequest)

    expect(usecase.execute).toHaveBeenCalledWith(httpRequest.params)
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(500)
    expect(response.body).toHaveProperty('error')
  })
})
