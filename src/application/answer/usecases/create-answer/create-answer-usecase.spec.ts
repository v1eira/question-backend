import { afterEach, describe, expect, it, vitest } from 'vitest'
import type AnswerRepositoryInterface from '../../../../domain/answer/repository/answer-repository.interface'
import CreateAnswerUseCase from './create-answer-usecase'
import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import type QuestionRepositoryInterface from '../../../../domain/question/repository/question-repository.interface'
import QuestionBuilder from '../../../../domain/question/entity/question-data-builder'
import UserBuilder from '../../../../domain/user/entity/user-data-builder'
import AnswerBuilder from '../../../../domain/answer/entity/answer-data-builder'

const AnswerMockRepository = (): AnswerRepositoryInterface => {
  return {
    create: vitest.fn(),
    findByID: vitest.fn(),
    findByQuestionID: vitest.fn(),
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

const QuestionMockRepository = (): QuestionRepositoryInterface => {
  return {
    create: vitest.fn(),
    findByID: vitest.fn(),
    findRecipientQuestions: vitest.fn(),
    findAll: vitest.fn(),
    delete: vitest.fn()
  }
}

describe('Create Answer Usecase tests', () => {
  const answerRepository = AnswerMockRepository()
  const userRepository = UserMockRepository()
  const questionRepository = QuestionMockRepository()
  const createAnswerUsecase = new CreateAnswerUseCase(answerRepository, userRepository, questionRepository)

  const aQuestion = new QuestionBuilder()
  const anUser = new UserBuilder()
  const anAnswer = new AnswerBuilder()

  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('Should create an answer', async () => {
    const input = {
      content: 'this is an answer',
      responderId: 'responderID',
      questionId: 'questionID'
    }

    const findQuestionSpy = vitest.spyOn(questionRepository, 'findByID')
    findQuestionSpy.mockReturnValueOnce(Promise.resolve(aQuestion.withId('questionID').withRecipientId('responderID').build()))

    const findUserSpy = vitest.spyOn(userRepository, 'findByID')
    findUserSpy.mockReturnValueOnce(Promise.resolve(anUser.withId('responderID').build()))

    await createAnswerUsecase.execute(input)

    expect(questionRepository.findByID).toBeCalledTimes(1)
    expect(questionRepository.findByID).toBeCalledWith(input.questionId)
    expect(userRepository.findByID).toBeCalledTimes(1)
    expect(userRepository.findByID).toBeCalledWith(input.responderId)
    expect(answerRepository.create).toBeCalledTimes(1)
    expect(answerRepository.create).toBeCalledWith({
      _id: expect.any(String),
      _content: input.content,
      _responderId: input.responderId,
      _questionId: input.questionId,
      _likes: 0,
      _createdAt: expect.any(Date)
    })
  })

  it('Should throw an error if answer already exists', async () => {
    const input = {
      content: 'this is an answer',
      responderId: 'responderID',
      questionId: 'questionID'
    }

    const findAnswerSpy = vitest.spyOn(answerRepository, 'findByQuestionID')
    findAnswerSpy.mockReturnValueOnce(Promise.resolve(anAnswer.withId('answerID').build()))

    await expect(createAnswerUsecase.execute(input)).rejects.toThrow('Answer already exists')
  })

  it('Should throw an error if question not found', async () => {
    const input = {
      content: 'this is an answer',
      responderId: 'responderID',
      questionId: 'questionID'
    }

    const findQuestionSpy = vitest.spyOn(questionRepository, 'findByID')
    findQuestionSpy.mockReturnValueOnce(Promise.resolve(null))

    await expect(createAnswerUsecase.execute(input)).rejects.toThrow('Question not found')
  })

  it('Should throw an error if responder not found', async () => {
    const input = {
      content: 'this is an answer',
      responderId: 'responderID',
      questionId: 'questionID'
    }

    const findQuestionSpy = vitest.spyOn(questionRepository, 'findByID')
    findQuestionSpy.mockReturnValueOnce(Promise.resolve(aQuestion.withId('questionID').build()))

    const findUserSpy = vitest.spyOn(userRepository, 'findByID')
    findUserSpy.mockReturnValueOnce(Promise.resolve(null))

    await expect(createAnswerUsecase.execute(input)).rejects.toThrow('Responder not found')
  })

  it('Should throw an error if responder is not the recipient of the question', async () => {
    const input = {
      content: 'this is an answer',
      responderId: 'responderID',
      questionId: 'questionID'
    }

    const findQuestionSpy = vitest.spyOn(questionRepository, 'findByID')
    findQuestionSpy.mockReturnValueOnce(Promise.resolve(aQuestion.withId('questionID').withRecipientId('anotherResponderID').build()))

    const findUserSpy = vitest.spyOn(userRepository, 'findByID')
    findUserSpy.mockReturnValueOnce(Promise.resolve(anUser.withId('responderID').build()))

    await expect(createAnswerUsecase.execute(input)).rejects.toThrow('Responder is not the recipient of the question')
  })
})
