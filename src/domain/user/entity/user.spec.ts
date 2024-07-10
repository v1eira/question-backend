import { beforeEach, describe, expect, it } from 'vitest'
import { User } from './user'
import UserBuilder from './user-data-builder'

describe('User entity tests', () => {
  let anUser: UserBuilder
  beforeEach(() => {
    anUser = new UserBuilder()
  })
  it('should create an user', () => {
    const user = anUser.withUsername('johndoe').build()

    expect(user).toBeInstanceOf(User)
    expect(user.username).toEqual('johndoe')
  })

  it('should have ID filled', () => {
    expect(() => {
      anUser.withId('').build()
    }).toThrow('ID is required')
  })

  it('should have name filled', () => {
    expect(() => {
      anUser.withFullname('').build()
    }).toThrow('Full name is required')
  })

  it('should have username filled', () => {
    expect(() => {
      anUser.withUsername('').build()
    }).toThrow('Username is required')
  })

  it('should have email filled', () => {
    expect(() => {
      anUser.withEmail('').build()
    }).toThrow('Email is required')
  })

  it('should have password filled', () => {
    expect(() => {
      anUser.withPasswordHash('').build()
    }).toThrow('Password is required')
  })

  it('should change username', () => {
    const user = anUser.withUsername('johndoe').build()

    expect(user).toBeInstanceOf(User)
    expect(user.username).toEqual('johndoe')

    user.changeUsername('j0hn-d0e')
    expect(user.username).toEqual('j0hn-d0e')
  })

  it('should change summary', () => {
    const user = anUser.withSummary('This is my summary').build()

    expect(user).toBeInstanceOf(User)
    expect(user.summary).toEqual('This is my summary')

    user.changeSummary('My updated summary')
    expect(user.summary).toEqual('My updated summary')
  })

  it('should change location', () => {
    const user = anUser.withLocation('NY, USA').build()

    expect(user).toBeInstanceOf(User)
    expect(user.location).toEqual('NY, USA')

    user.changeLocation('MA, USA')
    expect(user.location).toEqual('MA, USA')
  })

  it('should lock profile', () => {
    const user = anUser.withProfileLocked(false).build()

    expect(user).toBeInstanceOf(User)
    expect(user.profileLocked).toEqual(false)

    user.lockProfile()
    expect(user.profileLocked).toEqual(true)
  })

  it('should unlock profile', () => {
    const user = anUser.withProfileLocked(true).build()

    expect(user).toBeInstanceOf(User)
    expect(user.profileLocked).toEqual(true)

    user.unlockProfile()
    expect(user.profileLocked).toEqual(false)
  })

  it('should change followers count', () => {
    const user = anUser.withFollowersCount(0).build()

    expect(user).toBeInstanceOf(User)
    expect(user.followersCount).toEqual(0)

    user.setFollowersCount(5)
    expect(user.followersCount).toEqual(5)
  })

  it('should not create user with negative followers count', () => {
    expect(() => {
      anUser.withFollowersCount(-5).build()
    }).toThrow('Followers count cant be less than 0')
  })

  it('should not change followers count if value is negative', () => {
    const user = anUser.withFollowersCount(0).build()

    expect(user).toBeInstanceOf(User)
    expect(user.followersCount).toEqual(0)

    expect(() => {
      user.setFollowersCount(-5)
    }).toThrow('Followers count cant be less than 0')
  })

  it('should change following count', () => {
    const user = anUser.withFollowingCount(0).build()

    expect(user).toBeInstanceOf(User)
    expect(user.followingCount).toEqual(0)

    user.setFollowingCount(5)
    expect(user.followingCount).toEqual(5)
  })

  it('should not create user with negative following count', () => {
    expect(() => {
      anUser.withFollowingCount(-5).build()
    }).toThrow('Following count cant be less than 0')
  })

  it('should not change following count if value is negative', () => {
    const user = anUser.withFollowingCount(0).build()

    expect(user).toBeInstanceOf(User)
    expect(user.followingCount).toEqual(0)

    expect(() => {
      user.setFollowingCount(-5)
    }).toThrow('Following count cant be less than 0')
  })

  it('should change updatedAt', () => {
    const user = anUser.build()
    expect(user).toBeInstanceOf(User)
    user.setUpdatedAt(new Date('2022-01-01'))
    expect(user.updatedAt).toEqual(new Date('2022-01-01'))
  })

  it('should change deletedAt', () => {
    const user = anUser.build()
    expect(user).toBeInstanceOf(User)
    user.setDeletedAt(new Date('2022-01-01'))
    expect(user.deletedAt).toEqual(new Date('2022-01-01'))
  })
})
