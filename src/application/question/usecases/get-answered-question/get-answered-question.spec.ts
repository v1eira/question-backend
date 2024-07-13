/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { vitest, describe, afterEach, it, expect } from 'vitest'
import GetAnsweredQuestionUsecase from './get-answered-question'
import QuestionBuilder from '../../../../domain/question/entity/question-data-builder'
import UserBuilder from '../../../../domain/user/entity/user-data-builder'
import AnswerBuilder from '../../../../domain/answer/entity/answer-data-builder'
import type QuestionRepositoryInterface from '../../../../domain/question/repository/question-repository.interface'
import type AnswerRepositoryInterface from '../../../../domain/answer/repository/answer-repository.interface'
import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'

const MockQuestionRepository = (): QuestionRepositoryInterface => {
  return {
    create: vitest.fn(),
    getByID: vitest.fn(),
    getRecipientQuestions: vitest.fn(),
    getAll: vitest.fn(),
    delete: vitest.fn()
  }
}
const MockUserRepository = (): UserRepositoryInterface => {
  return {
    create: vitest.fn(),
    update: vitest.fn(),
    getByID: vitest.fn(),
    getByEmail: vitest.fn(),
    getByUsername: vitest.fn(),
    getAll: vitest.fn(),
    delete: vitest.fn()
  }
}

const MockAnswerRepository = (): AnswerRepositoryInterface => {
  return {
    create: vitest.fn(),
    getByID: vitest.fn(),
    getByQuestionID: vitest.fn(),
    getAll: vitest.fn(),
    delete: vitest.fn()
  }
}

describe('Get Answered Question Usecase tests', () => {
  const questionRepository = MockQuestionRepository()
  const userRepository = MockUserRepository()
  const answerRepository = MockAnswerRepository()
  const getAnsweredQuestionUsecase = new GetAnsweredQuestionUsecase(questionRepository, answerRepository, userRepository)

  const anUser = new UserBuilder()
  const aQuestion = new QuestionBuilder()
  const anAnswer = new AnswerBuilder()

  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('Should get an answered question', async () => {
    const spyQuestionRepository = vitest.spyOn(questionRepository, 'getByID')
    spyQuestionRepository.mockReturnValueOnce(Promise.resolve(aQuestion.withId('1').build()))

    const spyUserRepository = vitest.spyOn(userRepository, 'getByID')
    spyUserRepository.mockReturnValue(Promise.resolve(anUser.build()))

    const spyAnswerRepository = vitest.spyOn(answerRepository, 'getByQuestionID')
    spyAnswerRepository.mockReturnValueOnce(Promise.resolve(anAnswer.withQuestionId('1').build()))

    const answeredQuestion = await getAnsweredQuestionUsecase.execute({ id: '1' })

    expect(questionRepository.getByID).toHaveBeenCalledTimes(1)
    expect(questionRepository.getByID).toHaveBeenCalledWith('1')
    expect(userRepository.getByID).toHaveBeenCalledTimes(2)
    expect(answerRepository.getByQuestionID).toHaveBeenCalledTimes(1)
    expect(answerRepository.getByQuestionID).toHaveBeenCalledWith('1')
    expect(answeredQuestion).toStrictEqual({
      question: {
        id: '1',
        content: expect.any(String),
        createdAt: expect.any(Date),
        asker: {
          id: expect.any(String),
          fullName: expect.any(String),
          username: expect.any(String),
          email: expect.any(String)
        }
      },
      answer: {
        id: expect.any(String),
        content: expect.any(String),
        likes: expect.any(Number),
        createdAt: expect.any(Date),
        responder: {
          id: expect.any(String),
          fullName: expect.any(String),
          username: expect.any(String),
          email: expect.any(String)
        }
      }
    })
  })

  it('Should throw error if question not found', async () => {
    const spyQuestionRepository = vitest.spyOn(questionRepository, 'getByID')
    spyQuestionRepository.mockReturnValueOnce(Promise.resolve(null))

    await expect(getAnsweredQuestionUsecase.execute({ id: '1' })).rejects.toThrow('Question not found')
    expect(questionRepository.getByID).toHaveBeenCalledWith('1')
    expect(questionRepository.getByID).toHaveReturnedWith(null)
    expect(userRepository.getByID).not.toHaveBeenCalled()
    expect(answerRepository.getByID).not.toHaveBeenCalled()
  })

  it('Should throw error if asker not found', async () => {
    const spyQuestionRepository = vitest.spyOn(questionRepository, 'getByID')
    spyQuestionRepository.mockReturnValueOnce(Promise.resolve(
      aQuestion.withId('1').withContent('Some question').build()
    ))

    const spyUserRepository = vitest.spyOn(userRepository, 'getByID')
    spyUserRepository.mockReturnValueOnce(Promise.resolve(null))

    await expect(getAnsweredQuestionUsecase.execute({ id: '1' })).rejects.toThrow('Asker not found')
    expect(questionRepository.getByID).toHaveBeenCalledWith('1')
    expect(questionRepository.getByID).toHaveReturnedWith(expect.objectContaining({
      id: '1', content: 'Some question'
    }))
    expect(userRepository.getByID).toHaveBeenCalledTimes(1)
    expect(userRepository.getByID).toHaveReturnedWith(null)
    expect(answerRepository.getByID).not.toHaveBeenCalled()
  })

  it('Should throw error if responder not found', async () => {
    const spyQuestionRepository = vitest.spyOn(questionRepository, 'getByID')
    spyQuestionRepository.mockReturnValueOnce(Promise.resolve(
      aQuestion.withId('1').withContent('Some question').build()
    ))

    const spyUserRepository = vitest.spyOn(userRepository, 'getByID')
    spyUserRepository.mockReturnValueOnce(Promise.resolve(anUser.withId('123').build()))
    spyUserRepository.mockReturnValueOnce(Promise.resolve(null))

    await expect(getAnsweredQuestionUsecase.execute({ id: '1' })).rejects.toThrow('Responder not found')
    expect(questionRepository.getByID).toHaveBeenCalledWith('1')
    expect(questionRepository.getByID).toHaveReturnedWith(expect.objectContaining({
      id: '1', content: 'Some question'
    }))
    expect(userRepository.getByID).toHaveBeenCalledTimes(2)
    expect(userRepository.getByID).toHaveNthReturnedWith(1, expect.objectContaining({ id: '123' }))
    expect(userRepository.getByID).toHaveNthReturnedWith(2, null)
    expect(answerRepository.getByID).not.toHaveBeenCalled()
  })

  it('Should throw error if answer not found', async () => {
    const spyQuestionRepository = vitest.spyOn(questionRepository, 'getByID')
    spyQuestionRepository.mockReturnValueOnce(Promise.resolve(
      aQuestion.withId('1').withContent('Some question').build()
    ))

    const spyUserRepository = vitest.spyOn(userRepository, 'getByID')
    spyUserRepository.mockReturnValueOnce(Promise.resolve(anUser.withId('123').build()))
    spyUserRepository.mockReturnValueOnce(Promise.resolve(anUser.withId('456').build()))

    const spyAnswerRepository = vitest.spyOn(answerRepository, 'getByQuestionID')
    spyAnswerRepository.mockReturnValueOnce(Promise.resolve(null))

    await expect(getAnsweredQuestionUsecase.execute({ id: '1' })).rejects.toThrow('Answer not found')
    expect(questionRepository.getByID).toHaveBeenCalledWith('1')
    expect(questionRepository.getByID).toHaveReturnedWith(expect.objectContaining({
      id: '1', content: 'Some question'
    }))
    expect(userRepository.getByID).toHaveBeenCalledTimes(2)
    expect(userRepository.getByID).toHaveNthReturnedWith(1, expect.objectContaining({ id: '123' }))
    expect(userRepository.getByID).toHaveNthReturnedWith(2, expect.objectContaining({ id: '456' }))
    expect(answerRepository.getByQuestionID).toHaveBeenCalled()
    expect(answerRepository.getByQuestionID).toHaveReturnedWith(null)
  })
})
