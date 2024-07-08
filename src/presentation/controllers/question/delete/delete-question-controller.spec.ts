import { afterEach, describe, expect, it, vitest } from 'vitest'
import DeleteQuestionController from './delete-question-controller'
import type DeleteQuestionUsecaseInterface from '../../../../application/question/usecases/delete-question/delete-question-usecase.interface'
import { NotFoundError } from '../../../../domain/error/errors'

const MockUseCase = (): DeleteQuestionUsecaseInterface => {
  return {
    execute: vitest.fn()
  }
}

describe('DeleteQuestionController', () => {
  const usecase = MockUseCase()
  const deleteQuestionController = new DeleteQuestionController(usecase)

  afterEach(() => {
    vitest.clearAllMocks()
  })

  const httpRequest = {
    params: {
      id: 'any_id'
    }
  }

  it('Should delete a question', async () => {
    const response = await deleteQuestionController.handle(httpRequest)
    expect(usecase.execute).toHaveBeenCalledWith({ id: httpRequest.params.id })
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({})
  })

  it('Should return body with statusCode 404 if Question not found', async () => {
    vitest
      .spyOn(usecase, 'execute')
      .mockImplementationOnce(() => {
        throw new NotFoundError('Question not found')
      })

    const response = await deleteQuestionController.handle(httpRequest)
    expect(usecase.execute).toHaveBeenCalledWith({ id: httpRequest.params.id })
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(404)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('Question not found')
  })

  it('Should return body with statusCode 500 if unexpected error occurs', async () => {
    vitest
      .spyOn(usecase, 'execute')
      .mockImplementationOnce(() => {
        throw new Error('Unexpected error')
      })

    const response = await deleteQuestionController.handle(httpRequest)
    expect(usecase.execute).toHaveBeenCalledWith({ id: httpRequest.params.id })
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(500)
    expect(response.body).toHaveProperty('error')
  })
})
