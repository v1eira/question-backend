import { afterEach, describe, expect, it, vitest } from 'vitest'
import type AnswerRepositoryInterface from '../../../../domain/answer/repository/answer-repository.interface'
import GetByQuestionIdUsecase from './get-by-question-id-usecase'

const AnswerMockRepository = (): AnswerRepositoryInterface => {
  return {
    create: vitest.fn(),
    getByID: vitest.fn(),
    getByQuestionID: vitest.fn().mockImplementation(
      (id: string) => id === 'questionId'
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
    getAll: vitest.fn(),
    delete: vitest.fn()
  }
}

describe('Get Answer Usecase tests', () => {
  const answerRepository = AnswerMockRepository()
  const getAnswerByQuestionIdUseCase = new GetByQuestionIdUsecase(answerRepository)

  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('Should get an answer', async () => {
    const answer = await getAnswerByQuestionIdUseCase.execute({ questionId: 'questionId' })

    expect(answerRepository.getByQuestionID).toHaveBeenCalledWith('questionId')
    expect(answer).toMatchObject({
      id: expect.any(String),
      content: expect.any(String),
      questionId: 'questionId',
      responderId: expect.any(String),
      likes: expect.any(Number),
      createdAt: expect.any(Date)
    })
  })

  it('Should throw an error if answer not found', async () => {
    await expect(getAnswerByQuestionIdUseCase.execute({ questionId: 'question-without-answer' })).rejects.toThrow('Answer not found')
    expect(answerRepository.getByQuestionID).toHaveBeenCalledTimes(1)
    expect(answerRepository.getByQuestionID).toHaveBeenCalledWith('question-without-answer')
    expect(answerRepository.getByQuestionID).toHaveReturnedWith(null)
  })
})
