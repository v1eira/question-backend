import { type Controller } from '../../../presentation/protocols/controller'
import UserPrismaRepository from '../../../infrastructure/db-prisma/user/user-prisma-repository'
import DeleteUserUsecase from '../../../application/user/usecases/delete-user/delete-user-usecase'
import DeleteUserController from '../../../presentation/controllers/user/delete/delete-user-controller'
import prismaClient from '../../../../prisma/prisma'

export const makeDeleteUserController = (): Controller => {
  const userPrismaRepository = new UserPrismaRepository(prismaClient)
  const deleteUserUseCase = new DeleteUserUsecase(userPrismaRepository)

  return new DeleteUserController(deleteUserUseCase)
}
