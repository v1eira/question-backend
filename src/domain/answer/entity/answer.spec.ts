import { describe, it, expect, beforeEach } from 'vitest'
import AnswerBuilder from './answer-data-builder'

describe('Answer entity tests', () => {
  let anAnswer: AnswerBuilder
  beforeEach(() => {
    anAnswer = new AnswerBuilder()
  })
  it('Should create an answer with the given id and content', () => {
    const answer = anAnswer
      .withId('1')
      .withContent('This is an answer')
      .withResponderId('userId')
      .withQuestionId('questionId')
      .build()
    expect(answer.id).toBe('1')
    expect(answer.content).toBe('This is an answer')
    expect(answer.responderId).toBe('userId')
    expect(answer.questionId).toBe('questionId')
    expect(answer.likes).toBe(0)
    expect(answer.createdAt).toBeInstanceOf(Date)
  })

  it('Should throw an error if id is empty', () => {
    expect(() => anAnswer.withId('').build()).toThrow('ID is required')
  })

  it('Should throw an error if content is empty', () => {
    expect(() => anAnswer.withContent('').build()).toThrow('Content is required')
  })

  it('Should throw an error if responderId is empty', () => {
    expect(() => anAnswer.withResponderId('').build()).toThrow('ResponderId is required')
  })

  it('Should throw an error if question is empty', () => {
    expect(() => anAnswer.withQuestionId('').build()).toThrow('QuestionId is required')
  })

  it('Should throw an error if likes value is negative', () => {
    expect(() => anAnswer.withLikes(-1).build()).toThrow('Likes must be greater than 0')
  })

  it('Should throw an error if likes value is not an integer', () => {
    expect(() => anAnswer.withLikes(1.5).build()).toThrow('Likes must be an integer')
  })

  it('Should set the likes correctly', () => {
    const answer = anAnswer.withLikes(5).build()
    expect(answer.likes).toBe(5)
  })
})
