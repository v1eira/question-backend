import { afterEach, describe, expect, it, vitest } from 'vitest'
import CreateQuestionController from './create-question-controller'
import type CreateQuestionUsecaseInterface from '../../../../application/question/usecases/create-question/create-question-usecase.interface'
import { InvalidRequestError, NotFoundError } from '../../../../domain/error/errors'

const MockUseCase = (): CreateQuestionUsecaseInterface => {
  return {
    execute: vitest.fn()
  }
}

describe('CreateQuestionController', () => {
  const usecase = MockUseCase()
  const createQuestionController = new CreateQuestionController(usecase)

  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('Should create an question', async () => {
    const httpRequest = {
      body: {
        content: 'any_content',
        from: 'any_fromId',
        to: 'any_toId'
      }
    }
    const response = await createQuestionController.handle(httpRequest)
    expect(usecase.execute).toHaveBeenCalledWith({
      content: httpRequest.body.content,
      fromId: httpRequest.body.from,
      toId: httpRequest.body.to
    })
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({})
  })

  it('Should return body with statusCode 400 if FROM and TO are equal', async () => {
    const httpRequest = {
      body: {
        content: 'any_content',
        from: 'any_Id',
        to: 'any_Id'
      }
    }

    vitest
      .spyOn(usecase, 'execute')
      .mockImplementationOnce(() => {
        throw new InvalidRequestError('Source and target users should be different')
      })

    const response = await createQuestionController.handle(httpRequest)
    expect(usecase.execute).toHaveBeenCalledWith({
      content: httpRequest.body.content,
      fromId: httpRequest.body.from,
      toId: httpRequest.body.to
    })
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('Source and target users should be different')
  })

  it('Should return body with statusCode 404 if FROM or TO are not found', async () => {
    const httpRequest = {
      body: {
        content: 'any_content',
        from: 'any_fromId',
        to: 'any_toId'
      }
    }

    // FROM
    vitest
      .spyOn(usecase, 'execute')
      .mockImplementationOnce(() => {
        throw new NotFoundError('Source user not found')
      })

    let response = await createQuestionController.handle(httpRequest)
    expect(usecase.execute).toHaveBeenCalledWith({
      content: httpRequest.body.content,
      fromId: httpRequest.body.from,
      toId: httpRequest.body.to
    })
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(404)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('Source user not found')

    // TO
    vitest
      .spyOn(usecase, 'execute')
      .mockImplementationOnce(() => {
        throw new NotFoundError('Target user not found')
      })

    response = await createQuestionController.handle(httpRequest)
    expect(usecase.execute).toHaveBeenCalledWith({
      content: httpRequest.body.content,
      fromId: httpRequest.body.from,
      toId: httpRequest.body.to
    })
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(404)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('Target user not found')
  })

  it('Should return body with statusCode 500 if unexpected error occurs', async () => {
    const httpRequest = {
      body: {
        content: 'any_content',
        from: 'any_fromId',
        to: 'any_toId'
      }
    }

    vitest
      .spyOn(usecase, 'execute')
      .mockImplementationOnce(() => {
        throw new Error('Unexpected error')
      })

    const response = await createQuestionController.handle(httpRequest)
    expect(usecase.execute).toHaveBeenCalledWith({
      content: httpRequest.body.content,
      fromId: httpRequest.body.from,
      toId: httpRequest.body.to
    })
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(500)
    expect(response.body).toHaveProperty('error')
  })
})
