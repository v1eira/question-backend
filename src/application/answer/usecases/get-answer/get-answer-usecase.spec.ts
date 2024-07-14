import { afterEach, describe, expect, it, vitest } from 'vitest'
import GetAnswerUseCase from './get-answer-usecase'
import type AnswerRepositoryInterface from '../../../../domain/answer/repository/answer-repository.interface'

const AnswerMockRepository = (): AnswerRepositoryInterface => {
  return {
    create: vitest.fn(),
    getByID: vitest.fn().mockImplementation(
      (id: string) => id === 'answerId'
        ? {
            id: 'answerId',
            content: 'this is an answer',
            questionId: 'questionId',
            responderId: 'responderId',
            likes: 0,
            createdAt: new Date()
          }
        : null
    ),
    getByQuestionID: vitest.fn(),
    getAll: vitest.fn(),
    delete: vitest.fn()
  }
}

describe('Get Answer Usecase tests', () => {
  const answerRepository = AnswerMockRepository()
  const getAnswerUseCase = new GetAnswerUseCase(answerRepository)

  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('Should get an answer', async () => {
    const answer = await getAnswerUseCase.execute({ id: 'answerId' })

    expect(answerRepository.getByID).toHaveBeenCalledWith('answerId')
    expect(answer).toMatchObject({
      id: 'answerId',
      content: expect.any(String),
      questionId: expect.any(String),
      responderId: expect.any(String),
      likes: expect.any(Number),
      createdAt: expect.any(Date)
    })
  })

  it('Should throw an error if answer not found', async () => {
    await expect(getAnswerUseCase.execute({ id: 'non-existent-answer' })).rejects.toThrow('Answer not found')
    expect(answerRepository.getByID).toHaveBeenCalledTimes(1)
    expect(answerRepository.getByID).toHaveBeenCalledWith('non-existent-answer')
    expect(answerRepository.getByID).toHaveReturnedWith(null)
  })
})
