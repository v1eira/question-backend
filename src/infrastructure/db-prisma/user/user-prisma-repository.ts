import { type PrismaClient } from '@prisma/client'
import { User } from '../../../domain/user/entity/user'
import type UserRepositoryInterface from '../../../domain/user/repository/user-repository.interface'

interface PrismaUser {
  id: string
  fullName: string
  username: string
  email: string
  passwordHash: string
  summary: string | null
  location: string | null
  profileLocked: boolean | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export default class UserPrismaRepository implements UserRepositoryInterface {
  constructor (private readonly prisma: PrismaClient) {}

  async create (user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        passwordHash: user.passwordHash,
        summary: user.summary,
        location: user.location,
        profileLocked: user.profileLocked,
        createdAt: user.createdAt
      }
    })
  }

  async update (user: User): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        passwordHash: user.passwordHash,
        summary: user.summary,
        location: user.location,
        profileLocked: user.profileLocked
      }
    })
  }

  async findByID (id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id
      }
    })
    return user === null ? null : this.mapPrismaEntityToUserEntity(user)
  }

  async findByEmail (email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email
      }
    })
    return user === null ? null : this.mapPrismaEntityToUserEntity(user)
  }

  async findByUsername (username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        username
      }
    })
    return user === null ? null : this.mapPrismaEntityToUserEntity(user)
  }

  async findAll (): Promise<User[]> {
    // TBD
    const users = await this.prisma.user.findMany()
    return users.map((user) => this.mapPrismaEntityToUserEntity(user))
  }

  async delete (id: string): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id
      }
    })
  }

  private mapPrismaEntityToUserEntity (user: PrismaUser): User {
    const u = new User({
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      passwordHash: user.passwordHash
    })
    user.summary !== null && u.changeSummary(user.summary)
    user.location !== null && u.changeLocation(user.location)
    user.profileLocked === true ? u.lockProfile() : u.unlockProfile()
    u.setCreatedAt(user.createdAt)
    u.setUpdatedAt(user.updatedAt)
    user.deletedAt !== null && u.setDeletedAt(user.deletedAt)
    return u
  }
}
