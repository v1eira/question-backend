import { type Controller } from '../../../presentation/protocols/controller'
import QuestionPrismaQueryRepository from '../../../infrastructure/db-prisma/question/question-prisma-query-repository'
import UserPrismaRepository from '../../../infrastructure/db-prisma/user/user-prisma-repository'
import FindUnansweredQuestionsQueryHandler from '../../../application/question/query-handlers/find-unanswered-questions/find-unanswered-questions'
import FindUnansweredQuestionsController from '../../../presentation/controllers/question/find-unanswered/find-unanswered-questions-controller'
import prismaClient from '../../../../prisma/prisma'

export const makeFindUnansweredQuestionsController = (): Controller => {
  const questionPrismaRepository = new QuestionPrismaQueryRepository(prismaClient)
  const userPrismaRepository = new UserPrismaRepository(prismaClient)
  const findUnansweredQuestionsQueryHandler = new FindUnansweredQuestionsQueryHandler(userPrismaRepository, questionPrismaRepository)

  return new FindUnansweredQuestionsController(findUnansweredQuestionsQueryHandler)
}
