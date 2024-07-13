import { type Controller } from '../../../presentation/protocols/controller'
import UserPrismaRepository from '../../../infrastructure/db-prisma/user/user-prisma-repository'
import QuestionPrismaRepository from '../../../infrastructure/db-prisma/question/question-prisma-repository'
import AnswerPrismaRepository from '../../../infrastructure/db-prisma/answer/answer-prisma-repository'
import FindAnsweredQuestionUsecase from '../../../application/question/usecases/find-answered-question/find-answered-question'
import FindQuestionController from '../../../presentation/controllers/question/find/find-question-controller'
import prismaClient from '../../../../prisma/prisma'

export const makeFindQuestionController = (): Controller => {
  const questionPrismaRepository = new QuestionPrismaRepository(prismaClient)
  const userPrismaRepository = new UserPrismaRepository(prismaClient)
  const answerPrismaRepository = new AnswerPrismaRepository(prismaClient)
  const findQuestionUseCase = new FindAnsweredQuestionUsecase(questionPrismaRepository, answerPrismaRepository, userPrismaRepository)

  return new FindQuestionController(findQuestionUseCase)
}
