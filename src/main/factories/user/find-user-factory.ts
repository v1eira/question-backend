import { type Controller } from '../../../presentation/protocols/controller'
import UserPrismaRepository from '../../../infrastructure/db-prisma/user/user-prisma-repository'
import FindUserUsecase from '../../../application/user/usecases/find-user/find-user-usecase'
import FindUserController from '../../../presentation/controllers/user/find/find-user-controller'
import prismaClient from '../../../../prisma/prisma'

export const makeFindUserController = (): Controller => {
  const userPrismaRepository = new UserPrismaRepository(prismaClient)
  const findUserUseCase = new FindUserUsecase(userPrismaRepository)

  return new FindUserController(findUserUseCase)
}
