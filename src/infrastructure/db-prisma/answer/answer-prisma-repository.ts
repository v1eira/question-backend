import { type PrismaClient } from '@prisma/client'
import type AnswerRepositoryInterface from '../../../domain/answer/repository/answer-repository.interface'
import { Answer } from '../../../domain/answer/entity/answer'
import { type AnswerFilters } from '../../../domain/answer/repository/answer-repository.interface'

interface PrismaAnswer {
  id: string
  content: string
  responderId: string
  questionId: string
  createdAt: Date
  deletedAt: Date | null
}

export default class AnswerPrismaRepository implements AnswerRepositoryInterface {
  constructor (private readonly prisma: PrismaClient) {}

  async create (answer: Answer): Promise<void> {
    await this.prisma.answer.create({
      data: {
        id: answer.id,
        content: answer.content,
        responderId: answer.responderId,
        questionId: answer.questionId
      }
    })
  }

  async getByID (id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({
      where: {
        id
      }
    })
    return answer == null ? null : this.toAnswerEntity(answer)
  }

  async getByQuestionID (questionId: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({
      where: {
        questionId
      }
    })
    return answer == null ? null : this.toAnswerEntity(answer)
  }

  async getAll (filters: AnswerFilters): Promise<Answer[]> {
    // TBD
    const answers = await this.prisma.answer.findMany({
      where: {
        responderId: filters.responderId,
        content: {
          contains: filters.content
        }
      }
    })
    return answers.map(answer => this.toAnswerEntity(answer))
  }

  async delete (id: string): Promise<void> {
    await this.prisma.answer.delete({
      where: {
        id
      }
    })
  }

  private toAnswerEntity (answer: PrismaAnswer): Answer {
    const a = new Answer({
      id: answer.id,
      content: answer.content,
      responderId: answer.responderId,
      questionId: answer.questionId,
      createdAt: answer.createdAt
    })
    answer.deletedAt !== null && a.setDeletedAt(answer.deletedAt)
    return a
  }
}
