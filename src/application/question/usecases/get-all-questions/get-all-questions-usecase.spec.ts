import { afterEach, describe, expect, it, vitest } from 'vitest'
import { type QuestionFilters } from '../../../../domain/question/repository/question-repository.interface'
import type QuestionRepositoryInterface from '../../../../domain/question/repository/question-repository.interface'
import QuestionBuilder from '../../../../domain/question/entity/question-data-builder'
import { Question } from '../../../../domain/question/entity/question'
import GetAllQuestionsUsecase from './get-all-questions-usecase'

const aQuestion = new QuestionBuilder()

const MockRepository = (): QuestionRepositoryInterface => {
  return {
    create: vitest.fn(),
    getByID: vitest.fn(),
    getRecipientQuestions: vitest.fn(),
    getAll: vitest.fn().mockReturnValue([
      aQuestion
        .withId('1')
        .withAskerId('fromID')
        .withRecipientId('toID')
        .withContent('Something with this content')
        .build(),
      aQuestion
        .withId('2')
        .withAskerId('fromID')
        .withRecipientId('toID')
        .withContent('Containing this content')
        .build(),
      aQuestion
        .withId('3')
        .withAskerId('fromID')
        .withRecipientId('toID')
        .withContent('With this content exactly')
        .build()
    ]),
    delete: vitest.fn()
  }
}

describe('Get All Questions Usecase tests', () => {
  const questionRepository = MockRepository()
  const getAllQuestionsUsecase = new GetAllQuestionsUsecase(questionRepository)

  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('Should get questions', async () => {
    const filters: QuestionFilters = {
      from: ['fromID'],
      to: ['toID'],
      content: 'content'
    }
    const questions = await getAllQuestionsUsecase.execute(filters)

    expect(questionRepository.getAll).toHaveBeenCalledTimes(1)
    expect(questionRepository.getAll).toHaveBeenCalledWith(filters)
    expect(questions).toHaveLength(3)
    expect(questions[0]).toBeInstanceOf(Question)
    expect(filters.from).toContain(questions[0].askerId)
    expect(filters.from).toContain(questions[1].askerId)
    expect(filters.from).toContain(questions[2].askerId)
    expect(filters.to).toContain(questions[0].recipientId)
    expect(filters.to).toContain(questions[1].recipientId)
    expect(filters.to).toContain(questions[2].recipientId)
    expect(questions[0].content).toContain(filters.content)
    expect(questions[1].content).toContain(filters.content)
    expect(questions[2].content).toContain(filters.content)
  })

  it('Should not get questions when filters are empty', async () => {
    const filters: QuestionFilters = {}
    await expect(getAllQuestionsUsecase.execute(filters)).rejects.toThrow('Filters are required')

    expect(questionRepository.getAll).not.toHaveBeenCalled()
  })
})
