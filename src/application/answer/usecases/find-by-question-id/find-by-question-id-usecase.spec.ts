import { afterEach, describe, expect, it, vitest } from 'vitest'
import type AnswerRepositoryInterface from '../../../../domain/answer/repository/answer-repository.interface'
import FindByQuestionIdUsecase from './find-by-question-id-usecase'

const AnswerMockRepository = (): AnswerRepositoryInterface => {
  return {
    create: vitest.fn(),
    findByID: vitest.fn(),
    findByQuestionID: vitest.fn().mockImplementation(
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
    findAll: vitest.fn(),
    delete: vitest.fn()
  }
}

describe('Find Answer Usecase tests', () => {
  const answerRepository = AnswerMockRepository()
  const findAnswerByQuestionIdUseCase = new FindByQuestionIdUsecase(answerRepository)

  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('Should find an answer', async () => {
    const answer = await findAnswerByQuestionIdUseCase.execute({ questionId: 'questionId' })

    expect(answerRepository.findByQuestionID).toHaveBeenCalledWith('questionId')
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
    await expect(findAnswerByQuestionIdUseCase.execute({ questionId: 'question-without-answer' })).rejects.toThrow('Answer not found')
    expect(answerRepository.findByQuestionID).toHaveBeenCalledTimes(1)
    expect(answerRepository.findByQuestionID).toHaveBeenCalledWith('question-without-answer')
    expect(answerRepository.findByQuestionID).toHaveReturnedWith(null)
  })
})
