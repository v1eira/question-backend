import { afterEach, describe, expect, it, vitest } from 'vitest'
import { type AnswerQueryInterface } from '../../AnswerQueryInterface'
import FindAnsweredQuestionQueryHandler from './find-answered-question-usecase'

const AnswerQueryImpl = (): AnswerQueryInterface => {
  return {
    findAnsweredQuestion: vitest.fn(),
    listUserAnsweredQuestions: vitest.fn()
  }
}

describe('Find Answered Question Query Handler tests', () => {
  const answerQuery = AnswerQueryImpl()
  const findAnsweredQuestionQueryHandler = new FindAnsweredQuestionQueryHandler(answerQuery)

  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('Should find an answered question', async () => {
    const input = { id: 'answerId' }

    const spyFindAnsweredQuestion = vitest.spyOn(answerQuery, 'findAnsweredQuestion')
    spyFindAnsweredQuestion.mockReturnValue(Promise.resolve({
      id: 'answerId',
      content: expect.any(String),
      likes: expect.any(Number),
      createdAt: expect.any(Date),
      responder: {
        id: expect.any(String),
        fullName: expect.any(String),
        username: expect.any(String),
        email: expect.any(String)
      },
      question: {
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
    }))

    const result = await findAnsweredQuestionQueryHandler.execute(input)

    expect(answerQuery.findAnsweredQuestion).toHaveBeenCalledTimes(1)
    expect(answerQuery.findAnsweredQuestion).toHaveBeenCalledWith('answerId')
    expect(result).toMatchObject({
      answer: {
        id: 'answerId',
        content: expect.any(String),
        likes: expect.any(Number),
        createdAt: expect.any(Date)
      },
      question: {
        id: expect.any(String),
        content: expect.any(String),
        createdAt: expect.any(Date)
      },
      asker: {
        id: expect.any(String),
        fullName: expect.any(String),
        username: expect.any(String),
        email: expect.any(String)
      },
      responder: {
        id: expect.any(String),
        fullName: expect.any(String),
        username: expect.any(String),
        email: expect.any(String)
      }
    })
  })

  it('Should throw an error if question not found', async () => {
    const input = { id: 'non-existent-answer' }

    const spyFindAnsweredQuestion = vitest.spyOn(answerQuery, 'findAnsweredQuestion')
    spyFindAnsweredQuestion.mockReturnValue(Promise.resolve(null))

    await expect(findAnsweredQuestionQueryHandler.execute(input)).rejects.toThrow('Answer not found')
    expect(answerQuery.findAnsweredQuestion).toHaveBeenCalledTimes(1)
    expect(answerQuery.findAnsweredQuestion).toHaveBeenCalledWith('non-existent-answer')
    expect(answerQuery.findAnsweredQuestion).toHaveReturnedWith(null)
  })
})
