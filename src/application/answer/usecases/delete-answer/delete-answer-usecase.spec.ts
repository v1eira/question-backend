import { afterEach, describe, expect, it, vitest } from 'vitest'
import type AnswerRepositoryInterface from '../../../../domain/answer/repository/answer-repository.interface'
import DeleteAnswerUseCase from './delete-answer-usecase'

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

describe('Delete Answer Usecase tests', () => {
  const answerRepository = AnswerMockRepository()
  const deleteAnswerUseCase = new DeleteAnswerUseCase(answerRepository)

  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('Should delete an answer', async () => {
    await deleteAnswerUseCase.execute({ id: 'answerId' })

    expect(answerRepository.delete).toHaveBeenCalledTimes(1)
    expect(answerRepository.delete).toHaveBeenCalledWith('answerId')
  })

  it('Should throw an error if answer not found', async () => {
    await expect(deleteAnswerUseCase.execute({ id: 'non-existent-answer' })).rejects.toThrow('Answer not found')
    expect(answerRepository.getByID).toHaveBeenCalledWith('non-existent-answer')
    expect(answerRepository.getByID).toHaveReturnedWith(null)
    expect(answerRepository.delete).not.toHaveBeenCalled()
  })
})
