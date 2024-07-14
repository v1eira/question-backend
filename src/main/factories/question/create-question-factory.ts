import { type Controller } from '../../../presentation/protocols/controller'
import UserPrismaRepository from '../../../infrastructure/db-prisma/user/user-prisma-repository'
import QuestionPrismaRepository from '../../../infrastructure/db-prisma/question/question-prisma-repository'
import CreateQuestionUsecase from '../../../application/question/usecases/create-question/create-question-usecase'
import CreateQuestionController from '../../../presentation/controllers/question/create/create-question-controller'
import prismaClient from '../../../../prisma/prisma'

export const makeCreateQuestionController = (): Controller => {
  const questionPrismaRepository = new QuestionPrismaRepository(prismaClient)
  const userPrismaRepository = new UserPrismaRepository(prismaClient)
  const createQuestionUseCase = new CreateQuestionUsecase(questionPrismaRepository, userPrismaRepository)

  return new CreateQuestionController(createQuestionUseCase)
}
