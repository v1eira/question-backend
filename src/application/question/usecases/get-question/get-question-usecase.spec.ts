import { afterEach, describe, expect, it, vitest } from 'vitest'
import type QuestionRepositoryInterface from '../../../../domain/question/repository/question-repository.interface'
import QuestionBuilder from '../../../../domain/question/entity/question-data-builder'
import GetQuestionUsecase from './get-question-usecase'
import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import UserBuilder from '../../../../domain/user/entity/user-data-builder'

const aQuestion = new QuestionBuilder()
const anUser = new UserBuilder()

const QuestionMockRepository = (): QuestionRepositoryInterface => {
  return {
    create: vitest.fn(),
    getByID: vitest.fn().mockImplementation(id => id === 'questionID'
      ? aQuestion.withId('questionID').build()
      : null),
    getRecipientQuestions: vitest.fn(),
    getAll: vitest.fn(),
    delete: vitest.fn()
  }
}

const UserMockRepository = (): UserRepositoryInterface => {
  return {
    create: vitest.fn(),
    update: vitest.fn(),
    getByEmail: vitest.fn(),
    getByUsername: vitest.fn(),
    getAll: vitest.fn(),
    getByID: vitest.fn(),
    delete: vitest.fn()
  }
}

describe('Get Question Usecase tests', () => {
  const questionRepository = QuestionMockRepository()
  const userRepository = UserMockRepository()
  const getQuestionUsecase = new GetQuestionUsecase(questionRepository, userRepository)

  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('Should return a question', async () => {
    const spy = vitest.spyOn(userRepository, 'getByID')
    spy.mockReturnValueOnce(Promise.resolve(anUser.withId('askerID').build()))
    spy.mockReturnValueOnce(Promise.resolve(anUser.withId('recipientId').build()))

    const output = await getQuestionUsecase.execute({ id: 'questionID' })

    expect(questionRepository.getByID).toHaveBeenCalledTimes(1)
    expect(questionRepository.getByID).toHaveBeenCalledWith('questionID')
    expect(userRepository.getByID).toHaveBeenCalledTimes(2)
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
    await expect(getQuestionUsecase.execute({ id: 'nonExistentID' })).rejects.toThrowError('Question not found')

    expect(questionRepository.getByID).toHaveBeenCalledTimes(1)
    expect(questionRepository.getByID).toHaveBeenCalledWith('nonExistentID')
  })

  it('Should throw an error when asker not found', async () => {
    const spy = vitest.spyOn(userRepository, 'getByID')
    spy.mockReturnValueOnce(Promise.resolve(null))
    await expect(getQuestionUsecase.execute({ id: 'questionID' })).rejects.toThrowError('Asker not found')

    expect(questionRepository.getByID).toHaveBeenCalledTimes(1)
    expect(questionRepository.getByID).toHaveBeenCalledWith('questionID')
    expect(userRepository.getByID).toHaveBeenCalledTimes(1)

    expect(userRepository.getByID).not.toHaveBeenCalledWith('recipientId')
  })

  it('Should throw an error when recipient not found', async () => {
    const spy = vitest.spyOn(userRepository, 'getByID')
    spy.mockReturnValueOnce(Promise.resolve(anUser.withId('askerId').build()))
    spy.mockReturnValueOnce(Promise.resolve(null))

    await expect(getQuestionUsecase.execute({ id: 'questionID' })).rejects.toThrowError('Recipient not found')

    expect(questionRepository.getByID).toHaveBeenCalledTimes(1)
    expect(questionRepository.getByID).toHaveBeenCalledWith('questionID')
    expect(userRepository.getByID).toHaveBeenCalledTimes(2)
  })
})
