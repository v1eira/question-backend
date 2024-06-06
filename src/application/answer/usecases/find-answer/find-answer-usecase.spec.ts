import { afterEach, describe, expect, it, vitest } from 'vitest'
import FindAnswerUseCase from './find-answer-usecase'
import type AnswerRepositoryInterface from '../../../../domain/answer/repository/answer-repository.interface'

const AnswerMockRepository = (): AnswerRepositoryInterface => {
  return {
    create: vitest.fn(),
    findByID: vitest.fn().mockImplementation(
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
    findByQuestionID: vitest.fn(),
    findAll: vitest.fn(),
    delete: vitest.fn()
  }
}

describe('Find Answer Usecase tests', () => {
  const answerRepository = AnswerMockRepository()
  const findAnswerUseCase = new FindAnswerUseCase(answerRepository)

  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('Should find an answer', async () => {
    const answer = await findAnswerUseCase.execute({ id: 'answerId' })

    expect(answerRepository.findByID).toHaveBeenCalledWith('answerId')
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
    await expect(findAnswerUseCase.execute({ id: 'non-existent-answer' })).rejects.toThrow('Answer not found')
    expect(answerRepository.findByID).toHaveBeenCalledTimes(1)
    expect(answerRepository.findByID).toHaveBeenCalledWith('non-existent-answer')
    expect(answerRepository.findByID).toHaveReturnedWith(null)
  })
})
