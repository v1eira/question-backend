import { PrismaClient } from '@prisma/client'
import { describe, beforeAll, afterAll, vitest, it, expect } from 'vitest'
import AnswerBuilder from '../../../domain/answer/entity/answer-data-builder'
import AnswerPrismaRepository from './answer-prisma-repository'
import { Answer } from '../../../domain/answer/entity/answer'

const aAnswer = new AnswerBuilder()

describe('AnswerPrismaRepository tests', () => {
  let prisma: PrismaClient

  beforeAll(async () => {
    prisma = new PrismaClient()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  const answerStub = {
    id: '1',
    content: 'content',
    responderId: 'responder_id',
    questionId: 'question_id',
    createdAt: new Date(),
    deletedAt: null
  }

  describe('Create Answer tests', () => {
    it('Should create a new answer', async () => {
      const answer = aAnswer.withId('1').build()
      const answerPrismaRepository = new AnswerPrismaRepository(prisma)

      vitest.spyOn(prisma.answer, 'create').mockResolvedValueOnce(answerStub)
      await answerPrismaRepository.create(answer)

      vitest.spyOn(prisma.answer, 'findUnique').mockResolvedValueOnce(answerStub)
      const createdAnswer = await prisma.answer.findUnique({
        where: {
          id: '1'
        }
      })

      expect(createdAnswer).not.toBeNull()
      expect(createdAnswer).not.toBeUndefined()
      expect(createdAnswer).toStrictEqual({
        id: '1',
        content: expect.any(String),
        responderId: expect.any(String),
        questionId: expect.any(String),
        createdAt: expect.any(Date),
        deletedAt: null
      })
    })

    it('Should throw an error if ORM throws an error', async () => {
      const answer = aAnswer.withId('1').build()
      const answerPrismaRepository = new AnswerPrismaRepository(prisma)

      vitest.spyOn(prisma.answer, 'create').mockRejectedValueOnce(new Error())

      await expect(answerPrismaRepository.create(answer)).rejects.toThrowError()
    })
  })

  describe('Get Answer tests', () => {
    it('Should get a answer', async () => {
      const answerPrismaRepository = new AnswerPrismaRepository(prisma)

      vitest.spyOn(prisma.answer, 'findUnique').mockResolvedValue(aAnswer.withId('1').build())
      const foundAnswerById = await answerPrismaRepository.getByID('1')
      const foundAnswerByQuestionId = await answerPrismaRepository.getByQuestionID('2')

      expect(foundAnswerById).toBeInstanceOf(Answer)
      expect(foundAnswerByQuestionId).toBeInstanceOf(Answer)
      expect(foundAnswerById).toHaveProperty('id', '1')
      expect(foundAnswerByQuestionId).toHaveProperty('id', '1')
      expect(foundAnswerById).toEqual(foundAnswerByQuestionId)
    })

    it('Should return null if answer is not found', async () => {
      const answerPrismaRepository = new AnswerPrismaRepository(prisma)

      vitest.spyOn(prisma.answer, 'findUnique').mockResolvedValue(null)
      const foundAnswerById = await answerPrismaRepository.getByID('222')
      const foundAnswerByQuestionId = await answerPrismaRepository.getByQuestionID('333')

      expect(foundAnswerById).toBeNull()
      expect(foundAnswerByQuestionId).toBeNull()
    })

    it('Should throw an error if ORM throws an error', async () => {
      const answerPrismaRepository = new AnswerPrismaRepository(prisma)

      vitest.spyOn(prisma.answer, 'findUnique').mockRejectedValue(new Error())

      await expect(answerPrismaRepository.getByID('1')).rejects.toThrowError()
      await expect(answerPrismaRepository.getByQuestionID('1')).rejects.toThrowError()
    })
  })

  describe('Delete Answer tests', () => {
    it('Should delete a answer', async () => {
      const answerPrismaRepository = new AnswerPrismaRepository(prisma)

      const deleteAnswer = vitest.spyOn(prisma.answer, 'delete').mockResolvedValueOnce(answerStub)
      await answerPrismaRepository.delete('1')

      expect(deleteAnswer).toHaveBeenCalledTimes(1)
      expect(deleteAnswer).not.toThrow()
    })

    it('Should throw an error if ORM throws an error', async () => {
      const answerPrismaRepository = new AnswerPrismaRepository(prisma)

      vitest.spyOn(prisma.answer, 'delete').mockRejectedValue(new Error())

      await expect(answerPrismaRepository.delete('1')).rejects.toThrowError()
    })
  })
})
