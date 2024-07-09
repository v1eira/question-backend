import { afterEach, describe, expect, it, vitest } from 'vitest'
import DeleteAnswerController from './delete-answer-controller'
import type DeleteAnswerUsecaseInterface from '../../../../application/answer/usecases/delete-answer/delete-answer-usecase.interface'
import { NotFoundError } from '../../../../domain/error/errors'

const MockUseCase = (): DeleteAnswerUsecaseInterface => {
  return {
    execute: vitest.fn()
  }
}

describe('DeleteAnswerController', () => {
  const usecase = MockUseCase()
  const deleteAnswerController = new DeleteAnswerController(usecase)

  afterEach(() => {
    vitest.clearAllMocks()
  })

  const httpRequest = {
    params: {
      id: 'any_id'
    }
  }

  it('Should delete an answer', async () => {
    const response = await deleteAnswerController.handle(httpRequest)
    expect(usecase.execute).toHaveBeenCalledWith({ id: httpRequest.params.id })
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({})
  })

  it('Should return body with statusCode 404 if answer not found', async () => {
    vitest
      .spyOn(usecase, 'execute')
      .mockImplementationOnce(() => {
        throw new NotFoundError('Answer not found')
      })

    const response = await deleteAnswerController.handle(httpRequest)
    expect(usecase.execute).toHaveBeenCalledWith({ id: httpRequest.params.id })
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(404)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('Answer not found')
  })

  it('Should return body with statusCode 500 if unexpected error occurs', async () => {
    vitest
      .spyOn(usecase, 'execute')
      .mockImplementationOnce(() => {
        throw new Error('Unexpected error')
      })

    const response = await deleteAnswerController.handle(httpRequest)
    expect(usecase.execute).toHaveBeenCalledWith({ id: httpRequest.params.id })
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(500)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('Internal Server Error')
  })
})
