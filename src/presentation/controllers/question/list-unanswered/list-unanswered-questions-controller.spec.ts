import { vitest, describe, afterEach, it, expect } from 'vitest'
import type ListUnansweredQuestionsQueryHandlerInterface from '../../../../application/question/query-handlers/list-unanswered-questions/list-unanswered-questions.interface'
import ListUnansweredQuestionsController from './list-unanswered-questions-controller'
import { NotFoundError } from '../../../../domain/error/errors'

const MockQueryHandler = (): ListUnansweredQuestionsQueryHandlerInterface => {
  return {
    execute: vitest.fn()
  }
}

describe('ListUnansweredQuestionsController', () => {
  const queryHandler = MockQueryHandler()
  const listUnansweredQuestionsController = new ListUnansweredQuestionsController(queryHandler)

  afterEach(() => {
    vitest.clearAllMocks()
  })

  const httpRequest = {
    params: {
      userId: 'any_id'
    }
  }

  const output = {
    questions: [
      {
        id: 'any_id',
        content: 'any_content',
        createdAt: new Date('2022-01-01'),
        asker: {
          id: 'any_id',
          fullName: 'any_name',
          username: 'any_username',
          email: 'any_email'
        }
      }
    ]
  }

  it('Should return a list of unanswered questions', async () => {
    vitest
      .spyOn(queryHandler, 'execute')
      .mockImplementationOnce(async () => { return await Promise.resolve(output) })

    const response = await listUnansweredQuestionsController.handle(httpRequest)
    expect(queryHandler.execute).toHaveBeenCalledWith({ recipientId: httpRequest.params.userId })
    expect(queryHandler.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(output)
  })

  it('Should throw an error if user not found', async () => {
    vitest
      .spyOn(queryHandler, 'execute')
      .mockImplementationOnce(async () => { throw new NotFoundError('User not found') })

    const response = await listUnansweredQuestionsController.handle(httpRequest)
    expect(queryHandler.execute).toHaveBeenCalledWith({ recipientId: httpRequest.params.userId })
    expect(queryHandler.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(404)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('User not found')
  })

  it('Should throw an error if unexpected error occurs', async () => {
    vitest
      .spyOn(queryHandler, 'execute')
      .mockImplementationOnce(async () => { throw new Error('Unexpected error') })

    const response = await listUnansweredQuestionsController.handle(httpRequest)
    expect(queryHandler.execute).toHaveBeenCalledWith({ recipientId: httpRequest.params.userId })
    expect(queryHandler.execute).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(500)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('Internal Server Error')
  })
})
