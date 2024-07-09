import { vitest, describe, afterEach, it, expect } from 'vitest'
import type CreateAnswerUsecaseInterface from '../../../../application/answer/usecases/create-answer/create-answer-usecase.interface'
import { ConflictError, NotFoundError } from '../../../../domain/error/errors'
import CreateAnswerController from './create-answer-controller'

const MockUseCase = (): CreateAnswerUsecaseInterface => {
  return {
    execute: vitest.fn()
  }
}

describe('CreateAnswerController', () => {
  const usecase = MockUseCase()
  const createAnswerController = new CreateAnswerController(usecase)

  afterEach(() => {
    vitest.clearAllMocks()
  })

  const httpRequest = {
    body: {
      questionId: 'any_id',
      responderId: 'any_id',
      content: 'any_content'
    }
  }

  it('Should create an answer', async () => {
    const response = await createAnswerController.handle(httpRequest)
    expect(usecase.execute).toHaveBeenCalledWith(httpRequest.body)
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({})
  })

  it('Should return body with statusCode 404 if question not found', async () => {
    vitest
      .spyOn(usecase, 'execute')
      .mockImplementationOnce(() => {
        throw new NotFoundError('Question not found')
      })

    const response = await createAnswerController.handle(httpRequest)
    expect(usecase.execute).toHaveBeenCalledWith(httpRequest.body)
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(404)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('Question not found')
  })

  it('Should return body with statusCode 404 if responder not found', async () => {
    vitest
      .spyOn(usecase, 'execute')
      .mockImplementationOnce(() => {
        throw new NotFoundError('Responder not found')
      })

    const response = await createAnswerController.handle(httpRequest)
    expect(usecase.execute).toHaveBeenCalledWith(httpRequest.body)
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(404)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('Responder not found')
  })

  it('Should return body with statusCode 409 if responder is not the recipient of the question', async () => {
    vitest
      .spyOn(usecase, 'execute')
      .mockImplementationOnce(() => {
        throw new ConflictError('Responder is not the recipient of the question')
      })

    const response = await createAnswerController.handle(httpRequest)
    expect(usecase.execute).toHaveBeenCalledWith(httpRequest.body)
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(409)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('Responder is not the recipient of the question')
  })

  it('Should return body with statusCode 500 if unexpected error occurs', async () => {
    vitest
      .spyOn(usecase, 'execute')
      .mockImplementationOnce(() => {
        throw new Error('Unexpected error')
      })

    const response = await createAnswerController.handle(httpRequest)
    expect(usecase.execute).toHaveBeenCalledWith(httpRequest.body)
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(500)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('Internal Server Error')
  })
})
