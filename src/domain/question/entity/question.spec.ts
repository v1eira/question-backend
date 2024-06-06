import { beforeEach, describe, expect, it } from 'vitest'
import { Question } from './question'
import QuestionBuilder from './question-data-builder'

describe('Question entity tests', () => {
  let aQuestion: QuestionBuilder
  beforeEach(() => {
    aQuestion = new QuestionBuilder()
  })
  it('should create a question', () => {
    const question = aQuestion
      .withId('123')
      .withContent('How are u?')
      .withAskerId('111')
      .withRecipientId('222')
      .build()

    expect(question).toBeInstanceOf(Question)
    expect(question.id).toEqual('123')
    expect(question.content).toEqual('How are u?')
    expect(question.askerId).toEqual('111')
    expect(question.recipientId).toEqual('222')
  })

  it('should have ID filled', () => {
    expect(() => {
      aQuestion.withId('').build()
    }).toThrow('ID is required')
  })

  it('should have content filled', () => {
    expect(() => {
      aQuestion.withContent('').build()
    }).toThrow('Content is required')
  })

  it('should have askerId filled', () => {
    expect(() => {
      aQuestion.withAskerId('').build()
    }).toThrow('Asker ID is required')
  })

  it('should have recipientId filled', () => {
    expect(() => {
      aQuestion.withRecipientId('').build()
    }).toThrow('Recipient ID is required')
  })

  it('should have from different than to', () => {
    expect(() => {
      aQuestion.withAskerId('123').withRecipientId('123').build()
    }).toThrow('Question recipient should be different than asker')
  })
})
