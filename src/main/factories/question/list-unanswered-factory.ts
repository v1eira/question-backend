import { type Controller } from '../../../presentation/protocols/controller'
import QuestionPrismaQueryRepository from '../../../infrastructure/db-prisma/question/question-prisma-query-repository'
import UserPrismaRepository from '../../../infrastructure/db-prisma/user/user-prisma-repository'
import ListUnansweredQuestionsQueryHandler from '../../../application/question/query-handlers/list-unanswered-questions/list-unanswered-questions'
import ListUnansweredQuestionsController from '../../../presentation/controllers/question/list-unanswered/list-unanswered-questions-controller'
import prismaClient from '../../../../prisma/prisma'

export const makeListUnansweredQuestionsController = (): Controller => {
  const questionPrismaRepository = new QuestionPrismaQueryRepository(prismaClient)
  const userPrismaRepository = new UserPrismaRepository(prismaClient)
  const listUnansweredQuestionsQueryHandler = new ListUnansweredQuestionsQueryHandler(userPrismaRepository, questionPrismaRepository)

  return new ListUnansweredQuestionsController(listUnansweredQuestionsQueryHandler)
}
