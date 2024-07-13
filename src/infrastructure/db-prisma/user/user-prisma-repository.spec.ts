import { afterAll, beforeAll, describe, expect, it, vitest } from 'vitest'
import UserBuilder from '../../../domain/user/entity/user-data-builder'
import UserPrismaRepository from './user-prisma-repository'
import { PrismaClient } from '@prisma/client'
import { User } from '../../../domain/user/entity/user'

const anUser = new UserBuilder()

describe('UserPrismaRepository tests', () => {
  let prisma: PrismaClient

  beforeAll(async () => {
    prisma = new PrismaClient()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  const userStub = {
    id: '1',
    fullName: 'Test',
    username: 'Test',
    passwordHash: 'Test',
    email: 'Test',
    summary: 'Test',
    location: 'Test',
    profileLocked: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  }

  describe('Create User tests', () => {
    it('Should create a new user', async () => {
      const user = new UserBuilder().withId('1').build()
      const userPrismaRepository = new UserPrismaRepository(prisma)

      vitest.spyOn(prisma.user, 'create').mockResolvedValueOnce(userStub)
      await userPrismaRepository.create(user)

      vitest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(userStub)
      const createdUser = await prisma.user.findUnique({
        where: {
          id: '1'
        }
      })

      expect(createdUser).not.toBeNull()
      expect(createdUser).not.toBeUndefined()
      expect(createdUser).toStrictEqual({
        id: '1',
        fullName: expect.any(String),
        username: expect.any(String),
        passwordHash: expect.any(String),
        email: expect.any(String),
        summary: expect.any(String),
        location: expect.any(String),
        profileLocked: expect.any(Boolean),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: null
      })
    })

    it('Should throw an error if ORM throws an error', async () => {
      const user = new UserBuilder().withId('1').build()
      const userPrismaRepository = new UserPrismaRepository(prisma)

      vitest.spyOn(prisma.user, 'create').mockRejectedValueOnce(new Error())

      await expect(userPrismaRepository.create(user)).rejects.toThrowError()
    })
  })

  describe('Update User tests', () => {
    it('Should update a user', async () => {
      const user = new UserBuilder().withId('1').build()
      const userPrismaRepository = new UserPrismaRepository(prisma)

      vitest.spyOn(prisma.user, 'update').mockResolvedValueOnce(userStub)
      await userPrismaRepository.update(user)

      vitest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(userStub)
      const updatedUser = await prisma.user.findUnique({
        where: {
          id: '1'
        }
      })

      expect(updatedUser).not.toBeNull()
      expect(updatedUser).not.toBeUndefined()
      expect(updatedUser).toStrictEqual({
        id: '1',
        fullName: expect.any(String),
        username: expect.any(String),
        passwordHash: expect.any(String),
        email: expect.any(String),
        summary: expect.any(String),
        location: expect.any(String),
        profileLocked: expect.any(Boolean),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: null
      })
    })

    it('Should throw an error if ORM throws an error', async () => {
      const user = new UserBuilder().withId('1').build()
      const userPrismaRepository = new UserPrismaRepository(prisma)

      vitest.spyOn(prisma.user, 'update').mockRejectedValueOnce(new Error())

      await expect(userPrismaRepository.update(user)).rejects.toThrowError()
    })
  })

  describe('Get User tests', () => {
    it('Should get an user', async () => {
      const userPrismaRepository = new UserPrismaRepository(prisma)

      vitest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(anUser.withId('1').build())
      const foundUserById = await userPrismaRepository.getByID('1')

      vitest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(anUser.withEmail('email@email.com').build())
      const foundUserByEmail = await userPrismaRepository.getByEmail('email@email.com')

      vitest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(anUser.withUsername('user_name').build())
      const foundUserByUsername = await userPrismaRepository.getByUsername('user_name')

      expect(foundUserById).toBeInstanceOf(User)
      expect(foundUserByEmail).toBeInstanceOf(User)
      expect(foundUserByUsername).toBeInstanceOf(User)
      expect(foundUserById).toHaveProperty('id', '1')
      expect(foundUserByEmail).toHaveProperty('email', 'email@email.com')
      expect(foundUserByUsername).toHaveProperty('username', 'user_name')
    })

    it('Should return null if user is not found', async () => {
      const userPrismaRepository = new UserPrismaRepository(prisma)

      vitest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null)
      const foundUserById = await userPrismaRepository.getByID('1')
      const foundUserByEmail = await userPrismaRepository.getByEmail('email@email.com')
      const foundUserByUsername = await userPrismaRepository.getByUsername('user_name')

      expect(foundUserById).toBeNull()
      expect(foundUserByEmail).toBeNull()
      expect(foundUserByUsername).toBeNull()
    })

    it('Should throw an error if ORM throws an error', async () => {
      const userPrismaRepository = new UserPrismaRepository(prisma)

      vitest.spyOn(prisma.user, 'findUnique').mockRejectedValue(new Error())

      await expect(userPrismaRepository.getByID('1')).rejects.toThrowError()
      await expect(userPrismaRepository.getByEmail('email@email.com')).rejects.toThrowError()
      await expect(userPrismaRepository.getByUsername('user_name')).rejects.toThrowError()
    })
  })

  describe('Delete User tests', () => {
    it('Should delete an user', async () => {
      const userPrismaRepository = new UserPrismaRepository(prisma)

      const deleteUser = vitest.spyOn(prisma.user, 'delete').mockResolvedValueOnce(userStub)
      await userPrismaRepository.delete('1')

      expect(deleteUser).toHaveBeenCalledTimes(1)
      expect(deleteUser).not.toThrow()
    })

    it('Should throw an error if ORM throws an error', async () => {
      const userPrismaRepository = new UserPrismaRepository(prisma)

      vitest.spyOn(prisma.user, 'delete').mockRejectedValue(new Error())

      await expect(userPrismaRepository.delete('1')).rejects.toThrowError()
    })
  })
})
