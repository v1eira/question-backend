import { type Controller } from '../../../presentation/protocols/controller'
import UserPrismaRepository from '../../../infrastructure/db-prisma/user/user-prisma-repository'
import UpdateUserUsecase from '../../../application/user/usecases/update-user/update-user-usecase'
import UpdateUserController from '../../../presentation/controllers/user/update/update-user-controller'
import prismaClient from '../../../../prisma/prisma'

export const makeUpdateUserController = (): Controller => {
  const userPrismaRepository = new UserPrismaRepository(prismaClient)
  const updateUserUseCase = new UpdateUserUsecase(userPrismaRepository)

  return new UpdateUserController(updateUserUseCase)
}
