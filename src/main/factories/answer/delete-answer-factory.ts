import { type Controller } from '../../../presentation/protocols/controller'
import AnswerPrismaRepository from '../../../infrastructure/db-prisma/answer/answer-prisma-repository'
import DeleteAnswerUsecase from '../../../application/answer/usecases/delete-answer/delete-answer-usecase'
import DeleteAnswerController from '../../../presentation/controllers/answer/delete/delete-answer-controller'
import prismaClient from '../../../../prisma/prisma'

export const makeDeleteAnswerController = (): Controller => {
  const answerPrismaRepository = new AnswerPrismaRepository(prismaClient)
  const deleteAnswerUseCase = new DeleteAnswerUsecase(answerPrismaRepository)

  return new DeleteAnswerController(deleteAnswerUseCase)
}
