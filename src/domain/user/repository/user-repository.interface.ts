import { type User } from '../entity/user'

export default interface UserRepositoryInterface {
  create: (user: User) => Promise<void>
  update: (user: User) => Promise<void>
  findByID: (id: string) => Promise<User | null>
  findByEmail: (email: string) => Promise<User | null>
  findByUsername: (username: string) => Promise<User | null>
  findAll: (filters: string) => Promise<User[]>
  delete: (id: string) => Promise<void>
  // block: (id: string) => Promise<void>
  // unblock: (id: string) => Promise<void>
  // getBlockedUsers: (id: string) => Promise<User[]>
  // follow: (id: string) => Promise<void>
  // unfollow: (id: string) => Promise<void>
  // getFollowers: (id: string) => Promise<User[]>
  // getFollowing: (id: string) => Promise<User[]>
}
