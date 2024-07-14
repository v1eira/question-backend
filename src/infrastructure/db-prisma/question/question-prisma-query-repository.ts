import { type PrismaClient } from '@prisma/client'
import { type AnsweredQuestion, type QuestionWithAsker, type SearchParams, type QuestionQueryInterface } from '../../../domain/question/query/question-query.interface'
import { Question } from '../../../domain/question/entity/question'
import { User } from '../../../domain/user/entity/user'

export default class QuestionPrismaQueryRepository implements QuestionQueryInterface {
  constructor (private readonly prisma: PrismaClient) {}

  findAnsweredQuestions: (params: SearchParams) => Promise<AnsweredQuestion[]>

  async findUserUnansweredQuestions (userId: string): Promise<QuestionWithAsker[]> {
    const questions = await this.prisma.question.findMany({
      where: {
        recipientId: userId,
        Answer: {
          is: null
        }
      },
      include: {
        asker: true
      }
    })

    return questions.length === 0
      ? []
      : questions.map((q) => this.toQuestionWithAsker(q))
  }

  private toQuestionWithAsker (question: any): QuestionWithAsker {
    const q = new Question({
      id: question.id,
      content: question.content,
      askerId: question.askerId,
      recipientId: question.recipientId,
      createdAt: question.createdAt
    })
    const u = new User({
      id: question.asker.id,
      fullName: question.asker.fullName,
      username: question.asker.username,
      email: question.asker.email,
      passwordHash: question.asker.passwordHash
    })
    return {
      question: q,
      asker: u
    }
  }
}
