import { afterEach, describe, expect, it, vitest } from 'vitest'
import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import ListUnansweredQuestionsQueryHandler from './list-unanswered-questions'
import { type QuestionQueryInterface } from '../../../../domain/question/query/question-query.interface'
import UserBuilder from '../../../../domain/user/entity/user-data-builder'

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

const QuestionQueryImpl = (): QuestionQueryInterface => {
  return {
    findAnsweredQuestionById: vitest.fn(),
    listAnsweredQuestions: vitest.fn(),
    listUserUnansweredQuestions: vitest.fn()
  }
}

describe('List Unanswered Questions Query Handler tests', () => {
  const userRepository = UserMockRepository()
  const questionQuery = QuestionQueryImpl()
  const listQuestionsToAnswerQueryHandler = new ListUnansweredQuestionsQueryHandler(userRepository, questionQuery)

  const anUser = new UserBuilder()

  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('Should list unanswered questions', async () => {
    const spyFindUser = vitest.spyOn(userRepository, 'findByID')
    spyFindUser.mockReturnValueOnce(Promise.resolve(anUser.withId('recipientId').build()))

    const spyQuery = vitest.spyOn(questionQuery, 'listUserUnansweredQuestions')
    spyQuery.mockReturnValueOnce(Promise.resolve([
      {
        id: 'questionId',
        content: 'this is a question',
        recipientId: 'recipientId',
        createdAt: expect.any(Date),
        asker: {
          id: 'askerId',
          fullName: 'askerFullName',
          username: 'askerUsername',
          email: 'askerEmail'
        }
      }
    ]))

    const questionsToAnswer = await listQuestionsToAnswerQueryHandler.execute({ recipientId: 'recipientID' })
    expect(userRepository.findByID).toHaveBeenCalledTimes(1)
    expect(userRepository.findByID).toHaveBeenCalledWith('recipientID')
    expect(userRepository.findByID).toHaveReturnedWith(expect.objectContaining({ id: 'recipientId' }))
    expect(questionQuery.listUserUnansweredQuestions).toHaveBeenCalledTimes(1)
    expect(questionQuery.listUserUnansweredQuestions).toHaveBeenCalledWith('recipientId')
    expect(questionsToAnswer).toStrictEqual({
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
    expect(questionQuery.listUserUnansweredQuestions).not.toHaveBeenCalled()
  })

  it('Should return empty array if no questions found', async () => {
    const spyFindUser = vitest.spyOn(userRepository, 'findByID')
    spyFindUser.mockReturnValueOnce(Promise.resolve(anUser.withId('recipientId').build()))

    const spyQuery = vitest.spyOn(questionQuery, 'listUserUnansweredQuestions')
    spyQuery.mockReturnValueOnce(Promise.resolve([]))

    const questionsToAnswer = await listQuestionsToAnswerQueryHandler.execute({ recipientId: 'recipientID' })
    expect(userRepository.findByID).toHaveBeenCalledTimes(1)
    expect(userRepository.findByID).toHaveBeenCalledWith('recipientID')
    expect(userRepository.findByID).toHaveReturnedWith(expect.objectContaining({ id: 'recipientId' }))
    expect(questionQuery.listUserUnansweredQuestions).toHaveBeenCalledTimes(1)
    expect(questionQuery.listUserUnansweredQuestions).toHaveBeenCalledWith('recipientId')
    expect(questionsToAnswer).toStrictEqual({
      questions: []
    })
  })
})
