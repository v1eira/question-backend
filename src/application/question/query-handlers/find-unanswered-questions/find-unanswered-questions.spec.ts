import { afterEach, describe, expect, it, vitest } from 'vitest'
import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import FindUnansweredQuestionsQueryHandler from './find-unanswered-questions'
import { type QuestionQueryInterface } from '../../../../domain/question/query/question-query.interface'
import UserBuilder from '../../../../domain/user/entity/user-data-builder'
import QuestionBuilder from '../../../../domain/question/entity/question-data-builder'

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

const QuestionQueryHandler = (): QuestionQueryInterface => {
  return {
    findAnsweredQuestions: vitest.fn(),
    findUserUnansweredQuestions: vitest.fn()
  }
}

describe('Find Unanswered Questions Query Handler tests', () => {
  const userRepository = UserMockRepository()
  const queryHandler = QuestionQueryHandler()
  const findQuestionsToAnswerQueryHandler = new FindUnansweredQuestionsQueryHandler(userRepository, queryHandler)

  const anUser = new UserBuilder()
  const aQuestion = new QuestionBuilder()

  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('Should find unanswered questions', async () => {
    const spyGetUser = vitest.spyOn(userRepository, 'getByID')
    spyGetUser.mockReturnValueOnce(Promise.resolve(anUser.withId('recipientId').build()))

    const spyQuery = vitest.spyOn(queryHandler, 'findUserUnansweredQuestions')
    spyQuery.mockReturnValueOnce(Promise.resolve([
      {
        question: aQuestion.build(),
        asker: anUser.build()
      }
    ]))

    const unansweredQuestions = await findQuestionsToAnswerQueryHandler.execute({ recipientId: 'recipientID' })
    expect(userRepository.getByID).toHaveBeenCalledTimes(1)
    expect(userRepository.getByID).toHaveBeenCalledWith('recipientID')
    expect(userRepository.getByID).toHaveReturnedWith(expect.objectContaining({ id: 'recipientId' }))
    expect(queryHandler.findUserUnansweredQuestions).toHaveBeenCalledTimes(1)
    expect(queryHandler.findUserUnansweredQuestions).toHaveBeenCalledWith('recipientId')
    expect(unansweredQuestions).toStrictEqual({
      questions: [
        {
          id: expect.any(String),
          content: expect.any(String),
          createdAt: expect.any(Date),
          asker: {
            id: expect.any(String),
            fullName: expect.any(String),
            username: expect.any(String),
            email: expect.any(String)
          }
        }
      ]
    })
  })

  it('Should throw error if recipient not found', async () => {
    const spyGetUser = vitest.spyOn(userRepository, 'getByID')
    spyGetUser.mockReturnValueOnce(Promise.resolve(null))

    await expect(findQuestionsToAnswerQueryHandler.execute({ recipientId: 'recipientID' })).rejects.toThrow('Recipient not found')
    expect(userRepository.getByID).toHaveBeenCalledTimes(1)
    expect(userRepository.getByID).toHaveBeenCalledWith('recipientID')
    expect(userRepository.getByID).toHaveReturnedWith(null)
    expect(queryHandler.findUserUnansweredQuestions).not.toHaveBeenCalled()
  })

  it('Should return empty array if no questions found', async () => {
    const spyGetUser = vitest.spyOn(userRepository, 'getByID')
    spyGetUser.mockReturnValueOnce(Promise.resolve(anUser.withId('recipientId').build()))

    const spyQuery = vitest.spyOn(queryHandler, 'findUserUnansweredQuestions')
    spyQuery.mockReturnValueOnce(Promise.resolve([]))

    const questionsToAnswer = await findQuestionsToAnswerQueryHandler.execute({ recipientId: 'recipientID' })
    expect(userRepository.getByID).toHaveBeenCalledTimes(1)
    expect(userRepository.getByID).toHaveBeenCalledWith('recipientID')
    expect(userRepository.getByID).toHaveReturnedWith(expect.objectContaining({ id: 'recipientId' }))
    expect(queryHandler.findUserUnansweredQuestions).toHaveBeenCalledTimes(1)
    expect(queryHandler.findUserUnansweredQuestions).toHaveBeenCalledWith('recipientId')
    expect(questionsToAnswer).toStrictEqual({
      questions: []
    })
  })
})
