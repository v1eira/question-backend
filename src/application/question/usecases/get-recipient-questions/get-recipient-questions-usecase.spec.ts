import { vitest, describe, afterEach, it, expect } from 'vitest'
import type QuestionRepositoryInterface from '../../../../domain/question/repository/question-repository.interface'
import UserBuilder from '../../../../domain/user/entity/user-data-builder'
import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import GetRecipientQuestionsUsecase from './get-recipient-questions-usecase'
import QuestionBuilder from '../../../../domain/question/entity/question-data-builder'

const QuestionMockRepository = (): QuestionRepositoryInterface => {
  return {
    create: vitest.fn(),
    getByID: vitest.fn(),
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

describe('Get Recipient Questions Usecase tests', () => {
  const questionRepository = QuestionMockRepository()
  const userRepository = UserMockRepository()
  const getRecipientQuestionsUsecase = new GetRecipientQuestionsUsecase(questionRepository, userRepository)

  const aQuestion = new QuestionBuilder()
  const anUser = new UserBuilder()

  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('Should return an array of questions by recipient id', async () => {
    const spyGetUser = vitest.spyOn(userRepository, 'getByID')
    spyGetUser.mockReturnValueOnce(Promise.resolve(anUser.withId('recipientId').build()))

    const spyGetRecipientQuestions = vitest.spyOn(questionRepository, 'getRecipientQuestions')
    spyGetRecipientQuestions.mockReturnValue(Promise.resolve([
      aQuestion.withId('1').withRecipientId('recipientId').build(),
      aQuestion.withId('2').withRecipientId('recipientId').build()
    ]))

    const recipientQuestions = await getRecipientQuestionsUsecase.execute({ id: 'recipientId' })
    expect(recipientQuestions.recipient).toStrictEqual({
      id: 'recipientId',
      fullName: expect.any(String),
      username: expect.any(String),
      email: expect.any(String)
    })
    expect(recipientQuestions.questions).toBeInstanceOf(Array)
    expect(recipientQuestions.questions).toHaveLength(2)
    expect(recipientQuestions.questions[0]).toHaveProperty('id')
    expect(recipientQuestions.questions[0].id).toBe('1')
    expect(recipientQuestions.questions[0]).toHaveProperty('content')
    expect(recipientQuestions.questions[0]).toHaveProperty('askerId')
    expect(recipientQuestions.questions[0]).toHaveProperty('recipientId')
    expect(recipientQuestions.questions[0].recipientId).toBe('recipientId')
    expect(recipientQuestions.questions[0]).toHaveProperty('createdAt')
  })

  it('Should throw an error when recipient not found', async () => {
    const spyGetUser = vitest.spyOn(userRepository, 'getByID')
    spyGetUser.mockReturnValueOnce(Promise.resolve(null))

    await expect(getRecipientQuestionsUsecase.execute({ id: 'recipientId' })).rejects.toThrow('Recipient not found')
    expect(userRepository.getByID).toHaveBeenCalledTimes(1)
    expect(userRepository.getByID).toHaveBeenCalledWith('recipientId')
    expect(userRepository.getByID).toHaveReturnedWith(null)
    expect(questionRepository.getRecipientQuestions).not.toHaveBeenCalled()
  })

  it('Should return an empty array when no questions found', async () => {
    const spyGetUser = vitest.spyOn(userRepository, 'getByID')
    spyGetUser.mockReturnValueOnce(Promise.resolve(anUser.withId('recipientId').build()))

    const spyGetRecipientQuestions = vitest.spyOn(questionRepository, 'getRecipientQuestions')
    spyGetRecipientQuestions.mockReturnValue(Promise.resolve([]))

    const recipientQuestions = await getRecipientQuestionsUsecase.execute({ id: 'recipientId' })
    expect(recipientQuestions.recipient).toStrictEqual({
      id: 'recipientId',
      fullName: expect.any(String),
      username: expect.any(String),
      email: expect.any(String)
    })
    expect(recipientQuestions.questions).toBeInstanceOf(Array)
    expect(recipientQuestions.questions).toHaveLength(0)
  })
})
