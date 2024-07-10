import { type PrismaClient } from '@prisma/client'
import type QuestionRepositoryInterface from '../../../domain/question/repository/question-repository.interface'
import { Question } from '../../../domain/question/entity/question'
import { type QuestionFilters } from '../../../domain/question/repository/question-repository.interface'

interface PrismaQuestion {
  id: string
  content: string
  askerId: string
  recipientId: string
  createdAt: Date
  deletedAt: Date | null
}

export default class QuestionPrismaRepository implements QuestionRepositoryInterface {
  constructor (private readonly prisma: PrismaClient) {}

  async create (question: Question): Promise<void> {
    await this.prisma.question.create({
      data: {
        id: question.id,
        content: question.content,
        askerId: question.askerId,
        recipientId: question.recipientId,
        createdAt: question.createdAt
      }
    })
  }

  async findByID (id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        id
      }
    })
    return question === null ? null : this.toQuestionEntity(question)
  }

  async findRecipientQuestions (recipientId: string): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      where: {
        recipientId
      }
    })
    return questions.map(question => this.toQuestionEntity(question))
  }

  async findAll (filters: QuestionFilters): Promise<Question[]> {
    // TBD
    const questions = await this.prisma.question.findMany({
      where: {
        askerId: {
          in: filters.from
        },
        recipientId: {
          in: filters.to
        },
        content: {
          contains: filters.content
        }
      }
    })
    return questions.map(question => this.toQuestionEntity(question))
  }

  async delete (id: string): Promise<void> {
    await this.prisma.question.delete({
      where: {
        id
      }
    })
  }

  private toQuestionEntity (question: PrismaQuestion): Question {
    const q = new Question({
      id: question.id,
      content: question.content,
      askerId: question.askerId,
      recipientId: question.recipientId
    })
    q.setCreatedAt(question.createdAt)
    question.deletedAt !== null && q.setDeletedAt(question.deletedAt)
    return q
  }
}
