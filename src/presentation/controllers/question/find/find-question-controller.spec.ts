import { afterEach, describe, expect, it, vitest } from 'vitest'
import FindQuestionController from './find-question-controller'
import { NotFoundError } from '../../../../domain/error/errors'
import type FindAnsweredQuestionUseCaseInterface from '../../../../application/question/usecases/find-answered-question/find-answered-question.interface'

const MockUseCase = (): FindAnsweredQuestionUseCaseInterface => {
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

  const output = {
    question: {
      id: 'any_id',
      content: expect.any(String),
      createdAt: expect.any(Date),
      asker: {
        id: expect.any(String),
        fullName: expect.any(String),
        username: expect.any(String),
        email: expect.any(String)
      }
    },
    answer: {
      id: expect.any(String),
      content: expect.any(String),
      likes: expect.any(Number),
      createdAt: expect.any(Date),
      responder: {
        id: expect.any(String),
        fullName: expect.any(String),
        username: expect.any(String),
        email: expect.any(String)
      }
    }
  }

  it('Should find a question', async () => {
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

  it('Should return body with statusCode 404 if Responder not found', async () => {
    vitest
      .spyOn(usecase, 'execute')
      .mockImplementationOnce(() => {
        throw new NotFoundError('Responder not found')
      })

    const response = await findQuestionController.handle(httpRequest)
    expect(usecase.execute).toHaveBeenCalledWith({ id: httpRequest.params.id })
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(404)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('Responder not found')
  })

  it('Should return body with statusCode 404 if Answer not found', async () => {
    vitest
      .spyOn(usecase, 'execute')
      .mockImplementationOnce(() => {
        throw new NotFoundError('Answer not found')
      })

    const response = await findQuestionController.handle(httpRequest)
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

    const response = await findQuestionController.handle(httpRequest)
    expect(usecase.execute).toHaveBeenCalledWith({ id: httpRequest.params.id })
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(500)
    expect(response.body).toHaveProperty('error')
  })
})
