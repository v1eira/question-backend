import { afterEach, describe, expect, it, vitest } from 'vitest'
import type GetUserUsecaseInterface from '../../../../application/user/usecases/get-user/get-user-usecase.interface'
import GetUserController from './get-user-controller'
import { type GetUserOutputDTO } from '../../../../application/user/usecases/get-user/get-user-dto'
import { NotFoundError } from '../../../../domain/error/errors'

const MockUseCase = (): GetUserUsecaseInterface => {
  return {
    execute: vitest.fn()
  }
}

describe('GetUserController', () => {
  const usecase = MockUseCase()
  const getUserController = new GetUserController(usecase)

  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('Should get an user', async () => {
    const httpRequest = {
      params: {
        id: 'any_id'
      }
    }

    const usecaseOutput: GetUserOutputDTO = {
      id: 'any_id',
      fullName: 'any_name',
      username: 'any_username',
      email: 'any_email',
      summary: 'any_summary',
      location: 'any_location',
      profileLocked: false,
      followersCount: 0,
      followingCount: 0,
      createdAt: new Date()
    }

    vitest.spyOn(usecase, 'execute').mockResolvedValueOnce(usecaseOutput)

    const response = await getUserController.handle(httpRequest)

    expect(usecase.execute).toHaveBeenCalledWith(httpRequest.params)
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(usecaseOutput)
  })

  it('Should return body with statusCode 404 if user not found', async () => {
    const httpRequest = {
      params: {
        id: 'any_id'
      }
    }

    vitest.spyOn(usecase, 'execute').mockImplementationOnce(() => { throw new NotFoundError('User not found') })

    const response = await getUserController.handle(httpRequest)

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

    const response = await getUserController.handle(httpRequest)

    expect(usecase.execute).toHaveBeenCalledWith(httpRequest.params)
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(500)
    expect(response.body).toHaveProperty('error')
  })
})
