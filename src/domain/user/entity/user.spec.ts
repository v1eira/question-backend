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

  it('should change following count', () => {
    const user = anUser.withFollowingCount(0).build()

    expect(user).toBeInstanceOf(User)
    expect(user.followingCount).toEqual(0)

    user.setFollowingCount(5)
    expect(user.followingCount).toEqual(5)
  })

  it('should change liked answers count', () => {
    const user = anUser.withLikedAnswersCount(0).build()

    expect(user).toBeInstanceOf(User)
    expect(user.likedAnswersCount).toEqual(0)

    user.setLikedAnswersCount(5)
    expect(user.likedAnswersCount).toEqual(5)
  })
})
