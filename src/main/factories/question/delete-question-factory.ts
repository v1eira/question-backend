import { type Controller } from '../../../presentation/protocols/controller'
import QuestionPrismaRepository from '../../../infrastructure/db-prisma/question/question-prisma-repository'
import DeleteQuestionUsecase from '../../../application/question/usecases/delete-question/delete-question-usecase'
import DeleteQuestionController from '../../../presentation/controllers/question/delete/delete-question-controller'
import prismaClient from '../../../../prisma/prisma'

export const makeDeleteQuestionController = (): Controller => {
  const questionPrismaRepository = new QuestionPrismaRepository(prismaClient)
  const deleteQuestionUseCase = new DeleteQuestionUsecase(questionPrismaRepository)

  return new DeleteQuestionController(deleteQuestionUseCase)
}
