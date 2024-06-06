import { describe, it, expect, vitest, afterEach } from 'vitest'
import type QuestionRepositoryInterface from '../../../../domain/question/repository/question-repository.interface'
import QuestionBuilder from '../../../../domain/question/entity/question-data-builder'
import DeleteQuestionUseCase from './delete-question-usecase'

const aQuestion = new QuestionBuilder()

const MockRepository = (): QuestionRepositoryInterface => {
  return {
    create: vitest.fn(),
    findByID: vitest.fn().mockImplementation(id => id === 'questionID'
      ? aQuestion.withId('questionID').build()
      : null
    ),
    findRecipientQuestions: vitest.fn(),
    findAll: vitest.fn(),
    delete: vitest.fn()
  }
}

describe('Delete Question Usecase tests', () => {
  const questionRepository = MockRepository()
  const deleteQuestionUsecase = new DeleteQuestionUseCase(questionRepository)

  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('Should delete a question', async () => {
    await deleteQuestionUsecase.execute({ id: 'questionID' })

    expect(questionRepository.findByID).toHaveBeenCalledTimes(1)
    expect(questionRepository.findByID).toHaveBeenCalledWith('questionID')
    expect(questionRepository.delete).toHaveBeenCalledTimes(1)
    expect(questionRepository.delete).toHaveBeenCalledWith('questionID')
  })

  it('Should NOT delete a question when question is not found', async () => {
    await expect(deleteQuestionUsecase.execute({ id: '123' })).rejects.toThrow('Question not found')

    expect(questionRepository.findByID).toHaveBeenCalledTimes(1)
    expect(questionRepository.findByID).toHaveBeenCalledWith('123')
    expect(questionRepository.delete).not.toHaveBeenCalled()
  })
})
