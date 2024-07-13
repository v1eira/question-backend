import { type Controller } from '../../../presentation/protocols/controller'
import UserPrismaRepository from '../../../infrastructure/db-prisma/user/user-prisma-repository'
import GetUserUsecase from '../../../application/user/usecases/get-user/get-user-usecase'
import GetUserController from '../../../presentation/controllers/user/get/get-user-controller'
import prismaClient from '../../../../prisma/prisma'

export const makeGetUserController = (): Controller => {
  const userPrismaRepository = new UserPrismaRepository(prismaClient)
  const getUserUseCase = new GetUserUsecase(userPrismaRepository)

  return new GetUserController(getUserUseCase)
}
