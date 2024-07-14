import { type Controller } from '../../../presentation/protocols/controller'
import AnswerPrismaRepository from '../../../infrastructure/db-prisma/answer/answer-prisma-repository'
import UserPrismaRepository from '../../../infrastructure/db-prisma/user/user-prisma-repository'
import QuestionPrismaRepository from '../../../infrastructure/db-prisma/question/question-prisma-repository'
import CreateAnswerUsecase from '../../../application/answer/usecases/create-answer/create-answer-usecase'
import CreateAnswerController from '../../../presentation/controllers/answer/create/create-answer-controller'
import prismaClient from '../../../../prisma/prisma'

export const makeCreateAnswerController = (): Controller => {
  const answerPrismaRepository = new AnswerPrismaRepository(prismaClient)
  const userPrismaRepository = new UserPrismaRepository(prismaClient)
  const questionPrismaRepository = new QuestionPrismaRepository(prismaClient)
  const createAnswerUseCase = new CreateAnswerUsecase(answerPrismaRepository, userPrismaRepository, questionPrismaRepository)

  return new CreateAnswerController(createAnswerUseCase)
}
