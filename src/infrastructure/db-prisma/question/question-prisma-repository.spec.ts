import { PrismaClient } from '@prisma/client'
import { describe, beforeAll, afterAll, vitest, it, expect } from 'vitest'
import QuestionBuilder from '../../../domain/question/entity/question-data-builder'
import QuestionPrismaRepository from './question-prisma-repository'
import { Question } from '../../../domain/question/entity/question'

const aQuestion = new QuestionBuilder()

describe('QuestionPrismaRepository tests', () => {
  let prisma: PrismaClient

  beforeAll(async () => {
    prisma = new PrismaClient()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  const questionStub = {
    id: '1',
    content: 'Test',
    askerId: 'Test',
    recipientId: 'Test',
    createdAt: new Date(),
    deletedAt: null
  }

  describe('Create Question tests', () => {
    it('Should create a new question', async () => {
      const question = aQuestion.withId('1').build()
      const questionPrismaRepository = new QuestionPrismaRepository(prisma)

      vitest.spyOn(prisma.question, 'create').mockResolvedValueOnce(questionStub)
      await questionPrismaRepository.create(question)

      vitest.spyOn(prisma.question, 'findUnique').mockResolvedValueOnce(questionStub)
      const createdQuestion = await prisma.question.findUnique({
        where: {
          id: '1'
        }
      })

      expect(createdQuestion).not.toBeNull()
      expect(createdQuestion).not.toBeUndefined()
      expect(createdQuestion).toStrictEqual({
        id: '1',
        content: expect.any(String),
        askerId: expect.any(String),
        recipientId: expect.any(String),
        createdAt: expect.any(Date),
        deletedAt: null
      })
    })

    it('Should throw an error if ORM throws an error', async () => {
      const question = aQuestion.withId('1').build()
      const questionPrismaRepository = new QuestionPrismaRepository(prisma)

      vitest.spyOn(prisma.question, 'create').mockRejectedValueOnce(new Error())

      await expect(questionPrismaRepository.create(question)).rejects.toThrowError()
    })
  })

  describe('Get Question tests', () => {
    it('Should get a question', async () => {
      const questionPrismaRepository = new QuestionPrismaRepository(prisma)

      vitest.spyOn(prisma.question, 'findUnique').mockResolvedValueOnce(aQuestion.withId('1').build())
      const foundQuestion = await questionPrismaRepository.getByID('1')

      expect(foundQuestion).toBeInstanceOf(Question)
      expect(foundQuestion).toHaveProperty('id', '1')
    })

    it('Should return null if question is not found', async () => {
      const questionPrismaRepository = new QuestionPrismaRepository(prisma)

      vitest.spyOn(prisma.question, 'findUnique').mockResolvedValue(null)
      const foundQuestion = await questionPrismaRepository.getByID('1')

      expect(foundQuestion).toBeNull()
    })

    it('Should throw an error if ORM throws an error', async () => {
      const questionPrismaRepository = new QuestionPrismaRepository(prisma)

      vitest.spyOn(prisma.question, 'findUnique').mockRejectedValue(new Error())

      await expect(questionPrismaRepository.getByID('1')).rejects.toThrowError()
    })
  })

  describe('Delete Question tests', () => {
    it('Should delete a question', async () => {
      const questionPrismaRepository = new QuestionPrismaRepository(prisma)

      const deleteQuestion = vitest.spyOn(prisma.question, 'delete').mockResolvedValueOnce(questionStub)
      await questionPrismaRepository.delete('1')

      expect(deleteQuestion).toHaveBeenCalledTimes(1)
      expect(deleteQuestion).not.toThrow()
    })

    it('Should throw an error if ORM throws an error', async () => {
      const questionPrismaRepository = new QuestionPrismaRepository(prisma)

      vitest.spyOn(prisma.question, 'delete').mockRejectedValue(new Error())

      await expect(questionPrismaRepository.delete('1')).rejects.toThrowError()
    })
  })
})
