import { afterEach, describe, expect, it, vitest } from 'vitest'
import FindQuestionController from './find-question-controller'
import type FindQuestionUsecaseInterface from '../../../../application/question/usecases/find-question/find-question-usecase.interface'
import { NotFoundError } from '../../../../domain/error/errors'

const MockUseCase = (): FindQuestionUsecaseInterface => {
  return {
    execute: vitest.fn()
  }
}

describe('FindQuestionController', () => {
  const usecase = MockUseCase()
  const findQuestionController = new FindQuestionController(usecase)

  afterEach(() => {
    vitest.clearAllMocks()
  })

  const httpRequest = {
    params: {
      id: 'any_id'
    }
  }

  it('Should find a question', async () => {
    const output = {
      id: 'any_id',
      content: 'any_content',
      asker: {
        id: 'any_id',
        fullName: 'any_full_name',
        username: 'any_username',
        email: 'any_email'
      },
      recipient: {
        id: 'any_id',
        fullName: 'any_full_name',
        username: 'any_username',
        email: 'any_email'
      },
      createdAt: new Date('2022-01-01')
    }
    vitest
      .spyOn(usecase, 'execute')
      .mockImplementationOnce(async () => { return await Promise.resolve(output) })

    const response = await findQuestionController.handle(httpRequest)
    expect(usecase.execute).toHaveBeenCalledWith({ id: httpRequest.params.id })
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(output)
  })

  it('Should return body with statusCode 404 if Question not found', async () => {
    vitest
      .spyOn(usecase, 'execute')
      .mockImplementationOnce(() => {
        throw new NotFoundError('Question not found')
      })

    const response = await findQuestionController.handle(httpRequest)
    expect(usecase.execute).toHaveBeenCalledWith({ id: httpRequest.params.id })
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(404)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('Question not found')
  })

  it('Should return body with statusCode 404 if Asker not found', async () => {
    vitest
      .spyOn(usecase, 'execute')
      .mockImplementationOnce(() => {
        throw new NotFoundError('Asker not found')
      })

    const response = await findQuestionController.handle(httpRequest)
    expect(usecase.execute).toHaveBeenCalledWith({ id: httpRequest.params.id })
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(404)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('Asker not found')
  })

  it('Should return body with statusCode 404 if Recipient not found', async () => {
    vitest
      .spyOn(usecase, 'execute')
      .mockImplementationOnce(() => {
        throw new NotFoundError('Recipient not found')
      })

    const response = await findQuestionController.handle(httpRequest)
    expect(usecase.execute).toHaveBeenCalledWith({ id: httpRequest.params.id })
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(404)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('Recipient not found')
  })

  it('Should return body with statusCode 500 if unexpected error occurs', async () => {
    vitest
      .spyOn(usecase, 'execute')
      .mockImplementationOnce(() => {
        throw new Error('Unexpected error')
      })

    const response = await findQuestionController.handle(httpRequest)
    expect(usecase.execute).toHaveBeenCalledWith({ id: httpRequest.params.id })
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(500)
    expect(response.body).toHaveProperty('error')
  })
})
