import { afterEach, describe, expect, it, vitest } from 'vitest'
import type FindUserUsecaseInterface from '../../../../application/user/usecases/find-user/find-user-usecase.interface'
import FindUserController from './find-user-controller'
import { type FindUserOutputDTO } from '../../../../application/user/usecases/find-user/find-user-dto'
import { NotFoundError } from '../../../../domain/error/errors'

const MockUseCase = (): FindUserUsecaseInterface => {
  return {
    execute: vitest.fn()
  }
}

describe('FindUserController', () => {
  const usecase = MockUseCase()
  const findUserController = new FindUserController(usecase)

  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('Should find an user', async () => {
    const httpRequest = {
      params: {
        id: 'any_id'
      }
    }

    const usecaseOutput: FindUserOutputDTO = {
      id: 'any_id',
      fullName: 'any_name',
      username: 'any_username',
      email: 'any_email',
      summary: 'any_summary',
      location: 'any_location',
      profileLocked: false,
      followersCount: 0,
      followingCount: 0,
      likedAnswersCount: 0,
      createdAt: new Date()
    }

    vitest.spyOn(usecase, 'execute').mockResolvedValueOnce(usecaseOutput)

    const response = await findUserController.handle(httpRequest)

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

    const response = await findUserController.handle(httpRequest)

    expect(usecase.execute).toHaveBeenCalledWith(httpRequest.params)
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(404)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('User not found')
  })
})
