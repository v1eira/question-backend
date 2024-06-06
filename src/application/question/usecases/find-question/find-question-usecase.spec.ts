import { afterEach, describe, expect, it, vitest } from 'vitest'
import type QuestionRepositoryInterface from '../../../../domain/question/repository/question-repository.interface'
import QuestionBuilder from '../../../../domain/question/entity/question-data-builder'
import FindQuestionUsecase from './find-question-usecase'
import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import UserBuilder from '../../../../domain/user/entity/user-data-builder'

const aQuestion = new QuestionBuilder()
const anUser = new UserBuilder()

const QuestionMockRepository = (): QuestionRepositoryInterface => {
  return {
    create: vitest.fn(),
    findByID: vitest.fn().mockImplementation(id => id === 'questionID'
      ? aQuestion.withId('questionID').build()
      : null),
    findRecipientQuestions: vitest.fn(),
    findAll: vitest.fn(),
    delete: vitest.fn()
  }
}

const UserMockRepository = (): UserRepositoryInterface => {
  return {
    create: vitest.fn(),
    update: vitest.fn(),
    findByEmail: vitest.fn(),
    findByUsername: vitest.fn(),
    findAll: vitest.fn(),
    findByID: vitest.fn(),
    delete: vitest.fn()
  }
}

describe('Find Question Usecase tests', () => {
  const questionRepository = QuestionMockRepository()
  const userRepository = UserMockRepository()
  const findQuestionUsecase = new FindQuestionUsecase(questionRepository, userRepository)

  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('Should return a question', async () => {
    const spy = vitest.spyOn(userRepository, 'findByID')
    spy.mockReturnValueOnce(Promise.resolve(anUser.withId('askerID').build()))
    spy.mockReturnValueOnce(Promise.resolve(anUser.withId('recipientId').build()))

    const output = await findQuestionUsecase.execute({ id: 'questionID' })

    expect(questionRepository.findByID).toHaveBeenCalledTimes(1)
    expect(questionRepository.findByID).toHaveBeenCalledWith('questionID')
    expect(userRepository.findByID).toHaveBeenCalledTimes(2)
    expect(output).toStrictEqual({
      id: 'questionID',
      content: expect.any(String),
      asker: {
        id: expect.any(String),
        fullName: expect.any(String),
        username: expect.any(String),
        email: expect.any(String)
      },
      recipient: {
        id: expect.any(String),
        fullName: expect.any(String),
        username: expect.any(String),
        email: expect.any(String)
      },
      createdAt: expect.any(Date)
    })
  })

  it('Should throw an error when question not found', async () => {
    await expect(findQuestionUsecase.execute({ id: 'nonExistentID' })).rejects.toThrowError('Question not found')

    expect(questionRepository.findByID).toHaveBeenCalledTimes(1)
    expect(questionRepository.findByID).toHaveBeenCalledWith('nonExistentID')
  })

  it('Should throw an error when asker not found', async () => {
    const spy = vitest.spyOn(userRepository, 'findByID')
    spy.mockReturnValueOnce(Promise.resolve(null))
    await expect(findQuestionUsecase.execute({ id: 'questionID' })).rejects.toThrowError('Asker not found')

    expect(questionRepository.findByID).toHaveBeenCalledTimes(1)
    expect(questionRepository.findByID).toHaveBeenCalledWith('questionID')
    expect(userRepository.findByID).toHaveBeenCalledTimes(1)

    expect(userRepository.findByID).not.toHaveBeenCalledWith('recipientId')
  })

  it('Should throw an error when recipient not found', async () => {
    const spy = vitest.spyOn(userRepository, 'findByID')
    spy.mockReturnValueOnce(Promise.resolve(anUser.withId('askerId').build()))
    spy.mockReturnValueOnce(Promise.resolve(null))

    await expect(findQuestionUsecase.execute({ id: 'questionID' })).rejects.toThrowError('Recipient not found')

    expect(questionRepository.findByID).toHaveBeenCalledTimes(1)
    expect(questionRepository.findByID).toHaveBeenCalledWith('questionID')
    expect(userRepository.findByID).toHaveBeenCalledTimes(2)
  })
})
