export class User {
  private readonly _id: string
  private _fullName: string
  private _username: string
  private readonly _email: string
  private _passwordHash: string
  private _summary: string
  private _location: string
  private _profileLocked: boolean
  private _followersCount: number
  private _followingCount: number
  private _likedAnswersCount: number
  private _createdAt: Date
  private _updatedAt: Date
  private _deletedAt: Date

  get id (): string {
    return this._id
  }

  get fullName (): string {
    return this._fullName
  }

  changeFullName (fullName: string): void {
    this._fullName = fullName
  }

  get username (): string {
    return this._username
  }

  changeUsername (username: string): void {
    this._username = username
  }

  get email (): string {
    return this._email
  }

  get passwordHash (): string {
    return this._passwordHash
  }

  changePasswordHash (passwordHash: string): void {
    this._passwordHash = passwordHash
  }

  get summary (): string {
    return this._summary
  }

  changeSummary (summary: string): void {
    this._summary = summary
  }

  get location (): string {
    return this._location
  }

  changeLocation (location: string): void {
    this._location = location
  }

  get profileLocked (): boolean {
    return this._profileLocked
  }

  lockProfile (): void {
    this._profileLocked = true
  }

  unlockProfile (): void {
    this._profileLocked = false
  }

  get followersCount (): number {
    return this._followersCount
  }

  setFollowersCount (followersCount: number): void {
    if (followersCount < 0) {
      throw new Error('Followers count cant be less than 0')
    }
    this._followersCount = followersCount
  }

  get followingCount (): number {
    return this._followingCount
  }

  setFollowingCount (followingCount: number): void {
    if (followingCount < 0) {
      throw new Error('Following count cant be less than 0')
    }
    this._followingCount = followingCount
  }

  get likedAnswersCount (): number {
    return this._likedAnswersCount
  }

  setLikedAnswersCount (likedAnswersCount: number): void {
    if (likedAnswersCount < 0) {
      throw new Error('Liked answers count cant be less than 0')
    }
    this._likedAnswersCount = likedAnswersCount
  }

  get createdAt (): Date {
    return this._createdAt
  }

  setCreatedAt (createdAt: Date): void {
    this._createdAt = createdAt
  }

  get updatedAt (): Date {
    return this._updatedAt
  }

  setUpdatedAt (updatedAt: Date): void {
    this._updatedAt = updatedAt
  }

  get deletedAt (): Date {
    return this._deletedAt
  }

  setDeletedAt (deletedAt: Date): void {
    this._deletedAt = deletedAt
  }

  private validate (): void {
    if (this.id.length === 0) {
      throw new Error('ID is required')
    }

    if (this.fullName.length === 0) {
      throw new Error('Full name is required')
    }

    if (this.username.length === 0) {
      throw new Error('Username is required')
    }

    if (this.email.length === 0) {
      throw new Error('Email is required')
    }

    if (this._passwordHash.length === 0) {
      throw new Error('Password is required')
    }

    if (this.followersCount < 0) {
      throw new Error('Followers count cant be less than 0')
    }

    if (this.followingCount < 0) {
      throw new Error('Following count cant be less than 0')
    }

    if (this.likedAnswersCount < 0) {
      throw new Error('Liked answers count cant be less than 0')
    }
  }

  constructor ({
    id,
    fullName,
    username,
    email,
    passwordHash,
    summary = '',
    location = '',
    profileLocked = false,
    followersCount = 0,
    followingCount = 0,
    likedAnswersCount = 0
  }) {
    this._id = id
    this._fullName = fullName
    this._username = username
    this._email = email
    this._passwordHash = passwordHash
    this._summary = summary
    this._location = location
    this._profileLocked = profileLocked
    this._followersCount = followersCount
    this._followingCount = followingCount
    this._likedAnswersCount = likedAnswersCount
    this._createdAt = new Date()
    this.validate()
  }
}
