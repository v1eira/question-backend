import { User } from './user'

export default class UserBuilder {
  private id: string = 'user-1'
  private fullName: string = 'John Doe'
  private username: string = 'johndoe'
  private email: string = 'johndoe@email.com'
  private passwordHash: string = '123ASD456ZXC'
  private summary: string = 'This is the John Doe summary'
  private location: string = 'Somewhere'
  private profileLocked: boolean = false
  private followersCount: number = 0
  private followingCount: number = 0

  public withId (id: string): this {
    this.id = id
    return this
  }

  public withFullname (fullName: string): this {
    this.fullName = fullName
    return this
  }

  public withUsername (username: string): this {
    this.username = username
    return this
  }

  public withEmail (email: string): this {
    this.email = email
    return this
  }

  public withPasswordHash (passwordHash: string): this {
    this.passwordHash = passwordHash
    return this
  }

  public withSummary (summary: string): this {
    this.summary = summary
    return this
  }

  public withLocation (location: string): this {
    this.location = location
    return this
  }

  public withProfileLocked (profileLocked: boolean): this {
    this.profileLocked = profileLocked
    return this
  }

  public withFollowersCount (followersCount: number): this {
    this.followersCount = followersCount
    return this
  }

  public withFollowingCount (followingCount: number): this {
    this.followingCount = followingCount
    return this
  }

  public build (): User {
    return new User({
      id: this.id,
      fullName: this.fullName,
      username: this.username,
      email: this.email,
      passwordHash: this.passwordHash,
      summary: this.summary,
      location: this.location,
      profileLocked: this.profileLocked,
      followersCount: this.followersCount,
      followingCount: this.followingCount
    })
  }
}
