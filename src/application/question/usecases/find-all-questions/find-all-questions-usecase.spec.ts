import { afterEach, describe, expect, it, vitest } from 'vitest'
import { type QuestionFilters } from '../../../../domain/question/repository/question-repository.interface'
import type QuestionRepositoryInterface from '../../../../domain/question/repository/question-repository.interface'
import QuestionBuilder from '../../../../domain/question/entity/question-data-builder'
import { Question } from '../../../../domain/question/entity/question'
import FindAllQuestionsUsecase from './find-all-questions-usecase'

const aQuestion = new QuestionBuilder()

const MockRepository = (): QuestionRepositoryInterface => {
  return {
    create: vitest.fn(),
    findByID: vitest.fn(),
    findAskerQuestions: vitest.fn(),
    findRecipientQuestions: vitest.fn(),
    findAll: vitest.fn().mockReturnValue([
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

describe('Find All Questions Usecase tests', () => {
  const questionRepository = MockRepository()
  const findAllQuestionsUsecase = new FindAllQuestionsUsecase(questionRepository)

  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('Should find questions', async () => {
    const filters: QuestionFilters = {
      from: ['fromID'],
      to: ['toID'],
      content: 'content'
    }
    const questions = await findAllQuestionsUsecase.execute(filters)

    expect(questionRepository.findAll).toHaveBeenCalledTimes(1)
    expect(questionRepository.findAll).toHaveBeenCalledWith(filters)
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

  it('Should not find questions when filters are empty', async () => {
    const filters: QuestionFilters = {}
    await expect(findAllQuestionsUsecase.execute(filters)).rejects.toThrow('Filters are required')

    expect(questionRepository.findAll).not.toHaveBeenCalled()
  })
})
