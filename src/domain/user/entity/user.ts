interface UserProps {
  id: string
  fullName: string
  username: string
  email: string
  passwordHash: string
  summary?: string
  location?: string
  profileLocked?: boolean
  followersCount?: number
  followingCount?: number
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

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
  private _createdAt: Date
  private _updatedAt: Date | null
  private _deletedAt: Date | null

  constructor (props: UserProps) {
    this._id = props.id
    this._fullName = props.fullName
    this._username = props.username
    this._email = props.email
    this._passwordHash = props.passwordHash
    this._summary = props.summary ?? ''
    this._location = props.location ?? ''
    this._profileLocked = props.profileLocked ?? false
    this._followersCount = props.followersCount ?? 0
    this._followingCount = props.followingCount ?? 0
    this._createdAt = props.createdAt ?? new Date()
    this._updatedAt = props.updatedAt ?? null
    this._deletedAt = props.deletedAt ?? null
    this.validate()
  }

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

  get createdAt (): Date {
    return this._createdAt
  }

  setCreatedAt (createdAt: Date): void {
    this._createdAt = createdAt
  }

  get updatedAt (): Date | null {
    return this._updatedAt
  }

  setUpdatedAt (updatedAt: Date): void {
    this._updatedAt = updatedAt
  }

  get deletedAt (): Date | null {
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
  }
}
