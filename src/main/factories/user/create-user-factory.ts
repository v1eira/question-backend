import { type Controller } from '../../../presentation/protocols/controller'
import UserPrismaRepository from '../../../infrastructure/db-prisma/user/user-prisma-repository'
import CreateUserUsecase from '../../../application/user/usecases/create-user/create-user-usecase'
import CreateUserController from '../../../presentation/controllers/user/create/create-user-controller'
import prismaClient from '../../../../prisma/prisma'

export const makeCreateUserController = (): Controller => {
  const userPrismaRepository = new UserPrismaRepository(prismaClient)
  const createUserUseCase = new CreateUserUsecase(userPrismaRepository)

  return new CreateUserController(createUserUseCase)
}
