import { type Controller } from '../../../presentation/protocols/controller'
import UserPrismaRepository from '../../../infrastructure/db-prisma/user/user-prisma-repository'
import QuestionPrismaRepository from '../../../infrastructure/db-prisma/question/question-prisma-repository'
import AnswerPrismaRepository from '../../../infrastructure/db-prisma/answer/answer-prisma-repository'
import GetAnsweredQuestionUsecase from '../../../application/question/usecases/get-answered-question/get-answered-question'
import GetQuestionController from '../../../presentation/controllers/question/get/get-question-controller'
import prismaClient from '../../../../prisma/prisma'

export const makeGetQuestionController = (): Controller => {
  const questionPrismaRepository = new QuestionPrismaRepository(prismaClient)
  const userPrismaRepository = new UserPrismaRepository(prismaClient)
  const answerPrismaRepository = new AnswerPrismaRepository(prismaClient)
  const getQuestionUseCase = new GetAnsweredQuestionUsecase(questionPrismaRepository, answerPrismaRepository, userPrismaRepository)

  return new GetQuestionController(getQuestionUseCase)
}
