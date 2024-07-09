import { afterEach, describe, expect, it, vitest } from 'vitest'
import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import ListUnansweredQuestionsQueryHandler from './list-unanswered-questions'
import { type QuestionQueryInterface } from '../../../../domain/question/query/question-query.interface'
import UserBuilder from '../../../../domain/user/entity/user-data-builder'
import QuestionBuilder from '../../../../domain/question/entity/question-data-builder'

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

const QuestionQueryHandler = (): QuestionQueryInterface => {
  return {
    listAnsweredQuestions: vitest.fn(),
    listUserUnansweredQuestions: vitest.fn()
  }
}

describe('List Unanswered Questions Query Handler tests', () => {
  const userRepository = UserMockRepository()
  const queryHandler = QuestionQueryHandler()
  const listQuestionsToAnswerQueryHandler = new ListUnansweredQuestionsQueryHandler(userRepository, queryHandler)

  const anUser = new UserBuilder()
  const aQuestion = new QuestionBuilder()

  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('Should list unanswered questions', async () => {
    const spyFindUser = vitest.spyOn(userRepository, 'findByID')
    spyFindUser.mockReturnValueOnce(Promise.resolve(anUser.withId('recipientId').build()))

    const spyQuery = vitest.spyOn(queryHandler, 'listUserUnansweredQuestions')
    spyQuery.mockReturnValueOnce(Promise.resolve([
      {
        question: aQuestion.build(),
        asker: anUser.build()
      }
    ]))

    const unansweredQuestions = await listQuestionsToAnswerQueryHandler.execute({ recipientId: 'recipientID' })
    expect(userRepository.findByID).toHaveBeenCalledTimes(1)
    expect(userRepository.findByID).toHaveBeenCalledWith('recipientID')
    expect(userRepository.findByID).toHaveReturnedWith(expect.objectContaining({ id: 'recipientId' }))
    expect(queryHandler.listUserUnansweredQuestions).toHaveBeenCalledTimes(1)
    expect(queryHandler.listUserUnansweredQuestions).toHaveBeenCalledWith('recipientId')
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
    const spyFindUser = vitest.spyOn(userRepository, 'findByID')
    spyFindUser.mockReturnValueOnce(Promise.resolve(null))

    await expect(listQuestionsToAnswerQueryHandler.execute({ recipientId: 'recipientID' })).rejects.toThrow('Recipient not found')
    expect(userRepository.findByID).toHaveBeenCalledTimes(1)
    expect(userRepository.findByID).toHaveBeenCalledWith('recipientID')
    expect(userRepository.findByID).toHaveReturnedWith(null)
    expect(queryHandler.listUserUnansweredQuestions).not.toHaveBeenCalled()
  })

  it('Should return empty array if no questions found', async () => {
    const spyFindUser = vitest.spyOn(userRepository, 'findByID')
    spyFindUser.mockReturnValueOnce(Promise.resolve(anUser.withId('recipientId').build()))

    const spyQuery = vitest.spyOn(queryHandler, 'listUserUnansweredQuestions')
    spyQuery.mockReturnValueOnce(Promise.resolve([]))

    const questionsToAnswer = await listQuestionsToAnswerQueryHandler.execute({ recipientId: 'recipientID' })
    expect(userRepository.findByID).toHaveBeenCalledTimes(1)
    expect(userRepository.findByID).toHaveBeenCalledWith('recipientID')
    expect(userRepository.findByID).toHaveReturnedWith(expect.objectContaining({ id: 'recipientId' }))
    expect(queryHandler.listUserUnansweredQuestions).toHaveBeenCalledTimes(1)
    expect(queryHandler.listUserUnansweredQuestions).toHaveBeenCalledWith('recipientId')
    expect(questionsToAnswer).toStrictEqual({
      questions: []
    })
  })
})
